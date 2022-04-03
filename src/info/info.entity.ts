import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagsEntity } from '../tags/tags.entity';
import { TimelinesEntity } from '../timelines/timelines.entity';
import { VisitInfosEntity } from '../visit-infos/visit-infos.entity';

@Entity('info')
export class InfoEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ type: 'bigint' })
  lastModified: number;

  @Column({ type: 'bigint' })
  startTime: number;

  @Column({ type: 'int' })
  totalComments: number;

  @Column({ type: 'int' })
  totalBlogs: number;

  @Column({ type: 'int' })
  totalAlbums: number;

  @Column({ type: 'int' })
  view: number;

  @OneToMany(() => TagsEntity, (tag) => tag.root, {
    cascade: true,
  })
  tags: TagsEntity[];

  @OneToMany(() => TimelinesEntity, (timeline) => timeline.root, {
    cascade: true,
  })
  timelines: TimelinesEntity[];

  @OneToMany(() => VisitInfosEntity, (visitInfo) => visitInfo.root, {
    cascade: true,
  })
  visitInfos: TimelinesEntity[];

  @Column({ type: 'text' })
  userHeader: string;

  @Column({ type: 'text' })
  userName: string;

  @Column({ type: 'text' })
  userDescription: string;

  @Column({ type: 'text' })
  topCardId: number;

  @Column({ type: 'text' })
  topCardColor: string;
}
