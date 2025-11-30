import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [WaitlistService, PrismaService],
  controllers: [WaitlistController],
})
export class WaitlistModule {}
