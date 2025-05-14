
import React, { ReactNode } from 'react';
import { WalletProvider as UseWalletProvider, PROVIDER_ID } from '@txnlab/use-wallet-react';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import algosdk from 'algosdk';

interface WalletProviderProps {
  children: ReactNode;
}

// VOI Testnet Network configuration
const network = {
  algodToken: '',
  algodServer: 'https://testnet-api.voi.nodly.io',
  algodPort: '',
  indexerToken: '',
  indexerServer: 'https://testnet-idx.voi.nodly.io',
  indexerPort: '',
  genesisID: 'voitest-v1',
  genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
  chainId: 4160
};

// Create algod client
const algodClient = new algosdk.Algodv2(
  network.algodToken,
  network.algodServer,
  network.algodPort
);

// Initialize wallet connectors
const walletConnectors = [
  { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
  { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
  { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect }
];

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <UseWalletProvider
      value={{
        providers: walletConnectors,
        nodeConfig: {
          network: network.genesisID,
          nodeServer: network.algodServer,
          nodePort: network.algodPort,
          nodeToken: network.algodToken,
          indexerServer: network.indexerServer,
          indexerPort: network.indexerPort,
          indexerToken: network.indexerToken
        }
      }}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
