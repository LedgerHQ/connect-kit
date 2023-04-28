// import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { useIsMounted } from '../hooks'
import { Box, Button } from './StyledComponents'

export const Connect = () => {
  const isMounted = useIsMounted()
  const { connector, isReconnecting } = useAccount()
  const { connect, connectors, isLoading, isError, error, pendingConnector } =
    useConnect()

  return (
    <Box>
      <Box>
        {connectors.map((x) => (
          <Button
            disabled={!x.ready || isReconnecting || connector?.id === x.id}
            key={x.name}
            onClick={() => connect({ connector: x })}
          >
            {x.name}
            {isMounted && !x.ready && ' (unsupported)'}
            {isLoading && x.id === pendingConnector?.id && '…'}
          </Button>
        ))}
      </Box>

      {isError &&
        <Box>{error && error.message}</Box>
      }
    </Box>
  )
}
