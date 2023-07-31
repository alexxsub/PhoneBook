// © 2023 Alexx Sub, https://github.com/alexxsub/PhoneBook
import { GraphQLError } from 'graphql';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PhoneService } from './phones.service';
import { Phone } from './entities/phone.entity';
import { inputPhone } from './dto/phone.input';
import { PubSub } from 'graphql-subscriptions';

// создаем новый класс для публикации подписок
const pubSub = new PubSub();

@Resolver(() => Phone)
export class PhoneResolver {
  constructor(private readonly phoneService: PhoneService) {}
// описываем подписки через декораторы
  @Subscription(() => Phone)
  createdPhone() {
    return pubSub.asyncIterator('createdPhone');
  }
  @Subscription(() => Phone)
  updatedPhone() {
    return pubSub.asyncIterator('updatedPhone');
  }
  @Subscription(() => Phone)
  deletedPhone() {
    return pubSub.asyncIterator('deletedPhone');
  }
  // Creat RUD
  @Mutation(() => Phone)
  async createPhone(@Args('input') input: inputPhone) {
    const res = this.phoneService.create(input).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('createdPhone', { createdPhone: res });
    return res;
  }
  // C Read UD
  @Query(() => [Phone], { name: 'readPhones' })
  readPhones() {
    return this.phoneService.readPhones();
  }
  // CR Update D
  @Mutation(() => Phone)
  async updatePhone(@Args('input') input: inputPhone) {
    const res = await this.phoneService.update(input).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('updatedPhone', { updatedPhone: res });
    return res;
  }
  // CRU Delete
  @Mutation(() => Phone)
  async deletePhone(@Args('id') id: string) {
    const res = await this.phoneService.delete(id).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('deletedPhone', { deletedPhone: res });
    return res;
  }
}
