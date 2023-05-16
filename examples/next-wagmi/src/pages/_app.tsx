import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon, goerli } from 'wagmi/chains'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygon],
  [publicProvider()],
)

export { chains };

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new LedgerConnector({
      chains,
      options: {
        enableDebugLogs: true,
        chainId: 1,
      }
    }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        chainId: 1,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
}
