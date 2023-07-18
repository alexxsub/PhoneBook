import { Injectable } from '@nestjs/common';
import { PhoneInput } from './dto/phone.input';
import { PrismaService } from '../prisma.service';
import { Phone } from '@prisma/client';
// import { Phone } from './entities/phone.entity';

@Injectable()
export class PhoneService {
  constructor(private prisma: PrismaService) {}

  async readPhones(): Promise<Phone[]> {
    return this.prisma.phone.findMany();
  }

  async create(input: PhoneInput): Promise<Phone> {
    delete input.id;
    return this.prisma.phone.create({
      data: input,
    });
  }

  async update(input: PhoneInput): Promise<Phone> {
    const { id } = input;
    delete input.id;
    return this.prisma.phone.update({
      where: { id },
      data: input,
    });
  }

  async remove(id: string): Promise<Phone> {
    return this.prisma.phone.delete({
      where: { id },
    });
  }
}
