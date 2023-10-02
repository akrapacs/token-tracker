import React from 'react';
import { Coin } from '../types/coin';
import { formatCurrency, formatFloat, formatPercent } from '@/util/text';
import { 
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface DetailModalProps {
  coin: Coin,
  isOpen: boolean,
  onClose: () => void,
}

const Field = (props: any) => {
  const {
    coin,
    deets,
    backgroundColor,
  } = props;

  const value = React.useMemo(() => {
    switch(deets[2]) {
      case 'currency':
        return formatCurrency(coin[deets[1]]);
      case 'percent':
        return formatPercent(coin[deets[1]]);
      case 'float':
        return formatFloat(coin[deets[1]]);
      default:
        return coin[deets[1]];
    }
  }, [coin, deets]);
  
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding={2}
      backgroundColor={backgroundColor}
    >
      <Text
        fontWeight="bold"
      >
        {deets[0]}
      </Text>

      <Text
        color={coin.flagged ? 'blue' : undefined}
      >
        {value}
      </Text>
    </Flex>
  );
}

const ModalFields = [
  ['USD Price', 'priceInUsd', 'currency'],
  ['BTC Price', 'priceInBtc', 'float'],
  ['ATH', 'ath', 'currency'],
  ['% of ATH', 'percentOfAth','percent'],
  ['From ATH', 'fromAth', 'percent'],
  ['To ATH', 'toAth', 'percent'],
  ['ATH Decay', 'athDecay', 'percent'],
];

export const DetailModal = (props: DetailModalProps) => {
  const {
    isOpen,
    onClose,
    coin,
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Text
              fontSize="1.2em"
              fontWeight="bold"
              textAlign="center"
              mt={2}
            >
              {coin.symbol}
            </Text>

            <Flex
              flexDirection="column"
            >
              {
                ModalFields.map((deets: string[], index: number) => {
                  return (
                    <Field
                      key={deets[0]}
                      coin={coin}
                      deets={deets}
                      backgroundColor={index % 2 !== 0 ? "#cccccc" : undefined} 
                    />
                  );
                })
              }
            </Flex>
          </ModalBody>

        </ModalContent>
      </Modal>
  );
};