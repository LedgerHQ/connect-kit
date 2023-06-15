import { recoverMessageAddress } from 'viem'
import { useNetwork, useSignMessage } from 'wagmi'
import { Box, Button } from './StyledComponents'
import { useEffect } from 'react'

export const SignMessage = () => {
  const { chain } = useNetwork()
  const {
    data: signature,
    variables,
    error,
    isLoading,
    signMessage
  } = useSignMessage()

  useEffect(() => {
    ;(async () => {
      if (variables?.message && signature) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature,
        })
        alert(`signature ${signature}\n\nrecovered address ${recoveredAddress}`)
      } else if (error) {
        alert(error?.message ?? 'Failed to sign message')
      }
    })()
  }, [signature, variables?.message, error])

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
