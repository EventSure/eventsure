import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { EpisodeABI, EpisodeFactoryABI } from '@/contracts/abis';
import { useFactoryStore } from '@/stores/factoryStore';
import type { EpisodeData } from '@/types/episode';

const API_BASE_URL = 'https://eventsure-production.up.railway.app';

const fetchEpisodeAddresses = async (): Promise<`0x${string}`[]> => {
  const response = await fetch(`${API_BASE_URL}/api/episodes`);
  if (!response.ok) {
    throw new Error('Failed to fetch episodes from API');
  }
  const data = await response.json();
  return (data.episodes as string[]).map(addr => addr.toLowerCase() as `0x${string}`)
};

export const useEpisodes = (useContractDirectly = false) => {
  const factoryAddress = useFactoryStore((state) => state.factoryAddress);

  const { data: contractEpisodes, isLoading: isLoadingFromContract } = useReadContracts({
    contracts: [{
      address: factoryAddress,
      abi: EpisodeFactoryABI,
      functionName: 'allEpisodes',
    }],
    query: {
      enabled: useContractDirectly,
    },
  });

  const { data: apiEpisodes = [], isLoading: isLoadingFromApi } = useQuery({
    queryKey: ['episodeAddresses'],
    queryFn: fetchEpisodeAddresses,
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: !useContractDirectly,
  });

  const episodeAddresses = useMemo(() => {
    if (useContractDirectly && contractEpisodes?.[0]?.result) {
      return (contractEpisodes[0].result as `0x${string}`[]).map(
        addr => addr.toLowerCase() as `0x${string}`
      );
    }
    return apiEpisodes;
  }, [useContractDirectly, contractEpisodes, apiEpisodes]);

  const isLoadingAddresses = useContractDirectly ? isLoadingFromContract : isLoadingFromApi;

  /*
   * ORIGINAL CONTRACT DIRECT QUERY - Commented out per user request
   * Can be restored if backend is unavailable
   *
   * import { EpisodeFactoryABI, EPISODE_FACTORY_ADDRESS } from '@/contracts/abis';
   * 
   * const { data: allEpisodesData, isLoading: isLoadingAddresses } = useReadContracts({
   *   contracts: [{
   *     address: EPISODE_FACTORY_ADDRESS,
   *     abi: EpisodeFactoryABI,
   *     functionName: 'allEpisodes',
   *   }],
   * });
   *
   * const episodeAddresses = useMemo(() => {
   *   if (!allEpisodesData?.[0]?.result) return [];
   *   return allEpisodesData[0].result as `0x${string}`[];
   * }, [allEpisodesData]);
   */

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
    query: {
      enabled: episodeAddresses.length > 0,
    },
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
