import { useEffect, useState } from 'react';
import { Coin } from '../types/coin';
import dayjs from 'dayjs';
import axios from 'axios'; 
import { Asset } from '../types/asset';
import { Subscriptions } from '../const/subscriptions';

const callCGApi = async (): Promise<Asset[] | undefined> => {
  try {
    const ids = Subscriptions.map((subscription: any) => {
      return subscription.cg;
    }).join(',');

    const url1 = `https://api.coingecko.com/api/v3/coins/markets?ids=${ids}&vs_currency=usd&precision=full`;
    const response = await axios.get(url1);
    const tokensInUsd = response.data;

    const bitcoin = tokensInUsd.find((tokenInUsd: any) => {
      return tokenInUsd.id === 'bitcoin';
    });
    const bitcoinPriceInUsd = bitcoin.current_price;

    const assets: Asset[] = [];

    tokensInUsd.forEach((tokenInUsd: any) => {
      assets.push({
        id: tokenInUsd.id,
        ath: tokenInUsd.ath,
        usd: tokenInUsd.current_price,
        btc: tokenInUsd.current_price / bitcoinPriceInUsd,
        symbol: tokenInUsd.symbol.toUpperCase(),
      });
    });

    return assets;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const callCMCApi = async (): Promise<Asset[] | undefined> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cmc`);
    return response.data as Asset[];
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

export enum ApiType {
  CoinGecko = 'CoinGecko',
  CoinMarketCap = 'CoinMarketCap',
};

export const useApi = (type: ApiType = ApiType.CoinGecko): [Coin[], dayjs.Dayjs | null, () => Promise<void>] => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updatedAt, setUpdatedAt] = useState<dayjs.Dayjs | null>(null);

  const callApi = async () => {
    try {
      let assets: Asset[] | undefined;
      if (type === ApiType.CoinGecko) {
        assets = await callCGApi();
      } else if (type === ApiType.CoinMarketCap) {
        assets = await callCMCApi();
      }
      if (!assets) {
        throw new Error('No data');
      }

      let _coins: Coin[] = [];
      assets.forEach((asset: Asset) => {
        const priceInUsd = asset.usd;
        const priceInBtc = asset.btc;
        const ath = asset.ath;
        const symbol = asset.symbol;

        const percentOfAth = priceInUsd / ath;
        const fromAth = 1 - (priceInUsd / ath);
        const toAth = (ath - priceInUsd) / priceInUsd;
        const athDecay = 0;

        _coins.push({
          name: asset.id,
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
