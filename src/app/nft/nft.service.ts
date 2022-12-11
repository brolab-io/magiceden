import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axiosService from './axios.service';
import { CreateNFTDTO } from './nft.dto';
import { Nft, NftDocument } from './nft.schema';

@Injectable()
export class NftService {
  constructor(
    @InjectModel(Nft.name) private readonly nftModel: Model<NftDocument>,
  ) {
    this.upsertNfts = this.upsertNfts.bind(this);
    this.upsertNft = this.upsertNft.bind(this);
  }

  createNft(nftDto: CreateNFTDTO) {
    const newNft = new this.nftModel(nftDto);
    return newNft.save();
  }

  upsertNft(nftDto: CreateNFTDTO) {
    return this.nftModel
      .findOneAndUpdate({ nft_address: nftDto.nft_address }, nftDto, {
        upsert: true,
      })
      .exec();
  }

  upsertNfts(nfts: CreateNFTDTO[]) {
    return Promise.all(nfts.map(this.upsertNft));
  }

  private getsolTransfersByTransactionId(transactionId: string) {
    return axiosService
      .get(`https://public-api.solscan.io/transaction/${transactionId}`)
      .then((data: any) => [
        data.innerInstructions[0].parsedInstructions[0].params,
        data.solTransfers[0],
      ])
      .then((data) => data.filter((item: any) => !!item));
  }

  async getLatestMintActivity(mint: string) {
    const activities: any = await axiosService.get(
      `/v2/tokens/${mint}/activities?offset=0&limit=100`,
    );
    const activity = activities.find((activity) => activity.type === 'buyNow');
    if (!activity) {
      return {};
    }
    return activity;
  }

  async getUserTokens(wallet: string) {
    console.log('getUserTokens', wallet);
    return axiosService.get(
      `/v2/wallets/${wallet}/tokens?offset=0&limit=500&listStatus=both`,
    );
  }

  async getCollectionActivityNfts(collection: string, wallet: string) {
    const tokens: any = await this.getUserTokens(wallet);

    console.log('getCollectionActivityNfts found tokens', tokens.length);
    const tokensInCollection = tokens.filter(
      (token: any) => token.collection === collection,
    );

    console.log(
      'getCollectionActivityNfts found tokensInCollection',
      tokensInCollection.length,
    );
    const tokenActivities = await Promise.all(
      tokensInCollection.map((token: any) =>
        this.getLatestMintActivity(token.mintAddress),
      ),
    );

    return Promise.all(
      tokenActivities.map((activity: any) => {
        return this.getsolTransfersByTransactionId(activity.signature).then(
          (solTransfers: any) => ({
            ...activity,
            solTransfers,
          }),
        );
      }),
    );
  }
}
