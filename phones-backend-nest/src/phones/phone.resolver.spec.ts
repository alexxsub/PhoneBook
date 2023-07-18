import { Test, TestingModule } from '@nestjs/testing';
import { PhoneResolver } from './phones.resolver';
import { PhoneService } from './phones.service';

describe('PhoneResolver', () => {
  let resolver: PhoneResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneResolver, PhoneService],
    }).compile();

    resolver = module.get<PhoneResolver>(PhoneResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});