export const EpisodeState = {
  Created: 0,
  Open: 1,
  Locked: 2,
  Resolved: 3,
  Settled: 4,
  Closed: 5,
} as const

export type EpisodeState = typeof EpisodeState[keyof typeof EpisodeState]

export interface EpisodeData {
  address: `0x${string}`;
  state: EpisodeState;
  totalPremium: bigint;
  totalPayout: bigint;
  surplus: bigint;
  eventOccurred: boolean;
}

export interface UserEpisodeData {
  premium: bigint;
  hasClaimed: boolean;
  hasWithdrawn: boolean;
  canJoin: boolean;
  canClaim: boolean;
  canWithdraw: boolean;
}

export interface EpisodeInfo {
  episode: `0x${string}`;
  productId: string;
  signupStart: bigint;
  signupEnd: bigint;
}

export type ContractAddress = `0x${string}`;
