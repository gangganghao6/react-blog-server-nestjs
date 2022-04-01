import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InfoEntity } from '../info/info.entity';

@Entity('tags')
export class TagsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deleteDate: Date;

  @Column({ type: 'bigint' })
  time: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => InfoEntity, (info) => info.tags, {
    createForeignKeyConstraints: false,
  })
  root: InfoEntity;
}
