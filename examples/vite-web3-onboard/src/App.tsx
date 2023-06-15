import { useCallback } from 'react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { Buffer } from 'buffer';
import { On,
  Off,
  Heading,
  Button,
  Box,
  Stack,
  SubHeading,
} from './StyledComponents';
import './App.css'

export const shortenAddress = (address: string) => {
  if (!address) return "none"

  const match = address.match(
    /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/
  );

  return match ? `${match[1]}...${match[2]}` : address
};

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ connectedChain }, setChain] = useSetChain()

  const isRequestedChainId = (requestedChainId: string) => {
    return connectedChain?.id === requestedChainId
  }

  const personalSign = useCallback(async () => {
    console.log('> personalSign')

    const from = wallet?.accounts[0].address
    const exampleMessage = 'Example `personal_sign` message'
    const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`
    console.log('signing data is', {from, exampleMessage, msg})

    try {
      const signedMessage = await wallet?.provider.request({
        method: 'personal_sign',
        params: [msg, from, 'no password'],
      })
      console.log(`Signed message is: ${signedMessage}`)
      alert(`Signed message is: ${signedMessage}`)
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    }
  }, [wallet])

  const signTypedData = useCallback(async () => {
    console.log('> signTypedData')

    const messageData = {
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1,
        // Give a user-friendly name to the specific contract you're signing for.
        name: 'Ether Mail',
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // This identifies the latest version.
        version: '1',
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: 'Mail',
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to primaryType.
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    }
    // eth_signTypedData_v4 parameters. All of these parameters affect the resulting signature.
    const from = wallet?.accounts[0].address
    const msgParams = JSON.stringify(messageData)

    try {
      const signedMessage = await wallet?.provider.request({
        method: 'eth_signTypedData_v4',
        params: [from, msgParams],
      })
      console.log(`Signed message is: ${signedMessage}`)
      alert(`Signed message is: ${signedMessage}`)
    } catch (error) {
      console.error(error)
      alert((error as Error).message)
    }
  }, [wallet])

  return (
    <Stack className="App" direction="column" justifyContent="center" height="100vh">
      <Heading>Connect with Ledger DApp Connect Kit</Heading>
      <SubHeading>Using vite + web3-onboard</SubHeading>

      <Box>Status: {wallet?.accounts.length
        ? (<On>Connected</On>)
        : (<Off>Not connected</Off>)
      }</Box>

      {wallet?.accounts.length && (
        <>
          <Box>{`Chain Id: ${connectedChain?.id ?? "none"}`}</Box>
          <Box>{`Account: ${shortenAddress(wallet.accounts[0].address)}`}</Box>
        </>
      )}

      {!wallet?.accounts.length ? (
        <Box>
          <Button onClick={() => connect()} disabled={connecting}>
            Connect Wallet
          </Button>
        </Box>
      ) : (
        <>
          <Box>
            <Button onClick={() => disconnect({ label: wallet.label })}>Disconnect</Button>
          </Box>

          <Box>
            <Button onClick={personalSign}>Personal sign</Button>
          </Box>
          <Box>
            <Button onClick={signTypedData}>Sign typed data</Button>
          </Box>

          <Box>
            <Button disabled={isRequestedChainId('0x89')} onClick={() => setChain({chainId:'0x89'})}>Switch to Polygon</Button>
          </Box>
          <Box>
            <Button disabled={isRequestedChainId('0x5')} onClick={() => setChain({chainId:'0x5'})}>Switch to Göerli</Button>
          </Box>
          <Box>
            <Button disabled={isRequestedChainId('0x1')} onClick={() => setChain({chainId:'0x1'})}>Switch to Mainnet</Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default App
