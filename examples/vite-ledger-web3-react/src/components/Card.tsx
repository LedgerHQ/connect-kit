import { useEffect, useState } from 'react'
import { Web3ReactSelectedHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Box } from "./StyledComponents"
import { getName } from '../connectors'

export default function Card({
  connector,
  hooks,
}: {
  connector: Connector,
  hooks: Web3ReactSelectedHooks,
  name: string
}) {
  const { useSelectedAccount, useSelectedChainId, useSelectedIsActive, useSelectedIsActivating } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const chain = useSelectedChainId(connector)

  const [ error, setError ] = useState<Error | undefined>(undefined)
  const [ connectionStatus, setConnectionStatus ] = useState('disconnected')

  const handleToggleConnect = () => {
    setError(undefined)

    if (isActive) {
      if (connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
    } else if (!isActivating) {
      setConnectionStatus('connecting..')
      Promise.resolve(connector.activate(1))
      .catch((e) => {
        connector.resetState()
        setError(e)
      })
    }
  }

  useEffect(() => {
    if (isActive) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('disconnected')
    }
  }, [isActive])

  return (
    <div>
      <h3>{getName(connector)}</h3>
      <Box>Status - {(error?.message) ? ("Error: " + error.message) : connectionStatus}</Box>
      <Box>Address - {account ? account : "none"}</Box>
      <Box>ChainId -  {chain ? chain : 'none'}</Box>
      <button onClick={handleToggleConnect} disabled={false}>
        {isActive ? "Disconnect" : "Connect"}
      </button>
    </div>
  )
}
