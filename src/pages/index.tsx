import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios'; 
import { 
  Button,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

const inter = Inter({ subsets: ['latin'] })

const Symbols: Map<string, string> = new Map<string, string>([
  ['binancecoin', 'BNB'],
  ['bitcoin', 'BTC'],
  ['cardano', 'ADA'],
  ['ethereum', 'ETH'],
  ['pancakeswap-token', 'CAKE'],
  ['polkadot', 'DOT'],
  ['solana', 'SOL'],
  ['altura', 'ALU'],
]);

const AllTimeHighs: Map<string, number> = new Map<string, number>([
  ['binancecoin', 686.31],
  ['bitcoin', 69045.0],
  ['cardano', 3.09],
  ['ethereum', 4878.26],
  ['pancakeswap-token', 43.96],
  ['polkadot', 54.98],
  ['solana', 259.96],
  ['altura', 0.462652],
]);

interface Coin {
  name: string;
  symbol: string;
  priceInUsd: number;
  priceInBtc: number;
  ath: number;
  percentOfAth: number;
  fromAth: number;
  toAth: number;
  btcAthDiff: number;
  flagged: boolean;
}

const numberFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatPercent = (n: number): string => {
  return `${numberFormatter.format(n * 100)}%`;
}

const currencyFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
const formatCurrency = (n: number): string => {
  return currencyFormatter.format(n);
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [btcAthDiffThreshold, setBtcAthDiffThreshold] = useState<string>('3');
  const [updateInterval, setUpdateInterval] = useState<string>('10');
  const [updatingInSeconds, setUpdatingInSeconds] = useState<number>(0);
  const [updateDue, setUpdateDue] = useState<Date | null>(null);
  const [updatedAt, setUpdatedAt] = useState<dayjs.Dayjs | null>(null);

  const poll = async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polkadot,cardano,binancecoin,pancakeswap-token,altura&vs_currencies=usd,btc&precision=full';
      const response = await axios.get(url);

      let _coins: Coin[] = [];
      Object.keys(response.data).forEach((key: string) => {
        const priceInUsd = response.data[key].usd;
        const priceInBtc = response.data[key].btc;

        const ath = AllTimeHighs.get(key)!;
        const percentOfAth = priceInUsd / ath;
        const fromAth = 1 - (priceInUsd / ath);
        const toAth = (ath - priceInUsd) / priceInUsd;
        const btcAthDiff = 0;

        _coins.push({
          name: key,
          symbol: Symbols.get(key)!,
          priceInUsd,
          priceInBtc,
          ath,
          percentOfAth,
          fromAth,
          toAth,
          btcAthDiff,
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

  const processedCoins = useMemo(() => {
    const bitcoin = coins.find((coin: Coin) => {
      return coin.symbol = 'BTC';
    });

    const _btcAthDiffThreshold = parseFloat(btcAthDiffThreshold) / 100;

    return coins.map((coin: Coin): Coin => {
      const btcAthDiff = bitcoin!.percentOfAth - coin.percentOfAth;
      const flagged = btcAthDiff > 0 && btcAthDiff < _btcAthDiffThreshold;

      return {
        ...coin,
        btcAthDiff,
        flagged,
      };
    });
  }, [coins, btcAthDiffThreshold]);

  useEffect(() => {
    const _updateInterval = parseInt(updateInterval);

    const interval = setInterval(() => {
      const now = dayjs();

      if (updateDue && dayjs(updateDue).isAfter(now)) {
        const diff = dayjs(updateDue).diff(now, 'seconds');
        setUpdatingInSeconds(diff);
      } else {
        poll();
        setUpdateDue(dayjs().add(_updateInterval, 'minutes').toDate());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [updateDue, setUpdateDue, updateInterval]);

  return (
    <>
      <Head>
        <title>Token Tracker</title>
        <meta name="description" content="Token tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/token-tracker/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Flex
          flexDirection='column'
        >
          <Flex
            flexDirection='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Flex
              flexDirection='row'
              alignItems='center'
            >
              <Flex
                flexDirection='row'
                alignItems='center'
                mr={2}
              >
                <Text fontSize='x-small'>Threshold:</Text>
                <Input 
                  placeholder='' 
                  size='xs' 
                  width='4em'
                  value={`${btcAthDiffThreshold}`}
                  onChange={(event) => { 
                    setBtcAthDiffThreshold(event.target.value); 
                  }}
                />
              </Flex>

              <Flex
                flexDirection='row'
                alignItems='center'
              >
                <Text fontSize='x-small'>Update Interval:</Text>
                <Input 
                  placeholder='' 
                  size='xs' 
                  width='4em'
                  value={`${updateInterval}`}
                  onChange={(event) => { 
                    setUpdateInterval(event.target.value); 
                  }}
                />
              </Flex>
            </Flex>

            { updatingInSeconds > 0 && (
              <Text
                fontSize="xs"
              >
                Refreshing in {updatingInSeconds}s
              </Text>
            )}
          </Flex>

          <TableContainer>
            <Table variant='striped'>
              { updatedAt && (
                <TableCaption>Updated at {updatedAt.format('dddd, MMMM D, YYYY HH:mm')}</TableCaption>
              )}
              <Thead>
                <Tr>
                  <Th>Symbol</Th>
                  <Th>Current</Th>
                  <Th>ATH</Th>
                  <Th>% ATH</Th>
                  <Th>From ATH</Th>
                  <Th>To ATH</Th>
                  <Th>BTC ATH Diff</Th>
                </Tr>
              </Thead>
              <Tbody>
                { 
                  processedCoins.map((coin: Coin) => {
                    return (
                      <Tr
                        key={coin.name}
                        backgroundColor={coin.flagged ? 'yellow' : undefined}
                      >
                        <Td><Text fontWeight="bold">{coin.symbol}</Text></Td>
                        <Td>{formatCurrency(coin.priceInUsd)}</Td>
                        <Td>{formatCurrency(coin.ath)}</Td>
                        <Td>{formatPercent(coin.percentOfAth)}</Td>
                        <Td>{formatPercent(coin.fromAth)}</Td>
                        <Td>{formatPercent(coin.toAth)}</Td>
                        <Td
                          color={coin.flagged ? 'blue' : undefined}
                        >
                          {formatPercent(coin.btcAthDiff)}
                          </Td>
                      </Tr>
                    );
                  })
                }
              </Tbody>
            </Table>
          </TableContainer>

          <Button 
            onClick={() => { 
              setUpdateDue(null);
              setUpdatingInSeconds(0);
              poll(); 
            }}
          >
            Refresh
          </Button>

          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Text
              fontSize="xs"
              mr={1}
            >
              Powered by CoinGecko
            </Text>
           
            <Image
              src="/token-tracker/coin-gecko-logo.svg"
              alt="CoinGecko"
              width={20}
              height={20}
            />
          </Flex>
        </Flex>
      </main>
    </>
  )
}
