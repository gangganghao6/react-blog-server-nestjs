import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InfoEntity } from '../info/info.entity';

@Entity('visit-infos')
export class VisitInfosEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @DeleteDateColumn()
  deleteDate: Date;

  @Column({ type: 'bigint' })
  time: number;

  @Column({ type: 'text' })
  ip: string;

  @Column({ type: 'text' })
  device: string;
  @Column({ type: 'text' })
  os: string;
  @Column({ type: 'text' })
  browser: string;

  @ManyToOne(() => InfoEntity, (info) => info.visitInfos, {
    createForeignKeyConstraints: false,
  })
  root: InfoEntity;
}
