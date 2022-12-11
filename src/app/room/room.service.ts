import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftService } from '../nft/nft.service';
import { CreateRoomDto } from './room.dto';
import { Room, RoomDocument } from './room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    private readonly nftService: NftService,
  ) {
    // this.handleCron();
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const newRoom = await this.roomModel
      .findOneAndUpdate(
        {
          collection_symbol: createRoomDto.collection_symbol,
        },
        createRoomDto,
        {
          upsert: true,
          new: true,
        },
      )
      .select('-_id -__v');
    return newRoom;
  }

  async findRoomByCollectionSymbol(collection_symbol: string) {
    const room = await this.roomModel.findOne({
      collection_symbol,
    });
    return room;
  }

  async getRoom(collection_symbol: string, user: string) {
    const room = await this.roomModel
      .findOne({
        collection_symbol,
      })
      .select('-_id -__v');
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    const tokens = await this.nftService.getCollectionActivityNfts(
      collection_symbol,
      user,
    );
    return {
      ...room.toObject(),
      tokens,
    };
  }

  async getUserTokens(room: RoomDocument, wallet: string) {
    const tokens = await this.nftService.getCollectionActivityNfts(
      room.collection_symbol,
      wallet,
    );
    return tokens;
  }
}

// Connect wallet => collection symbol => nfts => check use has nft in collection => check nft price => check nft royalty fee => check nft policy fee => check nft creator fee => check nft creator fee >= policy fee => allow => deny => pop up modal
// Total amount * sellerFeeBasisPoints = royalty
// royalty * policyFeeBasisPoints = policy fee
// Compare policy fee vs creator_fees_amount
// creator_fees_amount >= policy fee => allow
// creator_fees_amount < policy fee => deny => pop up modal
