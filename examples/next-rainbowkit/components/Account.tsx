import { useAccount } from 'wagmi'

import { useIsMounted } from '../hooks'
import { Box } from './StyledComponents'

export const Account = () => {
  const isMounted = useIsMounted()
  const account = useAccount({
    onConnect: (data) => console.log('connected', data),
    onDisconnect: () => console.log('disconnected'),
  })

  return (
    <Box>
      {isMounted && account?.connector?.name && (
        <Box>Connected to {account.connector.name}</Box>
      )}
    </Box>
  )
}
