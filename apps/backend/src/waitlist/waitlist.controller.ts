import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistDto } from './dto/waitlist.dto';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('join')
  join(@Body() dto: WaitlistDto) {
    return this.waitlistService.join(dto);
  }
}
