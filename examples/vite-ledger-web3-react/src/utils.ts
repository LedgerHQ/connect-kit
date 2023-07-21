import type { Connector } from '@web3-react/types'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

export function getName(connector: Connector) {
  if (connector instanceof WalletConnectV2) return 'WalletConnect V2'
  return 'Unknown'
}
