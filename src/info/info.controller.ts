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
import * as dayjs from 'dayjs';

@Controller('info')
export class InfoController {
  protected readonly ONE_DAY_MS = 1000 * 60 * 60 * 24;

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

  @Get('visitInfos')
  async getVisitInfos() {
    const result = await this.infoService.getVisitInfos();

    const realData1 = new Array(365).fill(0);
    result.forEach((item) => {
      //@ts-ignore
      const date = dayjs(parseInt(item.time)).format('YYYY-MM-DD');
      const index = dayjs(date).diff(dayjs('2022-01-01'), 'day');
      realData1[index] = realData1[index] + 1;
    });
    const year = new Date().getFullYear();
    const result1 = realData1.map((item, index) => {
      return {
        visitCount: item,
        date: dayjs(`${year}-01-01`).valueOf() + index * this.ONE_DAY_MS,
        day: new Date(
          dayjs('2022-01-01').valueOf() + index * this.ONE_DAY_MS,
        ).getDay(),
        week: undefined,
      };
    });
    let week = 0;
    result1.forEach((item) => {
      item.week = week;
      if (item.day === 6) {
        week++;
      }
    });

    const realData2 = {
      Desktop: 0,
      Mobile: 0,
    };
    result.forEach((item) => {
      if (item.device === 'Mobile') {
        realData2.Mobile++;
      } else if (item.device === 'Desktop') {
        realData2.Desktop++;
      }
    });
    const result2 = [];
    const keys2 = Object.keys(realData2);
    keys2.forEach((item) => {
      result2.push({ device: item, count: realData2[item] });
    });

    const myArrary3 = {};
    result.forEach((item) => {
      if (!(item.os in myArrary3)) {
        myArrary3[item.os] = 1;
      } else {
        myArrary3[item.os]++;
      }
    });
    const result3 = [];
    const keys3 = Object.keys(myArrary3);
    keys3.forEach((item) => {
      result3.push({ os: item, count: myArrary3[item] });
    });

    const myArrary4 = {};
    result.forEach((item) => {
      if (!(item.browser in myArrary4)) {
        myArrary4[item.browser] = 1;
      } else {
        myArrary4[item.browser]++;
      }
    });
    const result4 = [];
    const keys4 = Object.keys(myArrary4);
    keys4.forEach((item) => {
      result4.push({ browser: item, count: myArrary4[item] });
    });
    return {
      data1: result1,
      data2: result2,
      data3: result3,
      data4: result4,
    };
  }
}
