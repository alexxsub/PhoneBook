import { Injectable } from '@nestjs/common';
import { inputPhone } from './dto/phone.input';
import { inputRead } from './dto/read.input';
import { PrismaService } from '../prisma.service';
import { Phone, Prisma } from '@prisma/client';
import { UserInputError } from '@nestjs/apollo';

import { createPaginate } from '../pagination';

@Injectable()
export class PhoneService {
  constructor(private prisma: PrismaService) {}

  async create(input: inputPhone): Promise<Phone> {
    delete input.id;
    return this.prisma.phone.create({
      data: input,
    });
  }

  async read(input: inputRead) {
    if (input) {
      const { rowsPerPage, page, filter, sortBy, descending } = input;
      const orderBy = {};

      if (sortBy != '')
        orderBy[sortBy] = Prisma.SortOrder[descending ? 'desc' : 'asc'];

      const paginate = createPaginate({ rowsPerPage });
      const res = await paginate<Phone, Prisma.PhoneFindManyArgs>(
        this.prisma.phone, //model
        {
          //args
          where: {
            OR: [
              {
                name: {
                  contains: filter,
                },
              },
              {
                number: {
                  contains: filter,
                },
              },
            ],
          },
          orderBy,
        },
        { page }, //options
      );

      return res;
    }
    throw new UserInputError('Нет входных данных для расчета страниц');
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
