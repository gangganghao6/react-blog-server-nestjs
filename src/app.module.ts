import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import envConfig from '../config/env';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AlbumsModule } from './albums/albums.module';
import { BlogsModule } from './blogs/blogs.module';
import { ImagesModule } from './images/images.module';
import { CommentsModule } from './comments/comments.module';
import { InfoModule } from './info/info.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

// import * as dotenv from 'dotenv';
// console.log([process.env.NODE_ENV.trim() == 'dev' ? '.env' : '.env.prod', envConfig.path]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [process.env.NODE_ENV.trim() == 'dev' ? '.env' : '.env.prod'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.env.STATIC_PATH),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite', // 数据库类型
        // entities: [
        //   BlogsEntity,
        //   AlbumsEntity,
        //   CommentsEntity,
        //   InnerCommentsEntity,
        //   ImagesEntity,
        // ], // 数据表实体
        autoLoadEntities: true,
        // host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        // port: configService.get<number>('DB_PORT', 3306), // 端口号
        // username: configService.get('DB_USER', 'root'), // 用户名
        // password: configService.get('DB_PASSWORD', ''), // 密码
        // database: configService.get('DB_DATABASE', 'blogs'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        database: path.join(process.env.DATABASE_PATH, 'blogs.db'),
        enableWAL: true,
        busyErrorRetry: 10,
      }),
    }),
    BlogsModule,
    AlbumsModule,
    ImagesModule,
    CommentsModule,
    InfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
