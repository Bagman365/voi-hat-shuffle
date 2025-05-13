
import { createRoot } from 'react-dom/client'
import { useInitializeProviders, WalletProvider } from "@txnlab/use-wallet";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <WalletProvider
    wallets={["kibisis", "lute", "walletconnect", "pera"]}
    nodeConfig={{
      network: "mainnet",
      nodeServer: "https://mainnet-api.voi.nodly.io",
      indexerServer: "https://mainnet-idx.voi.nodly.io"
    }}
  >
    <App />
  </WalletProvider>
);
