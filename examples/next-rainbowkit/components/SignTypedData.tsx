import { Address, useNetwork, useSignTypedData } from 'wagmi'
import { Box, Button } from './StyledComponents'
import { useEffect, useState } from 'react'
import { recoverTypedDataAddress } from 'viem'

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as `0x${string}`,
}

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

const message = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
} as const

export const SignTypedData = () => {
  const { chain } = useNetwork()
  domain.chainId = chain?.id || 1

  const { data, error, isLoading, signTypedData } = useSignTypedData({
    domain,
    message,
    primaryType: 'Mail',
    types,
  })
  const [recoveredAddress, setRecoveredAddress] = useState<Address|undefined>()

  useEffect(() => {
    if (!data) return
    ;(async () => {
      setRecoveredAddress(
        await recoverTypedDataAddress({
          domain,
          types,
          message,
          primaryType: 'Mail',
          signature: data,
        }),
      )
    })()
  }, [data])

  useEffect(() => {
    if (recoveredAddress) {
      alert(`signature ${data}\n\nrecovered address ${recoveredAddress}`)
      setRecoveredAddress(undefined)
    } else if (error) {
      alert(error?.message ?? 'Failed to sign message')
    }
  }, [recoveredAddress, data, error])

  if (!!chain) {
    return (<Box>
      <Button disabled={isLoading} onClick={() => signTypedData()}>
        {isLoading ? 'Check wallet' : 'Sign data'}
      </Button>
    </Box>)
  }
  return (<></>)
}
