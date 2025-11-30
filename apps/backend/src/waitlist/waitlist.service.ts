import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WaitlistDto } from './dto/waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async join(dto: WaitlistDto) {
    const existing = await this.prisma.waitlist.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User already in waitlist');
    }

    const saved = await this.prisma.waitlist.create({
      data: { email: dto.email },
    });

    return { message: 'Added to waitlist successfully', id: saved.id };
  }
}
