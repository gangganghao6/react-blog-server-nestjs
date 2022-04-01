import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BlogsEntity } from '../blogs/blogs.entity';
import { AlbumsEntity } from '../albums/albums.entity';

@Entity('images')
export class ImagesEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deletedDate: Date;

  @Column({ type: 'text' })
  originSrc: string;

  @Column({ type: 'text' })
  gzipSrc: string;

  @ManyToOne(() => AlbumsEntity, (album) => album.images, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  album: AlbumsEntity;

  @ManyToOne(() => BlogsEntity, (blog) => blog.images, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  blog: BlogsEntity;

  @Column({ type: 'bigint', default: +new Date() })
  time: number;
}
