import { Module } from '@nestjs/common';
import { InnerCommentsService } from './inner-comments.service';
import { InnerCommentsController } from './inner-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InnerCommentsEntity } from './inner-comments.entity';

@Module({
  providers: [InnerCommentsService],
  controllers: [InnerCommentsController],
  imports: [TypeOrmModule.forFeature([InnerCommentsEntity])],
})
export class InnerCommentsModule {}
