import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { Connector, Web3ReactStore } from '@web3-react/types'
import { Ledger } from '@web3-react/ledger'
// import { WalletConnect } from '@web3-react/walletconnect-v2'
import { Url } from '@web3-react/url'

const testProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
const chains = [1]
const rpcMap = {
  1: 'https://cloudflare-eth.com/',   // Mainnet
  5: 'https://goerli.optimism.io/',  // Goerli
  137: 'https://polygon-rpc.com/',   // Polygon
}

const url = initializeConnector<Url>(
  (actions) => new Url({
    actions,
    url: 'https://cloudflare-eth.com/'
  })
)
const ledger = initializeConnector<Ledger>(
  (actions) => new Ledger({
    actions,
    options: {
      projectId: testProjectId,
      chains,
      showQrModal: true,
      rpcMap,
    },
  }),
)
// const walletConnect = initializeConnector<WalletConnect>(
//   (actions) => new WalletConnect({
//     actions,
//     options: {
//       projectId: testProjectId,
//       chains,
//       showQrModal: true,
//       rpcMap,
//     },
//   }),
// )

export const connectorsObj = {
  // url,
  ledger,
  // walletConnect,
}
export function getName(connector: Connector) {
  if (connector instanceof Ledger) return 'Ledger'
  if (connector instanceof Url) return 'URL'
  return 'Unknown'
}
