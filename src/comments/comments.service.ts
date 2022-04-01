import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from './comments.entity';
import { InnerCommentsEntity } from './inner-comments/inner-comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(InnerCommentsEntity)
    private readonly innerCommentsRespository: Repository<InnerCommentsEntity>,
  ) {}

  async removeComments(ids: number[]): Promise<CommentsEntity[]> {
    const results: CommentsEntity[] = [];
    for (const id of ids) {
      const existComment = await this.commentsRepository.findOne({
        where: { id },
        relations: {
          innerComments: true,
        },
      });
      if (!existComment) {
        throw new HttpException(`id为${id}的评论不存在`, 401);
      }
      results.push(await this.commentsRepository.softRemove(existComment));
    }
    return results;
  }

  async addInnerComments(id, innerComment) {
    const existComment = await this.commentsRepository.findOne({
      where: id,
      relations: {
        innerComments: true,
      },
    });
    return this.commentsRepository.merge(existComment, {
      innerComments: [innerComment],
    });
  }

  async removeInnerComments(ids: number[]): Promise<InnerCommentsEntity[]> {
    const results: InnerCommentsEntity[] = [];
    for (const id of ids) {
      const existInnerComment = await this.innerCommentsRespository.findOne({
        where: { id },
      });
      if (!existInnerComment) {
        throw new HttpException(`id为${id}的inner评论不存在`, 401);
      }
      results.push(
        await this.innerCommentsRespository.softRemove(existInnerComment),
      );
    }
    return results;
  }
}
