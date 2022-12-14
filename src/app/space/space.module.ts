import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpaceAccessLog,
  SpaceAccessLogSchema,
} from './space-access-log.schema';
import { SpaceController } from './space.controller';
import { Space, SpaceSchema } from './space.schema';
import { SpaceService } from './space.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
    MongooseModule.forFeature([
      { name: SpaceAccessLog.name, schema: SpaceAccessLogSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
