import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'; 
import { Asset } from '../../types/asset';
import { Subscriptions } from '../../const/subscriptions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const data = await callCMCApi();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: `${err}` });
  }
}

const callCMCApi = async (): Promise<Asset[]> => {
  const ids = Subscriptions.map((subscription: any) => {
    return subscription.cmc;
  }).join(',');

  const props = {
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${ids}`,
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
  };
  const response = await axios(props);
  const tokenMap = response.data.data;


  const bitcoin = tokenMap['1'];
  const bitcoinPriceInUsd = bitcoin.quote.USD.price;

  const assets: Asset[] = [];

  Subscriptions.forEach((subscription: any) => {
    const found = tokenMap[`${subscription.cmc}`];
    if (found) {
      assets.push({
        id: `${subscription.cmc}`,
        ath: subscription.ath, // API doesn't return ATH so fall back to hard-coded
        usd: found.quote.USD.price,
        btc: found.quote.USD.price / bitcoinPriceInUsd,
        symbol: subscription.symbol,
      });
    }
  });

  return assets;
};