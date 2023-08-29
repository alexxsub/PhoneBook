import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class inputRead {
  @Field({ description: 'Строка поиска' })
  @IsEmpty()
  @IsString()
  filter: string;

  @Field({ description: 'Поле сортировки ' })
  @IsEmpty()
  @IsString()
  sortBy: string;

  @Field({ description: 'Направление сортировки ' })
  @IsNotEmpty()
  descending: boolean;

  @Field(() => Int, { description: 'Записей на страницу' })
  @IsNumber()
  rowsPerPage: number;

  @Field(() => Int, { description: 'Запрашиваемая страница' })
  @IsNumber()
  page: number;
}

export default inputRead;
