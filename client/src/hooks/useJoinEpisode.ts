import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { EpisodeABI } from '@/contracts/abis';
import type { EpisodeData } from '@/types/episode';

interface UseJoinEpisodeProps {
  selectedEpisode: EpisodeData | undefined;
  onSuccess?: () => void;
}

export const useJoinEpisode = ({ selectedEpisode, onSuccess }: UseJoinEpisodeProps) => {
  const { isConnected, address } = useAccount();
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleJoin = () => {
    if (!isConnected) {
      return { needsConnection: true };
    }

    if (!selectedEpisode) {
      return { error: 'No episode selected' };
    }

    writeContract({
      address: selectedEpisode.address,
      abi: EpisodeABI,
      functionName: "join",
      value: selectedEpisode.premiumAmount,
    });

    return { needsConnection: false };
  };

  useEffect(() => {
    if (isConfirmed && onSuccess) {
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  return {
    handleJoin,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
    isConnected,
    address,
  };
};
