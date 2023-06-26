## Example with Next.js and wagmi

This is an example application using Next.js and wagmi to show how to integrate the Ledger button.
Most of the code has been addapted from the wagmi playground example.

You can recreate this project from scratch using these instructions. We're using Next.js and pnpm but you can adapt the instructions to use another package manager and setup.

Create a project and install the dependencies with

    $ pnpm create next-app ledger-next-wagmi
    $ cd ledger-next-wagmi
    $ pnpm install

Run the project with

    $ pnpm dev

This is just the standard Next.js web project with no web3 functionalities. We are adding or changing the following files to use wagmi

- `src/pages/_app.tsx`, setup wagmi
- `src/pages/index.tsx`, reference the components we want to show
- `src/hooks/useIsMounted.ts`, used to know when a component that uses it has been mounted
- `src/components/StyledComponents.ts`, some UI components
- `src/components/Account.tsx`, shows account information and the disconnect button after connection
- `src/components/Connect.tsx`, shows connect buttons for each connector
- `src/components/NetworkSwitcher.tsx`, shows a list of chains and lets the user switch between them
- `src/components/SignMessage.tsx`, allows signing a predefined message
- `src/components/SignTypedData.tsx`, allows signing a predefined set of data

Add the wagmi and wagmi connectors packages with

    $ pnpm add wagmi @wagmi/connectors

(note that below, the imports are split to make sense for each block of code but they can be merged into fewer lines)

### Setting up wagmi

Update `src/pages/_app.tsx` with the chain configuration

```ts
import { configureChains } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()],
)
```

On the same file create a wagmi client with the connector instances

```ts
import { createClient } from 'wagmi'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const wagmiConfig = createClient({
  autoConnect: true,
  connectors: [
    new LedgerConnector({
      chains,
      options: {
        enableDebugLogs: true,
        chainId: 1,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
```

Notice the `autoConnect` property; when set to true wagmi will automatically try to reconnect to an existing session when the dApp is reloaded, without you having to press the "Connect" button.

Still on the same file, wrap the main component in `WagmiConfig`

```tsx
import { WagmiConfig } from 'wagmi'

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
}
```

### Connecting

The file `src/components/Connect.tsx` renders a connect button for each configured connector and an error message if it can't connect, and uses the `useAccount` and `useConnect` wagmi hooks. This is a simplified version of the code

```ts
  const { connector } = useAccount()
  const { connect, connectors } = useConnect()
  // ...
  // TSX
    {connectors.map((x) => (
      <Button
        onClick={() => connect({ connector: x })}>...

    {isError &&
      <Box>{error && error.message}</Box>
    }
```

The file `src/components/Account.tsx` shows the account information when connected and uses the `useAccount`, `useBalance` and `useDisconnect` wagmi hooks

```ts
  const isMounted = useIsMounted()
  const account = useAccount()
  const { data } = useBalance({
    address: account?.address,
    watch: true,
  })
  const disconnect = useDisconnect()
  // ...
  // TSX
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
```

### Switching chains

The file `src/components/NetworkSwitcher.tsx` shows a button for each configured chain to allow the user to switch to it using the `useNetwork` and `useSwitchNetwork` wagmi hooks

```ts
  const { chain } = useNetwork()
  const { chains, isError, error, pendingChainId, switchNetwork, status } =
    useSwitchNetwork()
  // ...
  // TSX
    {chain && chains.map((x) => (
      <Button
        disabled={!switchNetwork || x.id === chain?.id}
        onClick={() => switchNetwork?.(x.id)}>...
```

### Signing messages

The file `src/components/SignMessage.tsx` uses the `useSignMessage` hook to allow signing a message by calling `signMessage({ message })`; the other properties are used to access the operation status and response.

```ts
  const { data: signature, variables, error, isLoading, signMessage } = useSignMessage()
  // ...
  // TSX
    <Button
      disabled={isLoading}
      onClick={() => signMessage({ message: 'Test message' })}
    >...
```

The file `src/components/SignTypedData.tsx` is similar and uses the `useSignTypedData` hook to allow signing a predefined set of data, composed by `domain`, `types` and `value`.

```ts
  const { data, error, isLoading, signTypedData } = useSignTypedData({
    domain,
    types,
    primaryType: 'Mail',
    value,
  })
  // ...
  // TSX
    <Button disabled={isLoading} onClick={() => signTypedData()}>...
```

### Wrapping up

Finally add all the components in `src/pages/index.tsx`

```tsx
  return (
    <>
      <Connect />
      <Account />
      <SignMessage />
      <SignTypedData />
      <NetworkSwitcher />
    </>
  )
```

Test it again with

```sh
$ pnpm dev
```

If you now open the app in your browser (usually in http://localhost:3000/) you should now see a "Ledger" button and be able to interact with your Ledger wallet using Ledger Live.

For more information see

- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.
