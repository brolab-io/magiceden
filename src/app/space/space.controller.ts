import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateSpaceDto } from './space.dto';
import { SpaceService } from './space.service';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  // Header txt
  @Get('/access-logs')
  async getAccessLogs() {
    return this.spaceService.getAccessLogs();
  }

  @Get('/list')
  async listSpaces() {
    return this.spaceService.getListSpace();
  }

  @Get('/:collection_symbol')
  async getSpace(
    @Req() request: Request,
    @Res() response: Response,
    @Param('collection_symbol') collection_symbol: string,
  ) {
    return this.spaceService.getSpace(request, response, collection_symbol);
  }

  @Get()
  async getCreateSpacePage(@Res() response: Response) {
    return this.spaceService.renderCreateSpacePage(response);
  }

  @Post()
  async createSpace(
    @Req() request: Request,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return this.spaceService.createSpace(request, createSpaceDto);
  }
}
