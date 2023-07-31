import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PhoneService } from './phones.service';
import { Phone } from './entities/phone.entity';
import { inputPhone } from './dto/phone.input';

@Resolver(() => Phone)
export class PhoneResolver {
  constructor(private readonly phoneService: PhoneService) {}

  @Mutation(() => Phone)
  createPhone(@Args('input') input: inputPhone) {
    return this.phoneService.create(input);
  }

  @Query(() => [Phone], { name: 'readPhones' })
  readPhones() {
    return this.phoneService.readPhones();
  }

  @Mutation(() => Phone)
  updatePhone(@Args('input') input: inputPhone) {
    return this.phoneService.update(input);
  }

  @Mutation(() => Phone)
  deletePhone(@Args('id') id: string) {
    return this.phoneService.remove(id);
  }
}
