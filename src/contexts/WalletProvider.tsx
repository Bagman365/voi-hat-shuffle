
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
      wallets={[
        { id: 'pera-wallet', name: 'Pera', wallet: peraWallet },
        { id: 'defly-wallet', name: 'Defly', wallet: deflyWallet },
        { id: 'daffi-wallet', name: 'Daffi', wallet: daffiWallet },
      ]}
      nodeConfig={{
        network: 'voi',
        nodeServer: VOI_NETWORK.nodeServer,
        nodePort: VOI_NETWORK.nodePort,
        nodeToken: VOI_NETWORK.nodeToken,
        indexerServer: VOI_NETWORK.indexerServer,
        indexerPort: VOI_NETWORK.indexerPort,
        indexerToken: VOI_NETWORK.indexerToken,
      }}
    >
      {children}
    </UseWalletProvider>
  );
}

export default WalletProvider;
