import React from 'react';
import { ResponsiveComponent } from './ResponsiveComponents';
import { Coin } from '../types/coin';
import dayjs from 'dayjs';
import { 
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

interface TokenTableProps {
  coins: Coin[],
}

const numberFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatPercent = (n: number): string => {
  return `${numberFormatter.format(n * 100)}%`;
}

const currencyFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'USD' });
const smallCurrencyFormatter = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 4, style: 'currency', currency: 'USD' });
const formatCurrency = (n: number): string => {
  if (n < 10) {
    return smallCurrencyFormatter.format(n);
  }
  return currencyFormatter.format(n);
}

const MobileView = (props: TokenTableProps) => {
  const {
    coins,
  } = props;

  if (!coins) {
    return null;
  }

  return (
    <TableContainer>
      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>Symbol</Th>
            <Th>Current</Th>
            <Th>ATH Decay</Th>
          </Tr>
        </Thead>
        <Tbody>
          { 
            coins.map((coin: Coin) => {
              return (
                <Tr
                  key={coin.name}
                  backgroundColor={coin.flagged ? 'yellow' : undefined}
                >
                  <Td>
                    <Link
                      href={`https://www.coingecko.com/en/coins/${coin.name}`}
                      isExternal
                    >
                      <Text fontWeight="bold">{coin.symbol}</Text>
                    </Link>
                  </Td>
                  <Td>{formatCurrency(coin.priceInUsd)}</Td>
                  <Td
                    color={coin.flagged ? 'blue' : undefined}
                  >
                    {formatPercent(coin.athDecay)}
                  </Td>
                </Tr>
              );
            })
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
};

const StandardView = (props: TokenTableProps) => {
  const {
    coins,
  } = props;

  if (!coins) {
    return null;
  }

  return (
    <TableContainer>
      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>Symbol</Th>
            <Th>Current</Th>
            <Th>ATH</Th>
            <Th>% of ATH</Th>
            <Th>From ATH</Th>
            <Th>To ATH</Th>
            <Th>ATH Decay</Th>
          </Tr>
        </Thead>
        <Tbody>
          { 
            coins.map((coin: Coin) => {
              return (
                <Tr
                  key={coin.name}
                  backgroundColor={coin.flagged ? 'yellow' : undefined}
                >
                  <Td>
                    <Link
                      href={`https://www.coingecko.com/en/coins/${coin.name}`}
                      isExternal
                    >
                      <Text fontWeight="bold">{coin.symbol}</Text>
                    </Link>
                  </Td>
                  <Td>{formatCurrency(coin.priceInUsd)}</Td>
                  <Td>{formatCurrency(coin.ath)}</Td>
                  <Td>{formatPercent(coin.percentOfAth)}</Td>
                  <Td>{formatPercent(coin.fromAth)}</Td>
                  <Td>{formatPercent(coin.toAth)}</Td>
                  <Td
                    color={coin.flagged ? 'blue' : undefined}
                  >
                    {formatPercent(coin.athDecay)}
                  </Td>
                </Tr>
              );
            })
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const TokenTable = (props: TokenTableProps) => {
  return (
    <ResponsiveComponent
      mobileComponent={<MobileView { ...props } />}
      standardComponent={<StandardView { ...props } />}
    />
  );
};