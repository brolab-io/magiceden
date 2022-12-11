import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NftModule } from '../nft/nft.module';
import { RoomController } from './room.controller';
import { Room, RoomSchema } from './room.schema';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    NftModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
