import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':id')
  async getImages(@Param('id') id) {
    return await this.imagesService.getImages(id);
  }

  @Delete()
  async removeImages(@Body('ids') ids) {
    return await this.imagesService.removeImages(ids);
  }
}
