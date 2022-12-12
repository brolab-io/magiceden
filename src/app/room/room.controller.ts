import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateRoomDto } from './room.dto';
import { RoomService } from './room.service';
import { sign } from 'tweetnacl';
import { decode } from 'bs58';
import { RoomDocument } from './room.schema';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get(':id')
  async root(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const { public_key, signature } = req.cookies;
    const message = 'Sign in to brolab';
    const room = await this.roomService.findRoomByCollectionSymbol(id);
    if (!room) {
      return res.render('error', {
        title: 'Room not found',
      });
    }
    if (public_key && signature) {
      const isSigned = sign.detached.verify(
        new TextEncoder().encode(message),
        decode(signature),
        decode(public_key),
      );
      if (isSigned) {
        const hasAccess = await this.checkRoomAccess(room, public_key);
        if (typeof hasAccess === 'string') {
          return res.render('error', {
            title: 'Access denied',
            message: hasAccess,
          });
        }
        if (!hasAccess) {
          return res.render('error', {
            title: 'Access denied',
            message:
              'Please buy NFTs and send royalties to the collection owner to access this room',
          });
        }
        return res.render('rooms/index', { collection: id });
      }
    }
    return res.render('rooms/connect');
  }

  private async checkRoomAccess(room: RoomDocument, wallet: string) {
    try {
      if (room.policy === 0) {
        return true;
      }
      const tokens = await this.roomService.getUserTokens(room, wallet);
      const logs = [];

      for (const token of tokens) {
        if (token.solTransfers.length < 2) {
          logs.push(`Token ${token.tokenMint} has no royalty fee`);
          continue;
        }
        console.log(token);
        const totalRoyalty = token.solTransfers[1].amount;
        const totalAmount = token.solTransfers[0].amount;
        const percentage = (totalRoyalty / totalAmount) * 10000;
        console.log(
          'percentage',
          percentage,
          `/${token.tokenData.sellerFeeBasisPoints}`,
        );
        const royaltyPercentage =
          (percentage / token.tokenData.sellerFeeBasisPoints) * 100;
        console.log(
          `Token ${token.tokenMint} has royalty fee >= policy fee, required: ${room.policy}, got: ${royaltyPercentage}`,
        );
        if (royaltyPercentage < room.policy) {
          logs.push(
            `Token ${token.tokenMint.slice(0, 6)}...${token.tokenMint.slice(
              -4,
            )} has ${royaltyPercentage}% royalty fee but required ${
              room.policy
            }%`,
          );
          continue;
        }
        return true;
      }
      logs.push(
        'Please buy NFTs and send royalties to the collection owner to access this room',
      );
      return logs.join('\n');
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Get('/data/:id/:wallet')
  async getCollectionActivityNfts(
    @Param('id') id: string,
    @Param('wallet') wallet: string,
  ) {
    return this.roomService.getRoom(id, wallet);
  }
}
