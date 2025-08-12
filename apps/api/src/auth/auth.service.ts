import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DynamicConfigService } from '../config/config.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dynamicConfig: DynamicConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Get dynamic demo credentials
    const demoCredentials = this.dynamicConfig.getDemoCredentials();
    const validUser = demoCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (!validUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if role is allowed
    if (!this.dynamicConfig.isRoleAllowed(validUser.role)) {
      throw new ForbiddenException('Access denied. Insufficient privileges.');
    }

    // Generate user ID based on role
    const userId = validUser.role === 'SUPER_ADMIN' ? 'super-admin-id' : 'admin-id';

    // Generate tokens
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email: validUser.email,
        role: validUser.role,
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TTL', '15m'),
      }
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
        tokenVersion: 1,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TTL', '30d'),
      }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: validUser.email,
        role: validUser.role,
        displayName: validUser.displayName,
      },
    };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Generate new access token
      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.sub === 'super-admin-id' ? 'sa@tradygo.in' : 'admin@tradygo.in',
          role: payload.sub === 'super-admin-id' ? 'SUPER_ADMIN' : 'ADMIN',
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_TTL', '15m'),
        }
      );

      // Generate new refresh token
      const newRefreshToken = this.jwtService.sign(
        {
          sub: payload.sub,
          tokenVersion: (payload.tokenVersion || 1) + 1,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_TTL', '30d'),
        }
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // For demo purposes, just return success
    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string) {
    // Get demo credentials to find user info
    const demoCredentials = this.dynamicConfig.getDemoCredentials();
    
    if (userId === 'super-admin-id') {
      const superAdmin = demoCredentials.find(cred => cred.role === 'SUPER_ADMIN');
      if (superAdmin) {
        return {
          id: 'super-admin-id',
          email: superAdmin.email,
          role: superAdmin.role,
          displayName: superAdmin.displayName,
          firstName: 'Super',
          lastName: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    } else if (userId === 'admin-id') {
      const admin = demoCredentials.find(cred => cred.role === 'ADMIN');
      if (admin) {
        return {
          id: 'admin-id',
          email: admin.email,
          role: admin.role,
          displayName: admin.displayName,
          firstName: 'Admin',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    throw new UnauthorizedException('User not found');
  }

  async validateUser(payload: any) {
    // For demo purposes, return a basic user object
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}