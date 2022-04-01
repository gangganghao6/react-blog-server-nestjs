import { HttpException, Injectable } from '@nestjs/common';
import { AlbumsEntity } from './albums.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CommentsEntity } from '../comments/comments.entity';
import { InnerCommentsEntity } from '../comments/inner-comments/inner-comments.entity';

export interface AlbumsRo {
  list: AlbumsEntity[];
  count: number;
}

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumsEntity)
    private readonly albumsRepository: Repository<AlbumsEntity>,
  ) {}

  // 创建相册
  async create(album: Partial<AlbumsEntity>): Promise<AlbumsEntity> {
    const { name } = album;
    if (!name) {
      throw new HttpException('缺少相册标题', 401);
    }
    const doc = await this.albumsRepository.findOne({ where: { name } });
    if (doc) {
      throw new HttpException('相册已存在', 401);
    }
    return await this.albumsRepository.save(album);
  }

  // 获取相册列表
  async findAll(query): Promise<AlbumsRo> {
    // const qb = await getRepository(AlbumsEntity).createQueryBuilder('blog');
    // qb.where('1 = 1');
    // qb.orderBy('blog.time', 'DESC');
    //
    // const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    // qb.limit(pageSize);
    // qb.offset(pageSize * (pageNum - 1));
    //
    // const posts = await qb.getMany();
    const result = await this.albumsRepository.find({
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
    const count = await this.albumsRepository.count();
    // const test = await this.albumsRepository.findBy({
    //   title: Like('%更人候%'),
    //   images: {
    //     originSrc: Like('%com%'),
    //   },
    // });
    return { list: result, count };
  }

  // 获取指定文章
  async findById(id): Promise<AlbumsEntity> {
    const result = await this.albumsRepository.findOne({
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
    result.comments.sort((pre, after) => {
      return pre.id - after.id;
    });
    for (const item of result.comments) {
      item.innerComments.sort((pre, after) => {
        return pre.id - after.id;
      });
    }
    return result;
  }

  async findByLike(text): Promise<AlbumsRo> {
    const [result, count] = await this.albumsRepository.findAndCount({
      relations: {
        images: true,
        comments: {
          innerComments: true,
        },
      },
      where: {
        name: Like(`%${text}%`),
      },
    });
    return { list: result, count };
  }

  // 更新文章
  async updateById(id, album): Promise<AlbumsEntity> {
    const existAlbum = await this.albumsRepository.findOne({
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
    if (!existAlbum) {
      throw new HttpException(`id为${id}的相册不存在`, 401);
    }
    const updateAlbum = this.albumsRepository.merge(existAlbum, album);
    return this.albumsRepository.save(updateAlbum);
  }

  // 刪除文章
  async removeAlbum(id): Promise<AlbumsEntity> {
    const existAlbum = await this.albumsRepository.findOne({
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
    if (!existAlbum) {
      throw new HttpException(`id为${id}的相册不存在`, 401);
    }
    return await this.albumsRepository.softRemove(existAlbum);
  }

  async updateView(id: number): Promise<boolean> {
    const result = await this.albumsRepository.increment(
      { id, deletedDate: null },
      'view',
      1,
    );
    return result.affected > 0;
  }
}
