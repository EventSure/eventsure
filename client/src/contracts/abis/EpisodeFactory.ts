/**
 * EpisodeFactory Contract ABI
 * 
 * Factory contract for creating and managing insurance episodes.
 * Admin functions are not exposed in the user-facing UI.
 */

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
