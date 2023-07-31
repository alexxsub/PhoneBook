import { Test, TestingModule } from '@nestjs/testing';
import { PhoneService } from './phones.service';
import { PrismaService } from '../prisma.service';
import { inputPhone } from './dto/phone.input';

describe('PhoneService', () => {
  let service: PhoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneService, PrismaService],
    }).compile();

    service = module.get<PhoneService>(PhoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create phone', async () => {
      let input: inputPhone = {
        id: '',
        number: '1',
        name: '1',
        address: '1',
      };

      const createdPhone = await service.create(input);
      const { id } = createdPhone;
      delete createdPhone.id;

      expect(JSON.stringify(createdPhone)).toBe(JSON.stringify(input));

      const deletedPhone = await service.delete(id);
      input = { id, ...input };
      expect(JSON.stringify(deletedPhone)).toBe(JSON.stringify(input));
    });
  });
});
