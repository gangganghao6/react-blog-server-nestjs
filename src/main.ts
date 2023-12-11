import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as dotenv from 'dotenv';

// const isDev = process.env.NODE_ENV.trim() == 'dev' ? true : false;
// process.env = dotenv.config({ path: isDev ? '.env' : '.env.prod' }).parsed;
// dotenv.config({ path: isDev ? '.env' : '.env.prod', override: true })
// console.log(1, process.env.MY_IP);


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  }); // 允许跨域    
  await app.listen(process.env.MY_PORT);
}

bootstrap();
