
import { useState } from 'react';
import slotMachineService from '@/services/slotMachineService';
import { useToast } from '@/hooks/use-toast';

export const useSlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastBetKey, setLastBetKey] = useState<string | null>(null);
  const [payout, setPayout] = useState<number | null>(null);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const { toast } = useToast();
  
  const spin = async (betAmount: number): Promise<boolean> => {
    setIsSpinning(true);
    setPayout(null);
    setIsClaimable(false);
    
    try {
      // Convert to microVOI if necessary
      const microVOIAmount = betAmount;
      
      const result = await slotMachineService.spin(microVOIAmount);
      
      if (!result.success) {
        toast({
          title: "Spin Failed",
          description: result.message || "Unable to place bet",
          variant: "destructive"
        });
        return false;
      }
      
      setLastBetKey(result.betKey);
      
      // Wait for blockchain confirmation
      toast({
        title: "Transaction Submitted",
        description: "Waiting for blockchain confirmation...",
      });
      
      // Simulate waiting for blockchain confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check result
      const spinPayout = await slotMachineService.fetchPayout(result.betKey);
      setPayout(spinPayout);
      
      // If there's a payout, it's claimable
      if (spinPayout > 0) {
        setIsClaimable(true);
      }
      
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
  
  const claim = async (): Promise<boolean> => {
    if (!lastBetKey || payout === null || payout <= 0 || !isClaimable) {
      toast({
        title: "Nothing to Claim",
        description: "No winning bet available to claim",
      });
      return false;
    }
    
    setIsClaiming(true);
    
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
        setIsClaimable(false);
        return true;
      } else {
        toast({
          title: "Claim Failed",
          description: "Unable to claim winnings",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error claiming winnings:", error);
      toast({
        title: "Error",
        description: "Something went wrong while claiming",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsClaiming(false);
    }
  };
  
  return {
    isSpinning,
    lastBetKey,
    payout,
    isClaimable,
    isClaiming,
    spin,
    claim
  };
};
