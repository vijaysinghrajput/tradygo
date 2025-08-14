-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SELLER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshTokenHash" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_configs" (
    "id" TEXT NOT NULL DEFAULT 'cfg-singleton',
    "brandName" TEXT NOT NULL,
    "brandLogoUrl" TEXT NOT NULL,
    "uiHelpUrl" TEXT,
    "authAdminRoles" JSONB NOT NULL,
    "authOtpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "uiShowDemoCreds" BOOLEAN NOT NULL DEFAULT false,
    "defaultRedirectAdmin" TEXT NOT NULL DEFAULT '/dashboard',
    "defaultRedirectSeller" TEXT NOT NULL DEFAULT '/orders',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_credentials" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordPlaintext" TEXT,
    "role" "UserRole" NOT NULL,
    "platformConfigId" TEXT NOT NULL DEFAULT 'cfg-singleton',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "demo_credentials_email_key" ON "demo_credentials"("email");

-- CreateIndex
CREATE INDEX "demo_credentials_role_idx" ON "demo_credentials"("role");

-- AddForeignKey
ALTER TABLE "demo_credentials" ADD CONSTRAINT "demo_credentials_platformConfigId_fkey" FOREIGN KEY ("platformConfigId") REFERENCES "platform_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
