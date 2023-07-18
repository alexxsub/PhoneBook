import { Module } from '@nestjs/common';
import { PhoneService } from './phones.service';
import { PhoneResolver } from './phones.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PhoneResolver, PhoneService, PrismaService],
})
export class PhoneModule {}
