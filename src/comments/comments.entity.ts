import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogsEntity } from '../blogs/blogs.entity';
import { AlbumsEntity } from '../albums/albums.entity';
import { InnerCommentsEntity } from './inner-comments/inner-comments.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'text' })
  email: string;

  @ManyToOne(() => BlogsEntity, (blog) => blog.comments, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  blog: BlogsEntity;

  @ManyToOne(() => AlbumsEntity, (album) => album.comments, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  album: AlbumsEntity;

  @OneToMany(() => InnerCommentsEntity, (innerComment) => innerComment.root, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  innerComments: InnerCommentsEntity[];

  @Column({ type: 'bigint', default: +new Date() })
  time: number;
}
