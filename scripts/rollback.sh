#!/bin/bash

# TradyGo Rollback Script
# This script rolls back to a previous deployment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/srv/tradygo"
BACKUP_DIR="$PROJECT_DIR/shared/backups"
LOG_FILE="$PROJECT_DIR/logs/rollback.log"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Function to list available backups
list_backups() {
    echo -e "\n${BLUE}=== AVAILABLE DATABASE BACKUPS ===${NC}"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR/*.sql.gz 2>/dev/null)" ]; then
        ls -la "$BACKUP_DIR"/*.sql.gz | awk '{print NR ". " $9 " (" $5 " bytes, " $6 " " $7 " " $8 ")"}'
    else
        echo "No database backups found in $BACKUP_DIR"
        return 1
    fi
}

# Function to list available Docker images
list_images() {
    echo -e "\n${BLUE}=== AVAILABLE DOCKER IMAGES ===${NC}"
    echo "API Images:"
    docker images ghcr.io/tradygo/api --format "table {{.Tag}}\t{{.CreatedAt}}\t{{.Size}}"
    echo "\nWeb Images:"
    docker images ghcr.io/tradygo/web --format "table {{.Tag}}\t{{.CreatedAt}}\t{{.Size}}"
    echo "\nAdmin Images:"
    docker images ghcr.io/tradygo/admin --format "table {{.Tag}}\t{{.CreatedAt}}\t{{.Size}}"
    echo "\nSeller Images:"
    docker images ghcr.io/tradygo/seller --format "table {{.Tag}}\t{{.CreatedAt}}\t{{.Size}}"
}

# Function to rollback database
rollback_database() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
    fi
    
    log "Rolling back database from: $backup_file"
    
    # Create a backup of current state before rollback
    local current_backup="$BACKUP_DIR/pre_rollback_$(date +%Y%m%d_%H%M%S).sql.gz"
    log "Creating backup of current state: $current_backup"
    docker exec tradygo-postgres pg_dump -U tradygo tradygo_core | gzip > "$current_backup"
    
    # Stop application services
    log "Stopping application services..."
    docker-compose -f "$COMPOSE_FILE" stop api web admin seller webhook worker
    
    # Drop and recreate database
    log "Dropping and recreating database..."
    docker exec tradygo-postgres psql -U tradygo -c "DROP DATABASE IF EXISTS tradygo_core;"
    docker exec tradygo-postgres psql -U tradygo -c "CREATE DATABASE tradygo_core;"
    
    # Restore from backup
    log "Restoring database from backup..."
    gunzip -c "$backup_file" | docker exec -i tradygo-postgres psql -U tradygo -d tradygo_core
    
    log "Database rollback completed"
}

# Function to rollback Docker images
rollback_images() {
    local tag="$1"
    
    log "Rolling back Docker images to tag: $tag"
    
    # Update docker-compose.yml to use specific tag
    sed -i.bak "s|ghcr.io/tradygo/\([^:]*\):.*|ghcr.io/tradygo/\1:$tag|g" "$COMPOSE_FILE"
    
    # Pull the specific images
    docker-compose -f "$COMPOSE_FILE" pull
    
    log "Docker images rollback completed"
}

# Main script
log "Starting TradyGo rollback process..."

echo -e "${BLUE}=== TRADYGO ROLLBACK UTILITY ===${NC}"
echo "This script helps you rollback your TradyGo deployment."
echo ""
echo "Rollback options:"
echo "1. Rollback database only"
echo "2. Rollback Docker images only"
echo "3. Full rollback (database + images)"
echo "4. List available backups and images"
echo "5. Exit"
echo ""
read -p "Choose an option (1-5): " ROLLBACK_OPTION

case $ROLLBACK_OPTION in
    1)
        log "Database rollback selected"
        if list_backups; then
            echo ""
            read -p "Enter the number of the backup to restore: " BACKUP_NUM
            BACKUP_FILE=$(ls "$BACKUP_DIR"/*.sql.gz | sed -n "${BACKUP_NUM}p")
            if [ -n "$BACKUP_FILE" ]; then
                echo -e "\n${YELLOW}WARNING: This will replace your current database with the selected backup.${NC}"
                read -p "Are you sure you want to continue? (y/N): " CONFIRM
                if [[ $CONFIRM == "y" || $CONFIRM == "Y" ]]; then
                    rollback_database "$BACKUP_FILE"
                    
                    # Restart services
                    log "Restarting application services..."
                    docker-compose -f "$COMPOSE_FILE" up -d api web admin seller webhook worker
                    
                    log "Database rollback completed successfully"
                else
                    log "Rollback cancelled"
                fi
            else
                error "Invalid backup selection"
            fi
        fi
        ;;
    2)
        log "Docker images rollback selected"
        list_images
        echo ""
        read -p "Enter the tag to rollback to (e.g., v1.0.0, latest): " IMAGE_TAG
        if [ -n "$IMAGE_TAG" ]; then
            echo -e "\n${YELLOW}WARNING: This will change all service images to tag: $IMAGE_TAG${NC}"
            read -p "Are you sure you want to continue? (y/N): " CONFIRM
            if [[ $CONFIRM == "y" || $CONFIRM == "Y" ]]; then
                rollback_images "$IMAGE_TAG"
                
                # Restart services with new images
                log "Restarting services with rollback images..."
                docker-compose -f "$COMPOSE_FILE" down
                docker-compose -f "$COMPOSE_FILE" up -d
                
                log "Docker images rollback completed successfully"
            else
                log "Rollback cancelled"
            fi
        else
            error "No tag specified"
        fi
        ;;
    3)
        log "Full rollback selected"
        
        # List backups and images
        list_backups
        list_images
        
        echo ""
        read -p "Enter the number of the database backup to restore: " BACKUP_NUM
        read -p "Enter the Docker image tag to rollback to: " IMAGE_TAG
        
        BACKUP_FILE=$(ls "$BACKUP_DIR"/*.sql.gz | sed -n "${BACKUP_NUM}p")
        
        if [ -n "$BACKUP_FILE" ] && [ -n "$IMAGE_TAG" ]; then
            echo -e "\n${YELLOW}WARNING: This will perform a full rollback of both database and images.${NC}"
            echo "Database backup: $(basename "$BACKUP_FILE")"
            echo "Image tag: $IMAGE_TAG"
            read -p "Are you sure you want to continue? (y/N): " CONFIRM
            
            if [[ $CONFIRM == "y" || $CONFIRM == "Y" ]]; then
                # Rollback images first
                rollback_images "$IMAGE_TAG"
                
                # Then rollback database
                rollback_database "$BACKUP_FILE"
                
                # Restart all services
                log "Restarting all services..."
                docker-compose -f "$COMPOSE_FILE" down
                docker-compose -f "$COMPOSE_FILE" up -d
                
                # Wait and perform health checks
                log "Waiting for services to start..."
                sleep 30
                
                # Health checks
                if curl -f -s "http://localhost:3001/api/v1/health/healthz" > /dev/null; then
                    log "API health check passed"
                else
                    warn "API health check failed"
                fi
                
                log "Full rollback completed successfully"
            else
                log "Rollback cancelled"
            fi
        else
            error "Invalid backup or tag selection"
        fi
        ;;
    4)
        log "Listing available backups and images"
        list_backups
        list_images
        ;;
    5)
        log "Exiting rollback utility"
        exit 0
        ;;
    *)
        error "Invalid option selected"
        ;;
esac

echo -e "\n${BLUE}=== ROLLBACK STATUS ===${NC}"
echo "Current running services:"
docker-compose -f "$COMPOSE_FILE" ps

log "Rollback process completed"