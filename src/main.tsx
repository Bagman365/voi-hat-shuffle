
import { createRoot } from 'react-dom/client'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { WalletProvider } from '@txnlab/use-wallet'
import App from './App.tsx'
import './index.css'

// Define the wallets we want to support
const wallets = [
  {
    id: 'defly-wallet',
    name: 'Defly Wallet',
    app: DeflyWalletConnect,
    connectorOptions: {}
  },
  {
    id: 'pera-wallet',
    name: 'Pera Wallet',
    app: PeraWalletConnect,
    connectorOptions: {}
  }
]

// Create root and render app with wallet provider
createRoot(document.getElementById("root")!).render(
  <WalletProvider
    wallets={wallets}
    nodeConfig={{
      network: "mainnet",
      nodeServer: "https://mainnet-api.voi.nodly.io",
      indexerServer: "https://mainnet-idx.voi.nodly.io"
    }}
  >
    <App />
  </WalletProvider>
);
