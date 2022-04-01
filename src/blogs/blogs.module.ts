import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsEntity } from './blogs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [TypeOrmModule.forFeature([BlogsEntity])],
})
export class BlogsModule {}
