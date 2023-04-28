import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createClient, goerli, Connector } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygon } from 'wagmi/chains'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon],
  [publicProvider()],
)

export { chains };

const client = createClient({
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
    }) as unknown as Connector<any, any, any>,
  ],
  provider,
  webSocketProvider,
})

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
}
