import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  ledgerWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const testProjectId = '85a25426af6e359da0d3508466a95a1d';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygon],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      ledgerWallet({ chains, projectId: testProjectId }),
      walletConnectWallet({ chains, projectId: testProjectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
