import { useReadContract } from 'wagmi'
import { EpisodeABI } from '@/contracts/abis'
import type { ContractAddress } from '@/types/contract'
import { EpisodeState } from '@/types/contract'

export function useEpisodeState(episodeAddress: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'state',
    query: {
      refetchInterval: 10000,
      enabled: episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useEpisodeTotalPremium(episodeAddress: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'totalPremium',
    query: {
      refetchInterval: 10000,
      enabled: episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useEpisodeTotalPayout(episodeAddress: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'totalPayout',
    query: {
      enabled: episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useEpisodeSurplus(episodeAddress: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'surplus',
    query: {
      enabled: episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useEpisodeEventOccurred(episodeAddress: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'eventOccurred',
    query: {
      enabled: episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useUserPremium(episodeAddress: ContractAddress, userAddress?: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'premiumOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: Boolean(userAddress) && episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useUserClaimed(episodeAddress: ContractAddress, userAddress?: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'claimed',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: Boolean(userAddress) && episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useUserSurplusWithdrawn(episodeAddress: ContractAddress, userAddress?: ContractAddress) {
  return useReadContract({
    address: episodeAddress,
    abi: EpisodeABI,
    functionName: 'surplusWithdrawn',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: Boolean(userAddress) && episodeAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

export function useEpisodeData(episodeAddress: ContractAddress) {
  const { data: state } = useEpisodeState(episodeAddress)
  const { data: totalPremium } = useEpisodeTotalPremium(episodeAddress)
  const { data: totalPayout } = useEpisodeTotalPayout(episodeAddress)
  const { data: surplus } = useEpisodeSurplus(episodeAddress)
  const { data: eventOccurred } = useEpisodeEventOccurred(episodeAddress)

  return {
    address: episodeAddress,
    state: state ?? EpisodeState.Created,
    totalPremium: totalPremium ?? 0n,
    totalPayout: totalPayout ?? 0n,
    surplus: surplus ?? 0n,
    eventOccurred: eventOccurred ?? false,
  }
}

export function useUserEpisodeData(episodeAddress: ContractAddress, userAddress?: ContractAddress) {
  const { data: state } = useEpisodeState(episodeAddress)
  const { data: premium } = useUserPremium(episodeAddress, userAddress)
  const { data: hasClaimed } = useUserClaimed(episodeAddress, userAddress)
  const { data: hasWithdrawn } = useUserSurplusWithdrawn(episodeAddress, userAddress)
  const { data: eventOccurred } = useEpisodeEventOccurred(episodeAddress)

  const canJoin = state === EpisodeState.Open
  const canClaim = state === EpisodeState.Settled && eventOccurred === true && hasClaimed === false && (premium ?? 0n) > 0n
  const canWithdraw = state === EpisodeState.Settled && eventOccurred === false && hasWithdrawn === false && (premium ?? 0n) > 0n

  return {
    premium: premium ?? 0n,
    hasClaimed: hasClaimed ?? false,
    hasWithdrawn: hasWithdrawn ?? false,
    canJoin,
    canClaim,
    canWithdraw,
  }
}
