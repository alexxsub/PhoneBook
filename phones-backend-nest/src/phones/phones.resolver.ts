// © 2023 Alexx Sub, https://github.com/alexxsub/PhoneBook
import { GraphQLError } from 'graphql';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PhoneService } from './phones.service';
import { Phone } from './entities/phone.entity';
import { inputPhone } from './dto/phone.input';
import { ApiProperty } from '@nestjs/swagger';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Phone)
export class PhoneResolver {
  constructor(private readonly phoneService: PhoneService) {}

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

  @Mutation(() => Phone)
  async createPhone(@Args('input') input: inputPhone) {
    const res = this.phoneService.create(input).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('createdPhone', { createdPhone: res });
    return res;
  }

  @ApiProperty({ isArray: true, type: () => Phone }) // swagger
  @Query(() => [Phone], { name: 'readPhones' })
  readPhones() {
    return this.phoneService.readPhones();
  }

  @Mutation(() => Phone)
  async updatePhone(@Args('input') input: inputPhone) {
    const res = await this.phoneService.update(input).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('updatedPhone', { updatedPhone: res });
    return res;
  }

  @Mutation(() => Phone)
  async deletePhone(@Args('id') id: string) {
    const res = await this.phoneService.remove(id).catch((e) => {
      throw new GraphQLError(e.message);
    });
    pubSub.publish('deletedPhone', { deletedPhone: res });
    return res;
  }
}
