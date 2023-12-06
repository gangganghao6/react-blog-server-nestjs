import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { InfoEntity } from './info.entity';
import { BlogsEntity } from '../blogs/blogs.entity';
import { AlbumsEntity } from '../albums/albums.entity';
import { CommentsEntity } from '../comments/comments.entity';
import { InnerCommentsEntity } from '../comments/inner-comments/inner-comments.entity';
import { TagsEntity } from '../tags/tags.entity';
import { TimelinesEntity } from '../timelines/timelines.entity';
import { VisitInfosEntity } from '../visit-infos/visit-infos.entity';
import * as UAParser from 'ua-parser-js';

interface userInfo {
  userHeader: string;
  userName: string;
  userDescription: string;
}

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(InfoEntity)
    private readonly infoRepository: Repository<InfoEntity>,
  ) {
    infoRepository
      .findOne({
        where: {
          id: 1,
        },
      })
      .then((res) => {
        if (res === null) {
          this.infoRepository.save({
            lastModified: +new Date(),
            view: 0,
            totalAlbums: 0,
            totalBlogs: 0,
            totalComments: 0,
            startTime: +new Date(),
            userHeader: '',
            userName: '',
            userDescription: '',
            topCardId: 0,
            topCardColor: 'white',
          });
        }
      });
  }

  async getInfo(): Promise<InfoEntity> {
    await this.infoRepository.increment({ id: 1 }, 'view', 1);
    return await this.infoRepository.findOne({ where: { id: 1 } });
  }

  async storeIp(header): Promise<InfoEntity> {
    const host =
      header['x-real-ip'] || header['x-forwarded-for'] || header.host;
    const test = new UAParser(header['user-agent']);
    const device = header['user-agent'].includes('Mobile')
      ? 'Mobile'
      : 'Desktop';
    const item = await this.infoRepository.findOne({
      where: {
        id: 1,
      },
      relations: {
        tags: true,
        timelines: true,
        visitInfos: true,
      },
    });
    const result = await this.infoRepository.merge(item, {
      visitInfos: [
        this.infoRepository.manager.getRepository(VisitInfosEntity).create({
          time: +new Date(),
          ip: host,
          os: test.getOS().name ? test.getOS().name : 'Other',
          browser: test.getBrowser().name ? test.getBrowser().name : 'Other',
          device,
        }),
      ],
    });
    await this.infoRepository.save(result);
    return result;
  }

  async updateInfo(): Promise<InfoEntity> {
    await this.infoRepository.update(
      { id: 1 },
      {
        lastModified: +new Date(),
        totalBlogs: await this.getBlogsCount(),
        totalAlbums: await this.getAlbumsCount(),
        totalComments: await this.getCommentsCount(),
      },
    );
    return await this.getInfo();
  }

  async getTags(): Promise<TagsEntity[]> {
    return await this.infoRepository.manager.getRepository(TagsEntity).find();
  }

  async createTags(tag: TagsEntity): Promise<TagsEntity[]> {
    const entity = await this.infoRepository.findOne({
      where: { id: 1 },
      relations: {
        tags: true,
        timelines: true,
      },
    });
    const temp = this.infoRepository.merge(entity, {
      tags: [tag],
    });
    await this.infoRepository.save(temp);
    return await this.getTags();
  }

  async removeTags(id: number): Promise<TagsEntity[]> {
    await this.infoRepository.manager.getRepository(TagsEntity).softRemove(
      await this.infoRepository.manager.getRepository(TagsEntity).findOne({
        where: {
          id,
        },
      }),
    );
    return await this.infoRepository.manager.getRepository(TagsEntity).find();
  }

  async getTimelines(): Promise<TimelinesEntity[]> {
    return await this.infoRepository.manager
      .getRepository(TimelinesEntity)
      .find({
        order: {
          time: 'DESC',
        },
      });
  }

  async createTimelines(timeline: TimelinesEntity): Promise<TimelinesEntity[]> {
    const entity = await this.infoRepository.findOne({
      where: { id: 1 },
      relations: {
        tags: true,
        timelines: true,
      },
    });
    const temp = await this.infoRepository.merge(entity, {
      timelines: [timeline],
    });
    await this.infoRepository.save(temp);
    return await this.getTimelines();
  }

  async removeTimelines(id: number): Promise<TimelinesEntity[]> {
    await this.infoRepository.manager.getRepository(TimelinesEntity).softRemove(
      await this.infoRepository.manager.getRepository(TimelinesEntity).findOne({
        where: {
          id,
        },
      }),
    );
    return await this.infoRepository.manager
      .getRepository(TimelinesEntity)
      .find();
  }

  async getBlogsCount(): Promise<number> {
    return await this.infoRepository.manager.getRepository(BlogsEntity).count();
  }

  async getAlbumsCount(): Promise<number> {
    return await this.infoRepository.manager
      .getRepository(AlbumsEntity)
      .count();
  }

  async getCommentsCount(): Promise<number> {
    let totalCount = 0;
    totalCount += await this.infoRepository.manager
      .getRepository(CommentsEntity)
      .count();
    totalCount += await this.infoRepository.manager
      .getRepository(InnerCommentsEntity)
      .count();
    return totalCount;
  }

  async getUserInfo(): Promise<InfoEntity> {
    return await this.infoRepository.findOne({
      where: { id: 1 },
      select: {
        userName: true,
        userDescription: true,
        userHeader: true,
        topCardId: true,
        topCardColor: true,
      },
    });
  }

  async setUserInfo(userInfo: userInfo) {
    return await this.infoRepository.update(1, userInfo);
  }

  async getTopCard() {
    return await this.infoRepository.findOne({
      where: { id: 1 },
      select: {
        topCardId: true,
        topCardColor: true,
      },
    });
  }

  async setTopCard(id: number, color: string) {
    return await this.infoRepository.update(1, {
      topCardId: id,
      topCardColor: color,
    });
  }

  async getVisitInfos(): Promise<VisitInfosEntity[]> {
    return await this.infoRepository.manager
      .getRepository(VisitInfosEntity)
      .find();
  }
}
