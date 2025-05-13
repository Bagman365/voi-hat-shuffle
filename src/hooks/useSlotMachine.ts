
import { useState } from 'react';
import slotMachineService from '@/services/slotMachineService';
import { useToast } from '@/hooks/use-toast';

export const useSlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastBetKey, setLastBetKey] = useState<string | null>(null);
  const [payout, setPayout] = useState<number | null>(null);
  const { toast } = useToast();
  
  const spin = async (betAmount: number): Promise<boolean> => {
    setIsSpinning(true);
    setPayout(null);
    
    try {
      const result = await slotMachineService.spin(betAmount);
      
      if (!result.success) {
        toast({
          title: "Spin Failed",
          description: result.message || "Unable to place bet",
          variant: "destructive"
        });
        return false;
      }
      
      setLastBetKey(result.betKey);
      
      // Simulate waiting for blockchain confirmation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check result
      const spinPayout = await slotMachineService.fetchPayout(result.betKey);
      setPayout(spinPayout);
      
      return spinPayout > 0;
    } catch (error) {
      console.error("Error during spin:", error);
      toast({
        title: "Error",
        description: "Something went wrong while spinning",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSpinning(false);
    }
  };
  
  const claim = async (): Promise<void> => {
    if (!lastBetKey || payout === null || payout <= 0) {
      toast({
        title: "Nothing to Claim",
        description: "No winning bet available to claim",
      });
      return;
    }
    
    try {
      const result = await slotMachineService.claim(lastBetKey);
      
      if (result.success) {
        toast({
          title: "Claimed Successfully",
          description: `${result.amount / 1000000} VOI has been added to your wallet`,
        });
        
        // Reset after successful claim
        setLastBetKey(null);
        setPayout(null);
      } else {
        toast({
          title: "Claim Failed",
          description: "Unable to claim winnings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error claiming winnings:", error);
      toast({
        title: "Error",
        description: "Something went wrong while claiming",
        variant: "destructive"
      });
    }
  };
  
  return {
    isSpinning,
    lastBetKey,
    payout,
    spin,
    claim
  };
};
