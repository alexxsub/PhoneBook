import { Injectable } from '@nestjs/common';
import { inputPhone } from './dto/phone.input';
import { inputRead } from './dto/read.input';
import { PrismaService } from '../prisma.service';
import { Phone, Prisma } from '@prisma/client';

// import { createPaginator } from 'prisma-pagination';

import { createPaginator } from '../pagination';

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
      if (descending && descending != '')
        orderBy[sortBy] = Prisma.SortOrder[descending];

      const paginate = createPaginator({ rowsPerPage });
      const res = await paginate<Phone, Prisma.PhoneFindManyArgs>(
        this.prisma.phone,
        {
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
        { page },
      );

      return res;
    }
    return await this.prisma.phone.findMany();
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
