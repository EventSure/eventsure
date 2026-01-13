import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
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

  // Check if user already joined
  const { data: memberData } = useReadContract({
    address: selectedEpisode?.address,
    abi: EpisodeABI,
    functionName: 'members',
    args: address ? [address] : undefined,
    query: {
      enabled: !!selectedEpisode && !!address && isConnected,
    },
  });

  const hasJoined = memberData ? memberData[0] : false;

  const handleJoin = () => {
    if (!isConnected) {
      return { needsConnection: true };
    }

    if (!selectedEpisode) {
      return { error: 'No episode selected' };
    }

    if (hasJoined) {
      return { alreadyJoined: true };
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
    hasJoined,
  };
};
