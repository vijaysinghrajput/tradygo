import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../types/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        // avatar: true, // Field doesn't exist in schema
        // isActive: true, // Field doesn't exist in schema
        isVerified: true,
        // lastLoginAt: true, // Field doesn't exist in schema
        createdAt: true,
        updatedAt: true,
        authProviders: {
          select: {
            provider: true,
          }
        }
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { phone },
    });
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        // avatar: true, // Field doesn't exist in schema
        // isActive: true, // Field doesn't exist in schema
        isVerified: true,
        // lastLoginAt: true, // Field doesn't exist in schema
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        authProviders: {
          where: { provider: 'EMAIL' }
        }
      }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailAuth = user.authProviders.find(auth => auth.provider === 'EMAIL');
    if (!emailAuth || !emailAuth.passwordHash) {
      throw new BadRequestException('No password set for this user');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, emailAuth.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await this.prisma.authProvider.update({
      where: {
        userId_provider: {
          userId,
          provider: 'EMAIL'
        }
      },
      data: { passwordHash: hashedNewPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async addAddress(userId: string, addressData: {
    type: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    addressLine?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    pincode?: string;
    country: string;
    isDefault?: boolean;
  }) {
    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        type: addressData.type,
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        phone: addressData.phone,
        street: addressData.street,
        addressLine: addressData.addressLine,
        landmark: addressData.landmark,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        pincode: addressData.pincode,
        country: addressData.country,
        isDefault: addressData.isDefault || false,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, addressData: {
    type?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    addressLine?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isDefault?: boolean;
  }) {
    // Verify address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // If this is set as default, unset other default addresses
    if (addressData.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async deactivateUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: false },
    });

    return { message: 'User deactivated successfully' };
  }
}