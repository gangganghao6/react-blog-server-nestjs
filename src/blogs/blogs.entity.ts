import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImagesEntity } from '../images/images.entity';
import { CommentsEntity } from '../comments/comments.entity';

@Entity('blogs')
export class BlogsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  recommend: boolean;

  @Column({ default: '' })
  tag: string;

  @Column({ default: 0, type: 'int' })
  view: number;

  // @OneToOne(() => ImagesEntity, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn()
  // post: ImagesEntity;
  @Column({ type: 'int' })
  postId: number;

  @OneToMany(() => ImagesEntity, (image) => image.blog, {
    cascade: true,
  })
  images: ImagesEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.blog, {
    cascade: true,
  })
  comments: CommentsEntity[];

  @Column('int')
  type: number;

  @Column({ type: 'bigint' })
  time: number;

  @Column({ type: 'bigint' })
  lastModified: number;
}
