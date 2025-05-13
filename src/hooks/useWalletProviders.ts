
import { useState, useEffect } from 'react';
import walletService from '@/services/walletService';

export const useWalletProviders = () => {
  const [walletOptions, setWalletOptions] = useState<{
    hasVera: boolean;
    hasKibisis: boolean;
    hasLute: boolean;
    hasDefly: boolean;
    hasPera: boolean;
  }>({
    hasVera: false,
    hasKibisis: false,
    hasLute: false,
    hasDefly: false,
    hasPera: false
  });

  useEffect(() => {
    const checkAvailableWallets = async () => {
      const providers = await walletService.checkWalletProviders();
      setWalletOptions(providers);
    };
    
    checkAvailableWallets();
  }, []);

  const getAvailableWalletOptions = () => {
    const options = [
      { 
        name: 'Kibisis', 
        id: 'kibisis', 
        logo: '🟣', 
        available: walletOptions.hasKibisis,
        recommended: true
      },
      { 
        name: 'Lute', 
        id: 'lute', 
        logo: '🟣', 
        available: walletOptions.hasLute 
      },
      { 
        name: 'Pera', 
        id: 'pera', 
        logo: '🔵', 
        available: walletOptions.hasPera 
      },
      { 
        name: 'Defly', 
        id: 'defly', 
        logo: '🔵', 
        available: walletOptions.hasDefly 
      },
      { 
        name: 'BiatecWallet', 
        id: 'biatec', 
        logo: '🔵', 
        available: false 
      },
      { 
        name: 'WalletConnect', 
        id: 'walletconnect', 
        logo: '🔵', 
        available: false 
      },
    ];

    // If on mobile, add Vera wallet
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      options.unshift({ 
        name: 'Vera', 
        id: 'vera', 
        logo: '🟣', 
        available: walletOptions.hasVera,
        recommended: true
      });
    }

    // Show available wallets first, then others
    return options.sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return 0;
    });
  };

  return {
    walletOptions,
    getAvailableWalletOptions
  };
};
