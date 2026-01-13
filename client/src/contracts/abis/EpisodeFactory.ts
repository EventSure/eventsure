/**
 * EpisodeFactory Contract ABI
 * 
 * Factory contract for creating and managing insurance episodes.
 * Address: 0x4Bf598243d0851067F98Ca231d1574bEEcD33954
 */

export const EPISODE_FACTORY_ADDRESS = '0xc3f1030491964136a466c699a96395d4B931a2E1' as const

export const EpisodeFactoryABI = [
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'oracle',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'episodes',
    stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [
      { name: 'episode', type: 'address' },
      { name: 'productId', type: 'bytes32' },
      { name: 'signupStart', type: 'uint64' },
      { name: 'signupEnd', type: 'uint64' },
      { name: 'premiumAmount', type: 'uint256' },
      { name: 'payoutAmount', type: 'uint256' },
      { name: 'flightName', type: 'string' },
      { name: 'departureTime', type: 'uint64' },
      { name: 'estimatedArrivalTime', type: 'uint64' },
    ],
  },
  {
    type: 'function',
    name: 'isEpisode',
    stateMutability: 'view',
    inputs: [{ name: 'episode', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allEpisodes',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'list', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'createEpisode',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'bytes32' },
      { name: 'signupStart', type: 'uint64' },
      { name: 'signupEnd', type: 'uint64' },
      { name: 'premiumAmount', type: 'uint256' },
      { name: 'payoutAmount', type: 'uint256' },
      { name: 'flightName', type: 'string' },
      { name: 'departureTime', type: 'uint64' },
      { name: 'estimatedArrivalTime', type: 'uint64' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'openEpisode',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'ep', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'lockEpisode',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'ep', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'closeEpisode',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'ep', type: 'address' }],
    outputs: [],
  },
] as const
