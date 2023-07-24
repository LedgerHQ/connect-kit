import { initializeConnector } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Ledger } from '@web3-react/ledger'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { Url } from '@web3-react/url'

const testProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
const requiredChains = [1]
const optionalChains = [5, 137]
const rpcMap = {
  1: 'https://cloudflare-eth.com/',   // Mainnet
  5: 'https://goerli.optimism.io/',  // Goerli
  137: 'https://polygon-rpc.com/',   // Polygon
}

const ledger = initializeConnector<Ledger>(
  (actions) => new Ledger({
    actions,
    options: {
      projectId: testProjectId,
      chains: requiredChains,
      optionalChains,
      rpcMap,
    },
    defaultChainId: 137
  }),
)
console.log(ledger)

const walletConnect = initializeConnector<WalletConnect>(
  (actions) => new WalletConnect({
    actions,
    options: {
      projectId: testProjectId,
      chains: requiredChains,
      optionalChains,
      showQrModal: true,
      rpcMap,
    },
  }),
)

// const url = initializeConnector<Url>(
//   (actions) => new Url({
//     actions,
//     url: 'https://cloudflare-eth.com/'
//   })
// )

export const connectorsObj = {
  ledger,
  walletConnect,
  // url,
}

export function getName(connector: Connector) {
  if (connector instanceof Ledger) return 'Ledger'
  if (connector instanceof Url) return 'URL'
  if (connector instanceof WalletConnect) return 'WalletConnect'
  return 'Unknown'
}
