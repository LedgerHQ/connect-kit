import { useCallback, useEffect, useState } from 'react'
import { Connector } from '@web3-react/types'
import { Box, Button, Container } from "./StyledComponents"
import { getName } from '../connectors'

export default function Card({
  connector,
  hooks,
}: {
  connector: Connector,
  hooks: any,
  name: string
}) {
  const {
    useChainId,
    // useAccounts,
    useAccount,
    // useIsActivating,
    useIsActive,
    // useProvider,
    // useENSNames
  } = hooks

  const isActive = useIsActive(connector)
  const account = useAccount(connector)
  const chainId = useChainId(connector)

  const [ error, setError ] = useState<Error | undefined>(undefined)
  const [ connectionStatus, setConnectionStatus ] = useState('disconnected')
  const [ , setDesiredChainId ] = useState<number>(-1)

  const handleToggleConnect = async () => {
    setError(undefined)

    console.log('connector is', connector)
    console.log('connector.activate is', connector.activate)

    if (isActive && account) {
      if (connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
    } else { //if (!isActivating) {
      setConnectionStatus('connecting..')
      Promise.resolve(connector.activate())
      .catch((e: Error) => {
        console.log(e)
        connector.resetState()
        setError(e)
      })
    }
  }

  useEffect(() => {
    if (isActive && account) {
      setConnectionStatus('connected')
    } else {
      setConnectionStatus('disconnected')

      // Promise.resolve(connector?.connectEagerly?.())
      // .catch((e: Error) => {
      //   connector.resetState()
      //   setError(e)
      // })
    }
  }, [connector, isActive, account])

  const handleSwitchChain = useCallback(
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId)
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) return
      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) return

      // WalletConnect, Ledger and Network connectors
      await connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
    },
    [connector, chainId]
  )

  return (
    <Container>
      <h3>{getName(connector)}</h3>
      <Box>Status - {(error?.message) ? ("Error: " + error.message) : connectionStatus}</Box>
      <Box>Address - {account ? account : "none"}</Box>
      <Box>ChainId -  {chainId ? chainId : 'none'}</Box>

      <Box>
        <Button onClick={handleToggleConnect} disabled={false}>
          {isActive && account ? "Disconnect" : "Connect"}
        </Button>
      </Box>

      {account ? <>
        <Box>
          <Button onClick={() => handleSwitchChain(1)} disabled={chainId === 1}>
            Switch to Ethereum
          </Button>
        </Box>
        <Box>
          <Button onClick={() => handleSwitchChain(137)} disabled={chainId === 137}>
            Switch to Polygon
          </Button>
        </Box>
      </> : <></>
      }
    </Container>
  )
}
