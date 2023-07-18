import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, IsMongoId } from 'class-validator';

@InputType()
export class PhoneInput {
  @Field({ nullable: false, description: 'ID редактируемой записи' })
  @IsMongoId()
  id: string;

  @Field({ description: 'Номер телефона' })
  @IsNotEmpty()
  @MaxLength(11)
  number: string;

  @Field({ description: 'Имя владельца телефона ' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ description: 'Адресс владельца телефона ' })
  @IsString()
  @MaxLength(50)
  address: string;
}

export default PhoneInput;
