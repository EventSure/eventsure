import type { ContractAddress } from '@/types/contract'

export const CONTRACTS = {
  EpisodeFactory: {
    address: (import.meta.env.VITE_EPISODE_FACTORY_ADDRESS || 
             '0x0000000000000000000000000000000000000000') as ContractAddress,
  },
} as const

export const isContractConfigured = () => {
  return CONTRACTS.EpisodeFactory.address !== '0x0000000000000000000000000000000000000000'
}
