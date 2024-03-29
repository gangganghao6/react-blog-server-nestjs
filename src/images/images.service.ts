import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesEntity } from './images.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as webp from 'webp-converter';

@Injectable()
export class ImagesService {
  private readonly blogImagesPath: string;
  private readonly albumImagesPath: string;
  private readonly otherImagesPath: string;

  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
  ) {
    this.blogImagesPath = path.join(process.env.STATIC_PATH, 'blogImages');
    this.albumImagesPath = path.join(process.env.STATIC_PATH, 'albumImages');
    this.otherImagesPath = path.join(process.env.STATIC_PATH, 'otherImages');
    if (!fs.existsSync(this.blogImagesPath)) {
      fs.mkdirSync(this.blogImagesPath);
    }
    if (!fs.existsSync(this.albumImagesPath)) {
      fs.mkdirSync(this.albumImagesPath);
    }
    if (!fs.existsSync(this.otherImagesPath)) {
      fs.mkdirSync(this.otherImagesPath);
    }
  }

  async getImages(id: number): Promise<ImagesEntity> {
    const result = await this.imagesRepository.findOne({
      where: {
        id,
      },
    });
    if (!result) {
      throw new HttpException(`id为${id}的图片不存在`, 404);
    }
    return result;
  }

  async removeImages(ids: number[]): Promise<ImagesEntity[]> {
    const results: ImagesEntity[] = [];
    for (const id of ids) {
      const existImage = await this.imagesRepository.findOne({
        where: { id },
      });
      if (!existImage) {
        throw new HttpException(`id为${id}的图片不存在`, 401);
      }
      results.push(await this.imagesRepository.softRemove(existImage));
    }
    return results;
  }

  async postImages(
    files: Array<Express.Multer.File> | Express.Multer.File,
    type: string,
  ) {
    const filesArray = [];
    if (type === 'blogs') {
      for (const file of files as Array<Express.Multer.File>) {
        if (!fs.existsSync(path.join(this.blogImagesPath, file.originalname))) {
          try {
            fs.appendFileSync(
              path.join(this.blogImagesPath, file.originalname),
              file.buffer,
            );
            await this.compressImage(
              path.join(this.blogImagesPath, `${file.originalname}`),
              path.join(this.blogImagesPath, `gzip_${file.originalname}.webp`),
              95,
              800,
            );
          } catch (e) {
            console.log(e);
          }
        }
        filesArray.push({
          imageName: file.originalname,
          originSrc: `http://${process.env.MY_IP}:${process.env.MY_PORT}/blogImages/${file.originalname}`,
          gzipSrc: `http://${process.env.MY_IP}:${process.env.MY_PORT}/blogImages/gzip_${file.originalname}.webp`,
        });
      }
    } else if (type === 'albums') {
      for (const file of files as Array<Express.Multer.File>) {
        if (
          !fs.existsSync(path.join(this.albumImagesPath, file.originalname))
        ) {
          try {
            fs.appendFileSync(
              path.join(this.albumImagesPath, file.originalname),
              file.buffer,
            );
            await this.compressImage(
              path.join(this.albumImagesPath, `${file.originalname}`),
              path.join(this.albumImagesPath, `gzip_${file.originalname}.webp`),
              80,
              400,
            );
          } catch (e) {
            console.log(e);
          }
        }
        filesArray.push({
          imageName: file.originalname,
          originSrc: `http://${process.env.MY_IP}:${process.env.MY_PORT}/albumImages/${file.originalname}`,
          gzipSrc: `http://${process.env.MY_IP}:${process.env.MY_PORT}/albumImages/gzip_${file.originalname}.webp`,
        });
      }
    } else if (type === 'header') {
      for (const file of files as Array<Express.Multer.File>) {
        if (
          !fs.existsSync(path.join(this.otherImagesPath, file.originalname))
        ) {
          try {
            fs.appendFileSync(
              path.join(this.otherImagesPath, file.originalname),
              file.buffer,
            );
          } catch (e) {
            console.log(e);
          }
        }
        return {
          userHeader: `http://${process.env.MY_IP}:${process.env.MY_PORT}/otherImages/${file.originalname}`,
        };
      }
    }
    return filesArray;
  }

  compressImage(
    originName: string,
    gzipName: string,
    quantity = 80,
    height = 600,
  ) {
    return new Promise<void>((res) => {
      webp
        .cwebp(
          originName,
          gzipName,
          `-q ${quantity} -m 6 -resize 0 ${height} -mt -low_memory`,
        )
        .then(() => {
          res();
        });
    });
  }
}
