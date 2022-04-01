import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { InfoService } from './info.service';
import { ImagesService } from '../images/images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { footers } from '../footers/footers.info.js';

@Controller('info')
export class InfoController {
  constructor(
    private readonly infoService: InfoService,
    private readonly imagesService: ImagesService,
  ) {
  }

  @Get()
  async getInfo(@Headers() header) {
    await this.infoService.storeIp(header);
    return await this.infoService.getInfo();
  }

  @Put()
  async updateInfo() {
    return await this.infoService.updateInfo();
  }

  @Get('tags')
  async getTags() {
    return await this.infoService.getTags();
  }

  @Post('tags')
  async createTags(@Body('tag') tag) {
    return await this.infoService.createTags(tag);
  }

  @Delete('tags/:id')
  async deleteTags(@Param('id') id) {
    return await this.infoService.removeTags(id);
  }

  @Get('timelines')
  async getTimelines() {
    return await this.infoService.getTimelines();
  }

  @Post('timelines')
  async createTimelines(@Body('timeline') timeline) {
    return await this.infoService.createTimelines(timeline);
  }

  @Delete('timelines/:id')
  async deleteTimelines(@Param('id') id) {
    return await this.infoService.removeTimelines(id);
  }

  @Get('userInfo')
  async getUserInfo() {
    return await this.infoService.getUserInfo();
  }

  @Post('userHeader')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadUserHeader(@UploadedFiles() files: Express.Multer.File) {
    return await this.imagesService.postImages(files, 'header');
  }

  @Put('userInfo')
  async setUserInfo(@Body('userInfo') userInfo) {
    return await this.infoService.setUserInfo(userInfo);
  }

  @Get('topCard')
  async getTopCard() {
    return await this.infoService.getTopCard();
  }

  @Put('topCard')
  async setTopCard(@Body('id') id, @Body('color') color) {
    return await this.infoService.setTopCard(id, color);
  }

  @Get('footers')
  async getFooter() {
    return footers;
  }
}
