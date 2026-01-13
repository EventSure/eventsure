import { useMemo } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { EpisodeFactoryABI, EPISODE_FACTORY_ADDRESS, EpisodeABI } from '@/contracts/abis';
import type { EpisodeData } from '@/types/episode';

export const useMyEpisodes = () => {
  const { address, isConnected } = useAccount();

  const { data: allEpisodesData, isLoading: isLoadingAddresses } = useReadContracts({
    contracts: [{
      address: EPISODE_FACTORY_ADDRESS,
      abi: EpisodeFactoryABI,
      functionName: 'allEpisodes',
    }],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const episodeAddresses = useMemo(() => {
    if (!allEpisodesData?.[0]?.result) return [];
    return allEpisodesData[0].result as `0x${string}`[];
  }, [allEpisodesData]);

  const { data: membershipData, isLoading: isLoadingMembership } = useReadContracts({
    contracts: episodeAddresses.map((episodeAddress) => ({
      address: episodeAddress,
      abi: EpisodeABI,
      functionName: 'members',
      args: [address!],
    })),
    query: {
      enabled: isConnected && !!address && episodeAddresses.length > 0,
    },
  });

  const joinedEpisodeAddresses = useMemo(() => {
    if (!membershipData || episodeAddresses.length === 0) return [];
    
    return episodeAddresses.filter((_, index) => {
      const result = membershipData[index]?.result as [boolean, boolean, boolean] | undefined;
      return result?.[0] === true;
    });
  }, [membershipData, episodeAddresses]);

  const { data: episodeDetails, isLoading: isLoadingDetails } = useReadContracts({
    contracts: joinedEpisodeAddresses.flatMap((address) => [
      { address, abi: EpisodeABI, functionName: 'state' },
      { address, abi: EpisodeABI, functionName: 'totalPremium' },
      { address, abi: EpisodeABI, functionName: 'PREMIUM_AMOUNT' },
      { address, abi: EpisodeABI, functionName: 'PAYOUT_AMOUNT' },
      { address, abi: EpisodeABI, functionName: 'flightName' },
      { address, abi: EpisodeABI, functionName: 'DEPARTURE_TIME' },
      { address, abi: EpisodeABI, functionName: 'ESTIMATED_ARRIVAL_TIME' },
    ]),
    query: {
      enabled: joinedEpisodeAddresses.length > 0,
    },
  });

  const episodes: EpisodeData[] = useMemo(() => {
    if (!episodeDetails || joinedEpisodeAddresses.length === 0) return [];
    
    return joinedEpisodeAddresses.map((address, index) => {
      const baseIndex = index * 7;
      
      return {
        address,
        state: (episodeDetails[baseIndex]?.result as number) ?? 0,
        totalPremium: (episodeDetails[baseIndex + 1]?.result as bigint) ?? 0n,
        premiumAmount: (episodeDetails[baseIndex + 2]?.result as bigint) ?? 0n,
        payoutAmount: (episodeDetails[baseIndex + 3]?.result as bigint) ?? 0n,
        flightName: (episodeDetails[baseIndex + 4]?.result as string) ?? '',
        departureTime: (episodeDetails[baseIndex + 5]?.result as bigint) ?? 0n,
        estimatedArrivalTime: (episodeDetails[baseIndex + 6]?.result as bigint) ?? 0n,
        signupEnd: 0n,
      };
    }).filter((ep) => ep.flightName);
  }, [episodeDetails, joinedEpisodeAddresses]);

  return {
    episodes,
    isLoading: isLoadingAddresses || isLoadingMembership || isLoadingDetails,
  };
};
