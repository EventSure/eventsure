import { http } from 'wagmi'
import { mantleSepoliaTestnet, mantle } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Get WalletConnect project ID from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

export const config = getDefaultConfig({
  appName: 'EventSure',
  projectId,
  chains: [mantle, mantleSepoliaTestnet],
  transports: {
    [mantle.id]: http(),
    [mantleSepoliaTestnet.id]: http(),
  },
  ssr: false,
})

export { mantle, mantleSepoliaTestnet }
