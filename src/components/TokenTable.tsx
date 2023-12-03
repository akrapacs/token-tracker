import React from 'react';
import { ResponsiveComponent } from './ResponsiveComponents';
import { Coin } from '../types/coin';
import { formatCurrency, formatFloat, formatPercent } from '@/util/text';
import { DetailModal } from './DetailModal';
import { 
  Box,
  Center,
  Flex,
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
import {CopyIcon } from '@chakra-ui/icons'

interface TokenTableProps {
  coins: Coin[],
}

interface InternalProps extends TokenTableProps {
  highlightColor: string;
  stripeColor: string;
  specialTextColor: string;
}

const TdCopyable = (props: any) => {
  const {
    children,
    textToCopy
  } = props;

  const [hovering, setHovering] = React.useState<boolean>(false);
  const [mouseDown, setMoustDown] = React.useState<boolean>(false);

  return (
    <Td
      onMouseEnter={() => { 
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
      _hover={{
        cursor: 'pointer',
      }}
      onMouseDown={() => {
        setMoustDown(true);
      }}
      onMouseUp={() => {
        setMoustDown(false);
      }}
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
      }}
      color={mouseDown ? '#888888' : undefined}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          { children }
        </Box>

        { hovering && (
          <CopyIcon 
            w={4} 
            h={4} 
            color={mouseDown ? '#888888' : 'white'}
          />
        )}
      </Flex>
    </Td>
  );
};

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
                        {coin.athDecay > 0 ? formatPercent(coin.athDecay) : '-'}
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
                  <TdCopyable
                    textToCopy={coin.priceInUsd.toString()}
                  >
                    <Text>
                      {formatCurrency(coin.priceInUsd)}
                    </Text>
                  </TdCopyable>
                  <Td
                    color={coin.flagged ? specialTextColor : undefined}
                    backgroundColor={highlightColor}
                  >
                    <Center>
                      {coin.athDecay > 0 ? formatPercent(coin.athDecay) : '-'}
                    </Center>
                  </Td>
                  <TdCopyable
                    textToCopy={coin.priceInBtc.toString()}
                  >
                    <Text>
                      {formatFloat(coin.priceInBtc)}
                    </Text>
                  </TdCopyable>
                  <TdCopyable
                    textToCopy={coin.ath.toString()}
                  >
                    <Text>
                      {formatCurrency(coin.ath)}
                    </Text>
                  </TdCopyable>
                  <TdCopyable
                    textToCopy={coin.percentOfAth.toString()}
                  >
                    <Text>
                      {formatPercent(coin.percentOfAth)}
                    </Text>
                  </TdCopyable>
                  <TdCopyable
                    textToCopy={coin.fromAth.toString()}
                  >
                    <Text>
                      {formatPercent(coin.fromAth)}
                    </Text>
                  </TdCopyable>
                  <TdCopyable
                    textToCopy={coin.toAth.toString()}
                  >
                    <Text>
                      {formatPercent(coin.toAth)}
                    </Text>
                  </TdCopyable>
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