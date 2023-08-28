import { Phone } from './phone.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Записи телефонной книги, разбитые на страницы' })
class PageInfo {
  @Field(() => Int, { description: 'Всего записей в таблице' })
  rowsTotal: number;
  @Field(() => Int, { description: 'Записей на страницу' })
  rowsPerPage: number;
  @Field(() => Int, { description: 'Последняя страница' })
  lastPage: number;
  @Field(() => Int, { description: 'Текущая страница' })
  currentPage: number;
}

@ObjectType({ description: 'Записи телефонной книги, разбитые на страницы' })
export class PaginatedPhones {
  @Field(() => [Phone], { nullable: true, description: 'Данные о записях' })
  rows: Phone[];
  @Field(() => PageInfo, { description: 'Данные о страницах' })
  pageinfo: PageInfo;
}