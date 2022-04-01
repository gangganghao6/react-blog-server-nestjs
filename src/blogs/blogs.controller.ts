import { BlogsRo, BlogsService } from './blogs.service';
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
import { BlogsEntity } from './blogs.entity';
import { ImagesService } from '../images/images.service';
import { CommentsService } from '../comments/comments.service';
import { InfoService } from '../info/info.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly imagesService: ImagesService,
    private readonly commentsService: CommentsService,
    private readonly infoService: InfoService,
  ) {}

  /**
   * 创建文章
   * @param blog
   */
  @Post()
  async create(@Body() blog: BlogsEntity) {
    // await this.infoService.updateLastModified();
    return await this.blogsService.create(blog);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.imagesService.postImages(files, 'blogs');
  }

  /**
   * 获取所有文章
   * @param query
   */
  @Get()
  async findAll(
    @Query() query: { pageNum: number; pageSize: number },
  ): Promise<BlogsRo> {
    return await this.blogsService.findAll(query);
  }

  /**
   * 更新浏览量
   * @param id
   */
  @Put('view/:id')
  async updateView(@Param('id') id) {
    return await this.blogsService.updateView(id);
  }

  /**
   * 模糊查找
   * @param text
   */
  @Get('search')
  async findByLike(@Query('text') text: string) {
    return await this.blogsService.findByLike(text);
  }

  @Get('hotandrecommend')
  async getHotAndRecommendBlog() {
    return await this.blogsService.getHotAndRecommendBlog();
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.blogsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param blog
   */
  @Put(':id')
  async update(@Param('id') id, @Body() blog) {
    return await this.blogsService.updateById(id, blog);
  }

  /**
   * 删除图片
   * @param id
   */
  @Delete('images/:id')
  async removeImages(@Param('id') id: number[]) {
    const { images } = await this.blogsService.findById(id);
    const imagesArray = [];
    images.forEach((item) => {
      imagesArray.push(item.id);
    });
    return await this.imagesService.removeImages(imagesArray);
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
   * 删除文章
   * @param id
   */
  @Delete(':id')
  async removeBlog(@Param('id') id) {
    // const toDeleteImages = [];
    // const toDeleteComments = [];
    // const toDeleteInnerComments = [];
    //
    // result.images.forEach((item) => {
    //   toDeleteImages.push(item.id);
    // });
    // result.comments.forEach((comment) => {
    //   toDeleteComments.push(comment.id);
    //   comment.innerComments.forEach((innerComment) => {
    //     toDeleteInnerComments.push(innerComment.id);
    //   });
    // });

    // await this.blogsService.removeImages(toDeleteImages);
    // await this.blogsService.removeComments(toDeleteComments);
    // await this.blogsService.removeInnerComments(toDeleteInnerComments);
    return await this.blogsService.removeBlog(id);
  }
}
