import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentsEntity } from '../comments.entity';

@Entity('inner-comments')
export class InnerCommentsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ type: 'text' })
  name: string;

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text' })
  email: string;

  @ManyToOne(() => CommentsEntity, (comment) => comment.innerComments, {
    createForeignKeyConstraints: false,
  })
  root: CommentsEntity;

  @Column({ type: 'bigint', default: +new Date() })
  time: number;
}
