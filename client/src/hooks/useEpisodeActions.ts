import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { EpisodeABI } from '@/contracts/abis'
import type { ContractAddress } from '@/types/contract'

export function useJoinEpisode(episodeAddress: ContractAddress) {
  const queryClient = useQueryClient()
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const join = (premium: bigint) => {
    writeContract(
      {
        address: episodeAddress,
        abi: EpisodeABI,
        functionName: 'join',
        args: [premium],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ 
            queryKey: [{ entity: 'readContract', address: episodeAddress }] 
          })
        },
      }
    )
  }

  return {
    join,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}

export function useClaimPayout(episodeAddress: ContractAddress) {
  const queryClient = useQueryClient()
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claim = () => {
    writeContract(
      {
        address: episodeAddress,
        abi: EpisodeABI,
        functionName: 'claim',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ 
            queryKey: [{ entity: 'readContract', address: episodeAddress }] 
          })
        },
      }
    )
  }

  return {
    claim,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}

export function useWithdrawSurplus(episodeAddress: ContractAddress) {
  const queryClient = useQueryClient()
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const withdraw = () => {
    writeContract(
      {
        address: episodeAddress,
        abi: EpisodeABI,
        functionName: 'withdrawSurplus',
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ 
            queryKey: [{ entity: 'readContract', address: episodeAddress }] 
          })
        },
      }
    )
  }

  return {
    withdraw,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
