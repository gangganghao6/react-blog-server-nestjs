import { Global, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { InnerCommentsModule } from './inner-comments/inner-comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { InnerCommentsEntity } from './inner-comments/inner-comments.entity';

@Global()
@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    InnerCommentsModule,
    TypeOrmModule.forFeature([CommentsEntity, InnerCommentsEntity]),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
