export const EpisodeState = {
  Created: 0,
  Open: 1,
  Locked: 2,
  Resolved: 3,
  Settled: 4,
  Closed: 5,
} as const;

export type EpisodeStateValue = typeof EpisodeState[keyof typeof EpisodeState];

export interface EpisodeData {
  address: `0x${string}`;
  flightName: string;
  premiumAmount: bigint;
  payoutAmount: bigint;
  departureTime: bigint;
  estimatedArrivalTime: bigint;
  signupEnd: bigint;
  state: number;
  totalPremium: bigint;
}

export type ViewState = "LIST" | "RULES" | "JOIN" | "DASHBOARD";

export interface Step {
  key: ViewState;
  index: number;
}
