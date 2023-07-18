import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Запись телефонной книги' })
export class Phone {
  @Field(() => ID, { description: 'Уникальный идентификатор записи' })
  id: string;

  @Field({ nullable: false, description: 'Номер телефона' })
  number: string;

  @Field({ description: 'Имя владельца телефона ' })
  name: string;

  @Field({ description: 'Адрес владельца телефона ' })
  address: string;
}
