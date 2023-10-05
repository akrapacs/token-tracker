import React from 'react';
import { ResponsiveComponent } from './ResponsiveComponents';
import { Coin } from '../types/coin';
import { formatCurrency, formatFloat, formatPercent } from '@/util/text';
import { DetailModal } from './DetailModal';
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
  useDisclosure,
} from '@chakra-ui/react';

interface TokenTableProps {
  coins: Coin[],
}

const MobileView = (props: TokenTableProps) => {
  const {
    coins,
  } = props;

  const [selectedCoin, setSelectedCoin] = React.useState<Coin | null>(null);

  const detailModalDisclosure = useDisclosure();

  if (!coins) {
    return null;
  }

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Current</Th>
              <Th>ATH Decay</Th>
            </Tr>
          </Thead>
          <Tbody>
            { 
              coins.map((coin: Coin, index: number) => {
                return (
                  <Tr
                    key={coin.name}
                    backgroundColor={coin.flagged ? 'yellow' : index % 2 !== 0 ? "#cccccc" : undefined}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCoin(coin);
                      detailModalDisclosure.onOpen();
                    }}
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
      
      { selectedCoin && (
        <DetailModal
          coin={selectedCoin}
          isOpen={detailModalDisclosure.isOpen} 
          onClose={detailModalDisclosure.onClose}
        />
      )}
    </>
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
      <Table>
        <Thead>
          <Tr>
            <Th>Symbol</Th>
            <Th>USD Price</Th>
            <Th>BTC Price</Th>
            <Th>ATH Decay</Th>
            <Th>ATH</Th>
            <Th>% of ATH</Th>
            <Th>From ATH</Th>
            <Th>To ATH</Th>
          </Tr>
        </Thead>
        <Tbody>
          { 
            coins.map((coin: Coin, index: number) => {
              return (
                <Tr
                  key={coin.name}
                  backgroundColor={coin.flagged ? 'yellow' : index % 2 !== 0 ? "#cccccc" : undefined}
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
                  <Td>{formatFloat(coin.priceInBtc)}</Td>
                  <Td
                    color={coin.flagged ? 'blue' : undefined}
                  >
                    {formatPercent(coin.athDecay)}
                  </Td>
                  <Td>{formatCurrency(coin.ath)}</Td>
                  <Td>{formatPercent(coin.percentOfAth)}</Td>
                  <Td>{formatPercent(coin.fromAth)}</Td>
                  <Td>{formatPercent(coin.toAth)}</Td>
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