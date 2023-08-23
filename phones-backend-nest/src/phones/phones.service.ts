import { Injectable } from '@nestjs/common';
import { inputPhone } from './dto/phone.input';
import { PrismaService } from '../prisma.service';
import { Phone } from '@prisma/client';

@Injectable()
export class PhoneService {
  constructor(private prisma: PrismaService) {}

  async create(input: inputPhone): Promise<Phone> {
    delete input.id;
    return this.prisma.phone.create({
      data: input,
    });
  }

  async read(): Promise<Phone[]> {
    return this.prisma.phone.findMany();
  }

  async update(input: inputPhone): Promise<Phone> {
    const { id } = input;
    delete input.id;
    return this.prisma.phone.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<Phone> {
    return this.prisma.phone.delete({
      where: { id },
    });
  }
}
