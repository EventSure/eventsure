import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { EpisodeFactoryABI, EPISODE_FACTORY_ADDRESS, EpisodeABI } from '@/contracts/abis';
import type { EpisodeData } from '@/types/episode';

export const useEpisodes = () => {
  const { data: allEpisodesData, isLoading: isLoadingAddresses } = useReadContracts({
    contracts: [{
      address: EPISODE_FACTORY_ADDRESS,
      abi: EpisodeFactoryABI,
      functionName: 'allEpisodes',
    }],
  });

  const episodeAddresses = useMemo(() => {
    if (!allEpisodesData?.[0]?.result) return [];
    return allEpisodesData[0].result as `0x${string}`[];
  }, [allEpisodesData]);

  const { data: episodeDetails, isLoading: isLoadingDetails } = useReadContracts({
    contracts: episodeAddresses.flatMap((address) => [
      { address, abi: EpisodeABI, functionName: 'state' },
      { address, abi: EpisodeABI, functionName: 'totalPremium' },
      { address, abi: EpisodeABI, functionName: 'PREMIUM_AMOUNT' },
      { address, abi: EpisodeABI, functionName: 'PAYOUT_AMOUNT' },
      { address, abi: EpisodeABI, functionName: 'flightName' },
      { address, abi: EpisodeABI, functionName: 'DEPARTURE_TIME' },
      { address, abi: EpisodeABI, functionName: 'ESTIMATED_ARRIVAL_TIME' },
    ]),
  });

  const episodes: EpisodeData[] = useMemo(() => {
    if (!episodeDetails || episodeAddresses.length === 0) return [];
    
    return episodeAddresses.map((address, index) => {
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
  }, [episodeDetails, episodeAddresses]);

  return {
    episodes,
    isLoading: isLoadingAddresses || isLoadingDetails,
  };
};
