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

const callSimplePriceApi = async (ids: string) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,btc&precision=full`;
  const response = await axios.get(url);
  return response.data;
};

// For some reason the /simple/price endpoint stopped working so this uses the /coins/markets API and basically
// replicates the response from that endpoint so it can be used as a fallback. It's the fallback since it
// requires 2 calls instead of 1. The hope is that the simple endpoint starts working again.
const callMarketsApi = async (ids: string): Promise<Record<string, { usd: number, btc: number}>> => {
  const url1 = `https://api.coingecko.com/api/v3/coins/markets?ids=${ids}&vs_currency=usd&precision=full`;
  const url2 = `https://api.coingecko.com/api/v3/coins/markets?ids=${ids}&vs_currency=btc&precision=full`;
  
  const [priceInUsdResponse, priceInBtcResponse] = await Promise.all([
    axios.get(url1),
    axios.get(url2),
  ]);

  const tokensInUsd = priceInUsdResponse.data;
  const tokensInBtc = priceInBtcResponse.data;

  const data: any = {};

  tokensInUsd.forEach((tokenInUsd: any) => {
    const tokenInBtc = tokensInBtc.find((item: any) => {
      return item.id === tokenInUsd.id;
    });

    data[tokenInUsd.id] = {
      usd: tokenInUsd.current_price,
      btc: tokenInBtc.current_price,
    }
  });

  return data;
};

export const useApi = (): [Coin[], dayjs.Dayjs | null, () => Promise<void>] => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updatedAt, setUpdatedAt] = useState<dayjs.Dayjs | null>(null);

  const callApi = async () => {
    try {
      const ids = Array.from(Subscriptions.keys()).join(',');

      let data: any;
      try {
        data = await callSimplePriceApi(ids);
      } catch (err) {
        console.log(`Error: ${err} (attempting fallback)`);

        data = await callMarketsApi(ids);
      }

      let _coins: Coin[] = [];
      Object.keys(data).forEach((key: string) => {
        const priceInUsd = data[key].usd;
        const priceInBtc = data[key].btc;

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
