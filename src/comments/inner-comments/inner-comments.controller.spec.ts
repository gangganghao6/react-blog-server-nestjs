import { Test, TestingModule } from '@nestjs/testing';
import { InnerCommentsController } from './inner-comments.controller';

describe('InnerCommentsController', () => {
  let controller: InnerCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InnerCommentsController],
    }).compile();

    controller = module.get<InnerCommentsController>(InnerCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
