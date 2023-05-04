import { verifyMessage } from 'ethers/lib/utils'
import { useNetwork, useSignMessage } from 'wagmi'
import { Box, Button } from './StyledComponents'
import { useEffect } from 'react'

export const SignMessage = () => {
  const { chain } = useNetwork()
  const { variables, data, error, isLoading, signMessage } = useSignMessage()

  useEffect(() => {
    if (data) {
      alert(`signature ${data}\n\n` +
        `recovered address ${verifyMessage(variables?.message as string,
          data)}`)
    } else if (error)
      alert(error?.message ?? 'Failed to sign message')
  }, [variables?.message, data, error])

  if (!!chain) {
    return (<Box>
      <Button
        disabled={isLoading}
        onClick={() => {
          signMessage({ message: 'Test message' })
        }}>
        {isLoading ? 'Check wallet' : 'Sign message'}
      </Button>
    </Box>)
  }
  return (<></>)
}
