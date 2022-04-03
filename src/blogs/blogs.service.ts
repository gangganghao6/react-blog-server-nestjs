import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BlogsEntity } from './blogs.entity';

export interface BlogsRo {
  list: BlogsEntity[];
  count?: number;
}

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogsEntity)
    private readonly blogsRepository: Repository<BlogsEntity>,
  ) {
  }

  // 创建文章
  async create(blog: Partial<BlogsEntity>): Promise<BlogsEntity> {
    const { title } = blog;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.blogsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.blogsRepository.save(blog);
  }

  async updateView(id: number): Promise<boolean> {
    const result = await this.blogsRepository.increment({ id }, 'view', 1);
    return result.affected > 0;
  }

  // 获取文章列表
  async findAll(query): Promise<BlogsRo> {
    const { pageNum = 1, pageSize = 10, ...params } = query;
    const result = await this.blogsRepository.find({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      order: {
        time: 'DESC',
      },
      withDeleted: false,
      skip: pageSize * (pageNum - 1),
      take: pageSize,
    });
    const count = await this.blogsRepository.count();
    // const test = await this.blogsRepository.findBy({
    //   title: Like('%更人候%'),
    //   images: {
    //     originSrc: Like('%com%'),
    //   },
    // });
    return { list: result, count };
  }


  //根据(title和content)或tag搜索文章
  async searchBlogByText(query): Promise<BlogsRo> {
    const { pageNum = 1, pageSize = 10 } = query;
    const result = await this.blogsRepository.find({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      order: {
        time: 'DESC',
      },
      withDeleted: false,
      skip: pageSize * (pageNum - 1),
      take: pageSize,
      where: [
        {
          title: Like('%' + query.text + '%'),
        },
        {
          content: Like('%' + query.text + '%'),
        },
      ],
    });
    const count = await this.blogsRepository.count({
      where: [
        {
          title: Like('%' + query.text + '%'),
        },
        {
          content: Like('%' + query.text + '%'),
        },
      ],
    });
    return { list: result, count };
  }

  async searchBlogByTag(query): Promise<BlogsRo> {
    const { pageNum = 1, pageSize = 10 } = query;
    const result = await this.blogsRepository.find({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      order: {
        time: 'DESC',
      },
      withDeleted: false,
      skip: pageSize * (pageNum - 1),
      take: pageSize,
      where: [
        {
          tag: Like('%' + query.tag + '%'),
        },
      ],
    });
    const count = await this.blogsRepository.count({
      where: [
        {
          tag: Like('%' + query.tag + '%'),
        },
      ],
    });
    return { list: result, count };
  }

  // 获取指定文章
  async findById(id): Promise<BlogsEntity> {
    await this.updateView(id);
    const result = await this.blogsRepository.findOne({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      where: {
        id,
      },
    });
    if (result) {
      result.comments.sort((pre, after) => {
        return pre.id - after.id;
      });
      for (const item of result.comments) {
        item.innerComments.sort((pre, after) => {
          return pre.id - after.id;
        });
      }
    }
    return result;
  }


  async getHotAndRecommendBlog(): Promise<{
    recommend: BlogsEntity[];
    hot: BlogsEntity[];
  }> {
    const recommend = await this.blogsRepository.find({
      where: {
        recommend: true,
      },
      order: {
        time: 'DESC',
      },
      take: 5,
    });
    const hot = await this.blogsRepository.find({
      order: {
        view: 'DESC',
      },
      take: 5,
    });
    return { recommend, hot };
  }

  // 更新文章
  async updateById(id, blog): Promise<BlogsEntity> {
    const existBlog = await this.blogsRepository.findOne({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      where: {
        id,
      },
    });
    if (!existBlog) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updateBlog = this.blogsRepository.merge(existBlog, blog);
    return this.blogsRepository.save(updateBlog);
  }

  // 刪除文章
  async removeBlog(id: number): Promise<BlogsEntity> {
    const existBlog = await this.blogsRepository.findOne({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      where: {
        id,
      },
    });
    if (!existBlog) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.blogsRepository.softRemove(existBlog);
  }
}
