import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PhoneService } from './phones.service';
import { Phone } from './entities/phone.entity';
import { PhoneInput } from './dto/phone.input';

@Resolver(() => Phone)
export class PhoneResolver {
  constructor(private readonly phoneService: PhoneService) {}

  @Mutation(() => Phone)
  createPhone(@Args('PhoneInput') Input: PhoneInput) {
    return this.phoneService.create(Input);
  }

  @Query(() => [Phone], { name: 'readPhones' })
  readPhones() {
    return this.phoneService.readPhones();
  }

  @Mutation(() => Phone)
  updatePhone(@Args('PhoneInput') Input: PhoneInput) {
    return this.phoneService.update(Input);
  }

  @Mutation(() => Phone)
  deletePhone(@Args('id') id: string) {
    return this.phoneService.remove(id);
  }
}
