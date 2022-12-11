export type MintActivity = {
  metadata: {
    mint: string;
    pubkey: string;
    name: string;
    uri: string;
    symbol: string;
    seller_fee_basis_points: number;
  };
  mint: string;
  price: number;
  market_fee: number;
  time: string;
  royalty_fee: number;
  buyer: string;
  seller: string;
  marketplace: string;
  signature: string;
};
