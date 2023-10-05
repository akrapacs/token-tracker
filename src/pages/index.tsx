import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { TokenTable } from '@/components/TokenTable';
import { Coin } from '../types/coin';
import { useApi } from '../hooks/useApi';
import { 
  Box,
  Button,
  Link,
  Flex,
  Text,
  Input,
} from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] })

const formatter = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

export default function Home() {
  const [btcAthDiffThreshold, setBtcAthDiffThreshold] = useState<string>('5');
  const [updateInterval, setUpdateInterval] = useState<string>('10');
  const [refreshingIn, setRefreshingIn] = useState<string>('');

  const [coins, updatedAt, callApi] = useApi();

  const processedCoins = useMemo(() => {
    const bitcoin = coins.find((coin: Coin) => {
      return coin.symbol = 'BTC';
    });

    const _btcAthDiffThreshold = parseFloat(btcAthDiffThreshold) / 100;

    return coins.map((coin: Coin): Coin => {
      const athDecay = bitcoin!.percentOfAth - coin.percentOfAth;
      const flagged = athDecay > 0 && athDecay < _btcAthDiffThreshold;

      return {
        ...coin,
        athDecay,
        flagged,
      };
    });
  }, [coins, btcAthDiffThreshold]);

  const updateDue = React.useMemo(() => {
    if (!updatedAt) {
      return null;
    }

    const _updateInterval = parseInt(updateInterval);
    const updateDue = dayjs().add(_updateInterval, 'minutes').toDate();
    return updateDue;
  }, [updatedAt, updateInterval]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!updateDue) {
        return;
      }

      const now = dayjs();

      if (dayjs(updateDue).isAfter(now)) {
        const diff = dayjs(updateDue).diff(now, 'seconds');
        const minutes = Math.floor(diff / 60);
        const seconds = formatter.format(diff % 60);
        setRefreshingIn(`${minutes}:${seconds}`);
      } else {
        callApi();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [callApi, setRefreshingIn, updateDue]);

  return (
    <>
      <Head>
        <title>Token Tracker</title>
        <meta name="description" content="Token tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/token-tracker/favicon.ico" />
      </Head>
      <Box 
        className={`${inter.className}`}
        display="flex"
        flexDirection="column"
        padding="2%"
      >
        <Flex
          flexDirection="column"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex
              flexDirection="row"
              alignItems="center"
            >
              <Flex
                flexDirection="row"
                alignItems="center"
                mr={2}
              >
                <Text 
                  fontSize='x-small'
                  mr={1}
                >
                    Threshold:
                </Text>
                <Input 
                  placeholder=""
                  size="xs" 
                  width="4em"
                  value={`${btcAthDiffThreshold}`}
                  onChange={(event) => { 
                    setBtcAthDiffThreshold(event.target.value); 
                  }}
                />
              </Flex>

              <Flex
                flexDirection="row"
                alignItems="center"
              >
                <Text
                  fontSize="x-small"
                  mr={1}
                >
                  Update Interval:
                </Text>
                <Input 
                  placeholder=""
                  size="xs" 
                  width="4em"
                  value={`${updateInterval}`}
                  onChange={(event) => { 
                    setUpdateInterval(event.target.value); 
                  }}
                />
              </Flex>
            </Flex>

            <Flex
              flexDirection="row"
              alignItems="center"
            >
              <Button
                size="sm"
                ml={3}
                onClick={() => { 
                  setRefreshingIn('');
                  callApi(); 
                }}
              >
                Refresh
              </Button>
            </Flex>
          </Flex>

          <Box
            mb={3}
          >
            <TokenTable coins={processedCoins} />
          </Box>

          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            { updatedAt && (
              <Text
                fontSize="xs"
              >
                Updated at {updatedAt.format('dddd, MMMM D, YYYY HH:mm')}
              </Text>
            )}
          </Flex>
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            { refreshingIn !== '' && (
                <Text
                  fontSize="xs"
                >
                  Refreshing in {refreshingIn}
                </Text>
              )}
          </Flex>
          
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Link
              href="https://www.coingecko.com"
              isExternal
            >
              <Text
                fontSize="xs"
                mr={1}
              >
                Powered by CoinGecko
              </Text>
            </Link>
           
            <Image
              src="/token-tracker/coin-gecko-logo.svg"
              alt="CoinGecko"
              width={20}
              height={20}
            />
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
