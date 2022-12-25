import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app/app.controller';
import { MySpaceModule } from './app/my-space/my-space.module';
import { NftModule } from './app/nft/nft.module';
import { RoomModule } from './app/room/room.module';
import { SpaceModule } from './app/space/space.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ScheduleModule.forRoot(),
    RoomModule,
    NftModule,
    SpaceModule,
    MySpaceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
