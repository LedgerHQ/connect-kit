import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'
import { init } from '@web3-onboard/react'

const testProjectId = '85a25426af6e359da0d3508466a95a1d';

const ledger = ledgerModule({
  enableDebugLogs: true,
  version: 2,
  projectId: testProjectId,
  requiredChains: [1],
})

const walletConnect = walletConnectModule({
  version: 2,
  projectId: testProjectId,
  requiredChains: [1],
})

import icon from './icon'

export default init({
  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [
    ledger,
    walletConnect,
  ],
  // An array of Chains that your app supports
  chains: [
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: '0x1',
      // string indicating chain namespace. Defaults to 'evm' but will allow other chain namespaces in the future
      namespace: 'evm',
      // the native token symbol, eg ETH, BNB, MATIC
      token: 'ETH',
      // used for display, eg Ethereum Mainnet
      label: 'Ethereum Mainnet',
      // used for network requests
      rpcUrl: 'https://cloudflare-eth.com/'
    },
    {
      id: '0x5',
      token: 'ETH',
      label: 'Ethereum Göerli Testnet',
      rpcUrl: 'https://goerli.optimism.io/'
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Matic Mainnet',
      rpcUrl: 'https://polygon-rpc.com/'
    }
  ],
  connect: {
    // disableClose: true,
    disableUDResolution: true,
    autoConnectLastWallet: true,
    // autoConnectAllPreviousWallet: true
  },
  appMetadata: {
    // The name of your dApp
    name: 'Blocknative',
    // SVG icon string, with height or width (whichever is larger) set to 100% or a valid image URL
    icon,
    // Optional wide format logo (ie icon and text) to be displayed in the sidebar of connect modal. Defaults to icon if not provided
    logo: '<svg></svg>',
    // The description of your app
    description: 'Demo app for Onboard V2',
    // The url to a getting started guide for app
    gettingStartedGuide: 'http://mydapp.io/getting-started',
    // url that points to more information about app
    explore: 'http://mydapp.io/about',
    // if your app only supports injected wallets and when no injected wallets detected, recommend the user to install some
    recommendedInjectedWallets: [],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    }
  }
})
