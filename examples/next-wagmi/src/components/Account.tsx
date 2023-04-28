import { useAccount, useBalance, useDisconnect } from 'wagmi'

import { useIsMounted } from '../hooks'
import { Box, Button } from './StyledComponents'

export const Account = () => {
  const isMounted = useIsMounted()
  const account = useAccount({
    onConnect: (data) => console.log('connected', data),
    onDisconnect: () => console.log('disconnected'),
  })
  const { data } = useBalance({
    address: account?.address,
    watch: true,
  })
  const disconnect = useDisconnect()

  const shortenAddress = (address: string) => {
    if (!address) return "none";

    const match = address.match(
      /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/
    );

    return match ? `${match[1]}...${match[2]}` : address;
  };

  return (
    <Box>
      {isMounted && account?.connector?.name && (
        <Box>Connected to {account.connector.name}</Box>
      )}
      {account?.address && (
        <>
          <Box>Address is {shortenAddress(account?.address)}</Box>
          <Box>Balance is {parseFloat(data?.formatted || '0.0').toFixed(5)}</Box>
          <Box>
            <Button onClick={() => disconnect.disconnect()}>Disconnect</Button>
          </Box>
        </>
      )}
    </Box>
  )
}
