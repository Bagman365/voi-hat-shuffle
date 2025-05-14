
import React, { ReactNode } from 'react';
import { PROVIDER_ID, ProvidersArray, WalletProvider as UseWalletProvider } from '@txnlab/use-wallet';
import { PeraWalletConnect } from '@perawallet/connect';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Initialize our supported wallets
  const pera = new PeraWalletConnect();
  
  // For future implementation if needed:
  // const defly = new DeflyWalletConnect();
  // const daffi = new DaffiWalletConnect();
  
  // Create WalletConnect modal controller
  const wcModalController = {
    projectId: 'your-project-id', // You'll need to get a proper project ID from WalletConnect
    chains: ['voitest-v1'],
    metadata: {
      name: 'VOI Hat Monte',
      description: 'Hat Monte game for VOI blockchain',
      url: window.location.host,
      icons: [`${window.location.origin}/favicon.ico`]
    }
  };

  // Configure provider(s) to display
  const providers: ProvidersArray = [
    { id: PROVIDER_ID.PERA, clientStatic: pera }
    // For future implementation if needed:
    // { id: PROVIDER_ID.DEFLY, clientStatic: defly },
    // { id: PROVIDER_ID.DAFFI, clientStatic: daffi },
    // { id: PROVIDER_ID.WALLETCONNECT, clientStatic: walletConnect }
  ];

  return (
    <UseWalletProvider
      providers={providers}
      nodeConfig={{ 
        network: 'voitest-v1', 
        nodeServer: 'https://testnet-api.voi.nodly.io',
        indexerServer: 'https://testnet-idx.voi.nodly.io'
      }}
    >
      {children}
    </UseWalletProvider>
  );
};

export default WalletProvider;
