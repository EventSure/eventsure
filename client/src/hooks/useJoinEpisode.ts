import { useEffect, useRef } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { EpisodeABI } from '@/contracts/abis';
import type { EpisodeData } from '@/types/episode';

const API_BASE_URL = 'https://eventsure-production.up.railway.app';

interface UseJoinEpisodeProps {
  selectedEpisode: EpisodeData | undefined;
  onSuccess?: () => void;
}

const createUserEpisode = async (user: string, episode: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/user-episodes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, episode }),
  });

  if (!response.ok) {
    console.error('Failed to create user episode record');
  }
};

export const useJoinEpisode = ({ selectedEpisode, onSuccess }: UseJoinEpisodeProps) => {
  const { isConnected, address } = useAccount();
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const hasNotifiedServer = useRef(false);

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

    hasNotifiedServer.current = false;

    writeContract({
      address: selectedEpisode.address,
      abi: EpisodeABI,
      functionName: "join",
      value: selectedEpisode.premiumAmount,
    });

    return { needsConnection: false };
  };

  useEffect(() => {
    if (isConfirmed && !hasNotifiedServer.current && address && selectedEpisode) {
      hasNotifiedServer.current = true;
      createUserEpisode(address, selectedEpisode.address);
      onSuccess?.();
    }
  }, [isConfirmed, address, selectedEpisode, onSuccess]);

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
