import { verifyTypedData } from 'ethers/lib/utils'
import { useNetwork, useSignTypedData } from 'wagmi'
import { Box, Button } from './StyledComponents'
import { useEffect } from 'react'

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

const value = {
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
    types,
    value,
  })

  useEffect(() => {
    if (data) {
      alert(`signature ${data}\n\n` +
        `recovered address ${verifyTypedData(domain, types, value, data)}`)
    } else if (error) {
      alert(error?.message ?? 'Failed to sign message')
    }
  }, [data, error])

  if (!!chain) {
    return (<Box>
      <Button disabled={isLoading} onClick={() => signTypedData()}>
        {isLoading ? 'Check wallet' : 'Sign data'}
      </Button>
    </Box>)
  }
  return (<></>)
}
