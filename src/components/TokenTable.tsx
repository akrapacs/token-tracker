import React from 'react';
import { ResponsiveComponent } from './ResponsiveComponents';
import { Coin } from '../types/coin';
import { formatCurrency, formatFloat, formatPercent } from '@/util/text';
import { DetailModal } from './DetailModal';
import { 
  Center,
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

const highlightBlue = '#82eefd';

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
            <Tr
              backgroundColor="black"
            >
              <Th
                color="white"
              >
                <Center>
                  Symbol
                </Center>
              </Th>
              <Th
                color="white"
              >
                <Center>
                  Current
                </Center>
              </Th>
              <Th
                color="white"
              >
                <Center>
                  ATH Decay
                </Center>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            { 
              coins.map((coin: Coin, index: number) => {
                return (
                  <Tr
                    key={coin.name}
                    backgroundColor={coin.flagged ? highlightBlue : index % 2 !== 0 ? "#cccccc" : undefined}
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
                      <Center>
                        {formatPercent(coin.athDecay)}
                      </Center>
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
          <Tr
            backgroundColor="black"
          >
            <Th
              color="white"
            >
              <Center>
                Symbol
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                USD Price
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                ATH Decay
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                BTC Price
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                ATH
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                % of ATH
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                From ATH
              </Center>
            </Th>
            <Th
              color="white"
            >
              <Center>
                To ATH
              </Center>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { 
            coins.map((coin: Coin, index: number) => {
              return (
                <Tr
                  key={coin.name}
                  backgroundColor={coin.flagged ? highlightBlue : index % 2 !== 0 ? "#cccccc" : undefined}
                >
                  <Td>
                    <Center>
                      <Link
                        href={`https://www.coingecko.com/en/coins/${coin.name}`}
                        isExternal
                      >
                        <Text fontWeight="bold">{coin.symbol}</Text>
                      </Link>
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {formatCurrency(coin.priceInUsd)}
                    </Center>
                  </Td>
                  <Td
                    color={coin.flagged ? 'blue' : undefined}
                    backgroundColor={highlightBlue}
                  >
                    <Center>
                      {formatPercent(coin.athDecay)}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {formatFloat(coin.priceInBtc)}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {formatCurrency(coin.ath)}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {formatPercent(coin.percentOfAth)}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {formatPercent(coin.fromAth)}
                    </Center>
                  </Td>
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