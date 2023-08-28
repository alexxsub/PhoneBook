import { InputType, Field } from '@nestjs/graphql';
import { IsEmpty, IsString, IsNumber } from 'class-validator';

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
  @IsEmpty()
  descending: string;

  @Field({ description: 'Записей на страницу' })
  @IsNumber()
  rowsPerPage: number;

  @Field({ description: 'Запрашиваемая страница' })
  @IsNumber()
  page: number;
}

export default inputRead;
