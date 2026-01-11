import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mantle, mantleSepoliaTestnet, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set. Wallet connection may not work properly.')
}

export const queryClient = new QueryClient()

const metadata = {
  name: 'EventSure',
  description: 'Web3-based event insurance platform powered by Mantle Network',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://eventsure.app',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : 'https://eventsure.app/icon.png']
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mantleSepoliaTestnet, mantle]

const customRpcUrls = {
  'eip155:5003': [{ url: 'https://rpc.sepolia.mantle.xyz' }],
  'eip155:5000': [{ url: 'https://rpc.mantle.xyz' }]
}

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId || 'demo-project-id',
  ssr: false,
  customRpcUrls
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: mantleSepoliaTestnet,
  projectId: projectId || 'demo-project-id',
  metadata,
  customRpcUrls,
  features: {
    analytics: true,
    email: false,
    socials: [],
  }
})

export const config = wagmiAdapter.wagmiConfig

export { mantle, mantleSepoliaTestnet }
