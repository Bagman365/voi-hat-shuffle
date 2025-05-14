
import './wallet-polyfill' // Must be imported before any wallet libraries
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WalletProvider from './contexts/WalletProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
