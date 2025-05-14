
import React, { ReactNode } from 'react';
import { WalletProvider as UseWalletProvider } from '@txnlab/use-wallet-react';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';

interface WalletProviderProps {
  children: ReactNode;
}

// Initialize the wallet connectors
const peraWallet = new PeraWalletConnect();
const deflyWallet = new DeflyWalletConnect();
const daffiWallet = new DaffiWalletConnect();

// VOI network configuration
const VOI_NETWORK = {
  nodeServer: 'https://testnet-api.voi.nodly.io',
  nodePort: '',
  nodeToken: '',
  indexerServer: 'https://testnet-idx.voi.nodly.io',
  indexerPort: '',
  indexerToken: '',
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <UseWalletProvider
      wallets={[peraWallet, deflyWallet, daffiWallet]}
      network={{
        id: 'voi',
        algod: {
          server: VOI_NETWORK.nodeServer,
          port: VOI_NETWORK.nodePort,
          token: VOI_NETWORK.nodeToken,
        },
        indexer: {
          server: VOI_NETWORK.indexerServer,
          port: VOI_NETWORK.indexerPort,
          token: VOI_NETWORK.indexerToken,
        }
      }}
    >
      {children}
    </UseWalletProvider>
  );
}

export default WalletProvider;
