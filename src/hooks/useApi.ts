import { useEffect, useState } from 'react';
import { Coin } from '../types/coin';
import dayjs from 'dayjs';
import axios from 'axios'; 

interface Subscription {
  symbol: string;
  ath: number;
}

const Subscriptions: Map<string, Subscription> = new Map<string, Subscription>([
  ['binancecoin', { symbol: 'BNB', ath: 686.31 }],
  ['bitcoin', { symbol: 'BTC', ath: 69045.0 }],
  ['cardano', { symbol: 'ADA', ath: 3.09 }],
  ['ethereum', { symbol: 'ETH', ath: 4878.26 }],
  ['ethereum-name-service', { symbol: 'ENS', ath: 83.40 }],
  ['pancakeswap-token', { symbol: 'CAKE', ath: 43.96 }],
  ['polkadot', { symbol: 'DOT', ath: 54.98 }],
  ['solana', { symbol: 'SOL', ath: 259.96 }],
  ['x2y2', { symbol: 'X2Y2', ath: 4.14 }],
]);

export const useApi = (): [Coin[], dayjs.Dayjs | null, () => Promise<void>] => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updatedAt, setUpdatedAt] = useState<dayjs.Dayjs | null>(null);

  const callApi = async () => {
    try {
      const ids = Array.from(Subscriptions.keys()).join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,btc&precision=full`;
      const response = await axios.get(url);

      let _coins: Coin[] = [];
      Object.keys(response.data).forEach((key: string) => {
        const priceInUsd = response.data[key].usd;
        const priceInBtc = response.data[key].btc;

        const token = Subscriptions.get(key)!;
        const percentOfAth = priceInUsd / token.ath;
        const fromAth = 1 - (priceInUsd / token.ath);
        const toAth = (token.ath - priceInUsd) / priceInUsd;
        const athDecay = 0;

        _coins.push({
          name: key,
          symbol: token.symbol,
          priceInUsd,
          priceInBtc,
          ath: token.ath,
          percentOfAth,
          fromAth,
          toAth,
          athDecay,
          flagged: false,
        });
      });
      _coins.sort((a: Coin, b: Coin) => {
        return b.priceInUsd - a.priceInUsd;
      });
      setCoins(_coins);
      setUpdatedAt(dayjs());
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  return [coins, updatedAt, callApi];
};
