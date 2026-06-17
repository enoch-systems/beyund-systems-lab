import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    // Check for duplicate email
    const existing = await this.prisma.registration.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('This email has already been registered.');
    }

    return this.prisma.registration.create({
      data: {
        fullName: dto.full_name,
        email: dto.email.toLowerCase(),
        phoneWhatsapp: dto.phone_whatsapp,
        sex: dto.sex || null,
        country: dto.country,
        state: dto.state || null,
        courseApplyingFor: dto.course_applying_for,
        employmentStatus: dto.employment_status || null,
        hasLaptop: dto.has_laptop || null,
        learningReason: dto.learning_reason || null,
      },
    });
  }

  async findAll() {
    return this.prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
    });
    if (!registration) {
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }
    return registration;
  }

  async checkEmail(email: string) {
    const existing = await this.prisma.registration.findUnique({
      where: { email: email.toLowerCase() },
    });
    return { exists: !!existing };
  }

  async getStats() {
    const [total, totalToday, byCourse, byCountry, byEmployment] =
      await Promise.all([
        this.prisma.registration.count(),
        this.prisma.registration.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        this.prisma.registration.groupBy({
          by: ['courseApplyingFor'],
          _count: true,
        }),
        this.prisma.registration.groupBy({
          by: ['country'],
          _count: true,
        }),
        this.prisma.registration.groupBy({
          by: ['employmentStatus'],
          _count: true,
        }),
      ]);

    return {
      total,
      totalToday,
      byCourse,
      byCountry,
      byEmployment,
    };
  }
}