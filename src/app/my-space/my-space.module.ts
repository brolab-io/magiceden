import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomString } from 'src/utils/string';
import { MySpaceController } from './my-space.controller';
import { MySpace, MySpaceSchema } from './my-space.schema';
import { MySpaceService } from './my-space.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MySpace.name, schema: MySpaceSchema }]),
    MulterModule.register({
      dest: './public/uploads',
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) => {
          // console.log(file);
          const fileParts = file.originalname.split('.');
          const extension = fileParts[fileParts.length - 1];
          const filename = fileParts.slice(0, fileParts.length - 1).join('.');
          cb(null, `${filename}-${randomString(8)}.${extension}`);
        },
      }),
    }),
  ],
  controllers: [MySpaceController],
  providers: [MySpaceService],
})
export class MySpaceModule {}
