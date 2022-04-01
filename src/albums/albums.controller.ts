import { AlbumsService } from './albums.service';
import { AlbumsRo } from './albums.service';
import { AlbumsEntity } from './albums.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from '../images/images.service';
import { CommentsService } from '../comments/comments.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly imagesService: ImagesService,
    private readonly commentsService: CommentsService,
  ) {}

  /**
   * 创建相册
   * @param blog
   */
  @Post()
  async create(@Body() blog: AlbumsEntity) {
    return await this.albumsService.create(blog);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imagesService.postImages(files, 'albums');
  }

  /**
   * 获取所有相册
   * @param query
   */
  @Get()
  async findAll(
    @Query() query: { pageNum: number; pageSize: number },
  ): Promise<AlbumsRo> {
    return await this.albumsService.findAll(query);
  }

  /**
   * 模糊查找
   * @param text
   */
  @Get('search')
  async findByLike(@Query('text') text: string) {
    return await this.albumsService.findByLike(text);
  }

  /**
   * 获取指定相册
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.albumsService.findById(id);
  }

  /**
   * 更新相册
   * @param id
   * @param blog
   */
  @Put(':id')
  async update(@Param('id') id, @Body() blog) {
    return await this.albumsService.updateById(id, blog);
  }

  /**
   * 更新浏览量
   * @param id
   */
  @Put('view/:id')
  async updateView(@Param('id') id) {
    return await this.albumsService.updateView(id);
  }

  /**
   * 删除照片
   * @param ids
   */
  @Delete('images')
  async removeImages(@Body('ids') ids) {
    return await this.imagesService.removeImages(ids);
  }

  /**
   * 删除评论
   * @param ids
   */
  @Delete('comments')
  async removeComments(@Body('ids') ids: number[]) {
    // const toDelete = [];
    // result.forEach((comment) => {
    //   comment.innerComments.forEach((innerComments) => {
    //     toDelete.push(innerComments.id);
    //   });
    // });
    // await this.blogsService.removeInnerComments(toDelete);
    return await this.commentsService.removeComments(ids);
  }

  /**
   * 删除inner评论
   * @param ids
   */
  @Delete('innercomments')
  async removeInnerComments(@Body('ids') ids: number[]) {
    return await this.commentsService.removeInnerComments(ids);
  }

  /**
   * 删除
   * @param id
   */
  @Delete(':id')
  async removeBlog(@Param('id') id) {
    return await this.albumsService.removeAlbum(id);
  }
}
