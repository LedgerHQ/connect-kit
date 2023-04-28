import { useEffect } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { Box, Button } from './StyledComponents'

export const NetworkSwitcher = () => {
  const { chain } = useNetwork()
  const { chains, isError, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork()

    console.log(chain, chains)

  return (
    <Box>
      {chain && <Box>Using {chain.name}</Box>}

      {chain && chains.map((x) => (
        <Box key={x.id}>
          <Button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            Switch to {x.name}
            {status === 'loading' && x.id === pendingChainId && '…'}
          </Button>
        </Box>
      ))}

      {isError &&
        <div>{error && (error?.message ?? 'Failed to switch')}</div>
      }
    </Box>
  )
}
