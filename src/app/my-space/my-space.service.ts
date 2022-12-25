import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MySpace, MySpaceDocument } from './my-space.schema';

@Injectable()
export class MySpaceService {
  constructor(
    @InjectModel(MySpace.name) private mySpaceModel: Model<MySpaceDocument>,
  ) {}

  async getMySpace(slug: string): Promise<MySpace> {
    const mySpace = await this.mySpaceModel
      .findOne({ slug })
      .select('-_id -__v')
      .lean()
      .exec();

    if (!mySpace) {
      return {
        slug,
        entities: [],
      };
    }
    return mySpace;
  }

  upsertMySpace(slug: string, body: any): Promise<MySpace> {
    return this.mySpaceModel
      .findOneAndUpdate({ slug }, body, { upsert: true, new: true })
      .select('-_id -__v')
      .lean()
      .exec();
  }
}
