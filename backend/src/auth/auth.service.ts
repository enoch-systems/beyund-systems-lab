import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  async register(email: string, password: string, name?: string) {
    const existing = await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      throw new UnauthorizedException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
      },
    });

    const payload = { sub: admin.id, email: admin.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}