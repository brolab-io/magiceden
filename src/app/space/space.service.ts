import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import {
  SpaceAccessLog,
  SpaceAccessLogDocument,
} from './space-access-log.schema';
import { CreateSpaceDto } from './space.dto';
import { Space, SpaceDocument } from './space.schema';

@Injectable()
export class SpaceService {
  private readonly logger = new Logger(SpaceService.name);
  constructor(
    @InjectModel(Space.name) private spaceModel: Model<SpaceDocument>,
    @InjectModel(SpaceAccessLog.name)
    private spaceAccessLogModel: Model<SpaceAccessLogDocument>,
  ) {}

  async renderCreateSpacePage(response: Response) {
    return response.render('spaces/create');
  }

  async createSpace(
    request: Request,
    createSpaceDto: CreateSpaceDto,
  ): Promise<Space> {
    const createdSpace = new this.spaceModel(createSpaceDto);
    createdSpace.createdAgent = {
      ip: request.headers['x-forwarded-for'] || request.ip,
      userAgent: request.headers['user-agent'],
      referer: request.headers['referer'],
      host: request.headers['host'],
      origin: request.headers['origin'],
    };
    try {
      await createdSpace.save();
      return createdSpace;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Space ${createSpaceDto.collection_symbol} already exists`,
        );
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSpace(
    request: Request,
    response: Response,
    collection_symbol: string,
  ) {
    const space = await this.spaceModel.findOne({ collection_symbol });
    if (!space) {
      response.render('error', {
        title: 'Space not found',
        message: `Space ${collection_symbol} not found`,
      });
    }
    await this.spaceAccessLogModel.create({
      collection_symbol,
      ip: request.headers['x-forwarded-for'] || request.ip,
      userAgent: request.headers['user-agent'],
      referer: request.headers['referer'],
      host: request.headers['host'],
      origin: request.headers['origin'],
    });
    return response.render('spaces/index', { collection: collection_symbol });
  }

  async getAccessLogs() {
    return this.spaceAccessLogModel
      .find({})
      .limit(100)
      .sort({ createdAt: -1 })
      .select('-_id -__v -updatedAt');
  }

  async getListSpace() {
    return this.spaceModel.find({}).select('-_id -__v -updatedAt');
  }
}
