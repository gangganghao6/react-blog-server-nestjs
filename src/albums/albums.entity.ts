import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImagesEntity } from '../images/images.entity';
import { CommentsEntity } from '../comments/comments.entity';

@Entity('albums')
export class AlbumsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
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

  @OneToMany(() => ImagesEntity, (image) => image.album, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: ImagesEntity[];

  @OneToMany(() => CommentsEntity, (comment) => comment.album, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: CommentsEntity[];

  @Column({ type: 'bigint' })
  time: number;

  @Column({ type: 'bigint' })
  lastModified: number;
}
