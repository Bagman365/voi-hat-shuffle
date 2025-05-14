
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// We'll implement our own context without relying on the @txnlab package
createRoot(document.getElementById("root")!).render(<App />);
