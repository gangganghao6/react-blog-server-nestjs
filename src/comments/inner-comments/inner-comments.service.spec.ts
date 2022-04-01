import { Test, TestingModule } from '@nestjs/testing';
import { InnerCommentsService } from './inner-comments.service';

describe('InnerCommentsService', () => {
  let service: InnerCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InnerCommentsService],
    }).compile();

    service = module.get<InnerCommentsService>(InnerCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
