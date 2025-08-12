#!/bin/bash
# ==== ONE-TIME: passwordless SSH + persistent connection for VPS ====
set -euo pipefail

# --- fill-ins (already set here) ---
SERVER_IP="195.35.21.175"
SERVER_USER="root"
SERVER_PASS="Brijesh@411..,,"

ALIAS_NAME="tradygo"
KEY_PATH="$HOME/.ssh/${ALIAS_NAME}_ed25519"
DISABLE_PASSWORD_AUTH="0"   # set to "1" if you want to disable password logins on the server after key works

# --- tools (install sshpass if missing) ---
if ! command -v sshpass >/dev/null 2>&1; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install hudochenkov/sshpass/sshpass || brew install sshpass
  else
    sudo apt-get update -y && sudo apt-get install -y sshpass
  fi
fi

# --- create key if absent ---
mkdir -p "$(dirname "$KEY_PATH")"
if [[ ! -f "$KEY_PATH" ]]; then
  ssh-keygen -t ed25519 -N "" -f "$KEY_PATH" -C "${ALIAS_NAME}-deploy" >/dev/null
  echo "Generated new SSH key at ${KEY_PATH}"
else
  echo "Using existing SSH key at ${KEY_PATH}"
fi
PUBKEY="$(cat "${KEY_PATH}.pub")"

# --- push pubkey to server using password (one-time) ---
echo "Installing SSH key on server..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} bash -lc "
  set -e
  umask 077
  mkdir -p ~/.ssh
  touch ~/.ssh/authorized_keys
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  grep -qxF '${PUBKEY}' ~/.ssh/authorized_keys || echo '${PUBKEY}' >> ~/.ssh/authorized_keys
  echo 'key-installed'
"

# --- local SSH config alias + multiplexing (persistent connection) ---
mkdir -p "$HOME/.ssh"
SSHCFG="$HOME/.ssh/config"
if ! grep -q "Host ${ALIAS_NAME}\b" "$SSHCFG" 2>/dev/null; then
  {
    echo "Host ${ALIAS_NAME}"
    echo "  HostName ${SERVER_IP}"
    echo "  User ${SERVER_USER}"
    echo "  IdentityFile ${KEY_PATH}"
    echo "  ServerAliveInterval 60"
    echo "  ServerAliveCountMax 5"
    echo "  TCPKeepAlive yes"
    echo "  ControlMaster auto"
    echo "  ControlPath ~/.ssh/cm-%r@%h:%p"
    echo "  ControlPersist 8h"
  } >> "$SSHCFG"
  chmod 600 "$SSHCFG"
  echo "Added SSH config for ${ALIAS_NAME}"
else
  echo "SSH config for ${ALIAS_NAME} already exists"
fi

# --- warm up a master connection (fast subsequent ssh/scp) ---
echo "Establishing persistent SSH connection..."
ssh -MNf ${ALIAS_NAME} || true

# --- test passwordless login ---
ssh ${ALIAS_NAME} 'echo "SSH connection successful!"'

echo "✅ SSH setup complete! You can now use:"
echo "  ssh ${ALIAS_NAME}"
echo "  scp file ${ALIAS_NAME}:/path/"
echo "  rsync -e ssh src/ ${ALIAS_NAME}:/dest/"
