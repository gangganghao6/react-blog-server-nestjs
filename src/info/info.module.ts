import { Global, Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoEntity } from './info.entity';
import { TagsEntity } from '../tags/tags.entity';
import { TimelinesEntity } from '../timelines/timelines.entity';
import { VisitInfosEntity } from '../visit-infos/visit-infos.entity';

@Global()
@Module({
  providers: [InfoService],
  controllers: [InfoController],
  imports: [
    TypeOrmModule.forFeature([
      InfoEntity,
      TagsEntity,
      TimelinesEntity,
      VisitInfosEntity,
    ]),
  ],
  exports: [InfoService],
})
export class InfoModule {}
