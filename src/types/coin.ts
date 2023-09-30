export interface Coin {
  name: string;
  symbol: string;
  priceInUsd: number;
  priceInBtc: number;
  ath: number;
  percentOfAth: number;
  fromAth: number;
  toAth: number;
  athDecay: number;
  flagged: boolean;
}