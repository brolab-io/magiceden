import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { CreateMySpaceDto } from './my-space.dto';
import { MySpaceService } from './my-space.service';

@Controller('my-spaces')
export class MySpaceController {
  constructor(private readonly mySpaceService: MySpaceService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const baseURL = `https://${req.get('host')}`;
    return {
      url: `${baseURL}/uploads/${file.filename}`,
    };
  }

  @Get('scene/:slug')
  async getMySpace(@Param('slug') slug: string) {
    return this.mySpaceService.getMySpace(slug);
  }

  @Get(':slug')
  async renderMySpace(@Param('slug') slug: string, @Res() response: Response) {
    return response.render('my-spaces/index');
  }

  @Put(':slug')
  async upsertMySpace(
    @Param('slug') slug: string,
    @Body() entities: CreateMySpaceDto,
  ) {
    return this.mySpaceService.upsertMySpace(slug, entities);
  }
}
