import { useReadContract } from 'wagmi'
import { EpisodeFactoryABI } from '@/contracts/abis'
import { CONTRACTS } from '@/config/contracts'

export function useAllEpisodes() {
  return useReadContract({
    address: CONTRACTS.EpisodeFactory.address,
    abi: EpisodeFactoryABI,
    functionName: 'allEpisodes',
    query: {
      refetchInterval: 15000,
      staleTime: 10000,
    },
  })
}

export function useIsEpisode(episodeAddress: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.EpisodeFactory.address,
    abi: EpisodeFactoryABI,
    functionName: 'isEpisode',
    args: [episodeAddress],
  })
}
