import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon, goerli } from 'wagmi/chains'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const testProjectId = '85a25426af6e359da0d3508466a95a1d';

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
        projectId: testProjectId,
        requiredChains: [1],
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: testProjectId,
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
