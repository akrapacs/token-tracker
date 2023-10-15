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
  useColorMode,
} from '@chakra-ui/react';

interface TokenTableProps {
  coins: Coin[],
}

interface InternalProps extends TokenTableProps {
  highlightColor: string;
  stripeColor: string;
  specialTextColor: string;
}

const MobileView = (props: InternalProps) => {
  const {
    coins,
    stripeColor,
    highlightColor,
    specialTextColor,
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
                    backgroundColor={coin.flagged ? highlightColor : index % 2 !== 0 ? stripeColor : undefined}
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
                      color={coin.flagged ? specialTextColor : undefined}
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

const StandardView = (props: InternalProps) => {
  const {
    coins,
    stripeColor,
    highlightColor,
    specialTextColor,
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
                  backgroundColor={coin.flagged ? highlightColor : index % 2 !== 0 ? stripeColor : undefined}
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
                    color={coin.flagged ? specialTextColor : undefined}
                    backgroundColor={highlightColor}
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
  const { colorMode } = useColorMode();

  const highlightColor = React.useMemo(() => {
    if (colorMode === 'dark') {
      return '#065666';
    } else {
      return '#82eefd';
    }
  }, [colorMode]);

  const stripeColor = React.useMemo(() => {
    if (colorMode === 'dark') {
      return '#2c2c2c';
    } else {
      return '#cccccc';
    }
  }, [colorMode]);

  const specialTextColor = React.useMemo(() => {
    if (colorMode === 'dark') {
      return 'gold';
    } else {
      return 'blue';
    }
  }, [colorMode]);

  return (
    <ResponsiveComponent
      mobileComponent={
      <MobileView 
        highlightColor={highlightColor}
        stripeColor={stripeColor}
        specialTextColor={specialTextColor}
        { ...props }
      />
      }
      standardComponent={
        <StandardView 
          highlightColor={highlightColor}
          stripeColor={stripeColor}
          specialTextColor={specialTextColor}
          { ...props } 
        />
      }
    />
  );
};