import { useEffect, useState } from 'react';
import { Coin } from '../types/coin';
import dayjs from 'dayjs';
import axios from 'axios'; 


const Subscriptions: string[] = [
  'binancecoin',
  'bitcoin',
  'cardano',
  'ethereum',
  'ethereum-name-service',
  'pancakeswap-token',
  'polkadot',
  'solana',
  'x2y2',
  'ripple',
  'usd-coin',
  'tether',
  'monero',
];

const callMarketsApi = async (ids: string): Promise<Record<string, { ath: number, usd: number, btc: number, symbol: string}>> => {
  const url1 = `https://api.coingecko.com/api/v3/coins/markets?ids=${ids}&vs_currency=usd&precision=full`;
  const priceInUsdResponse = await axios.get(url1);

  const tokensInUsd = priceInUsdResponse.data;

  const data: any = {};

  const bitcoin = tokensInUsd.find((tokenInUsd: any) => {
    return tokenInUsd.id === 'bitcoin';
  });
  const bitcoinPriceInUsd = bitcoin.current_price;

  tokensInUsd.forEach((tokenInUsd: any) => {
    data[tokenInUsd.id] = {
      ath: tokenInUsd.ath,
      usd: tokenInUsd.current_price,
      btc: tokenInUsd.current_price / bitcoinPriceInUsd,
      symbol: tokenInUsd.symbol.toUpperCase(),
    }
  });

  return data;
};

export const useApi = (): [Coin[], dayjs.Dayjs | null, () => Promise<void>] => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updatedAt, setUpdatedAt] = useState<dayjs.Dayjs | null>(null);

  const callApi = async () => {
    try {
      const ids = Array.from(Subscriptions).join(',');
      const data = await callMarketsApi(ids);

      let _coins: Coin[] = [];
      Object.keys(data).forEach((key: string) => {
        const priceInUsd = data[key].usd;
        const priceInBtc = data[key].btc;
        const ath = data[key].ath;
        const symbol = data[key].symbol;

        const percentOfAth = priceInUsd / ath;
        const fromAth = 1 - (priceInUsd / ath);
        const toAth = (ath - priceInUsd) / priceInUsd;
        const athDecay = 0;

        _coins.push({
          name: key,
          symbol,
          priceInUsd,
          priceInBtc,
          ath,
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
