import { Global, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesEntity } from './images.entity';

@Global()
@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([ImagesEntity])],
  exports: [ImagesService],
})
export class ImagesModule {}
