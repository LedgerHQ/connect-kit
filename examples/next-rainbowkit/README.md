## Example with Next.js and RainbowKit

This is an example application using Next.js and RainbowKit to show how to integrate the Ledger button.
Some of the code has been addapted from the wagmi playground example.

You can recreate this project from scratch using these instructions. We're using Next.js and pnpm but you can adapt the instructions to use another package manager and setup.

Create a project and install the dependencies with

    $ pnpm create @rainbow-me/rainbowkit@latest ledger-next-rainbowkit
    $ pnpm install

Run the project with

    $ pnpm dev

This is a working RainbowKit app which can already connect to a wallet using the default connectors. We are adding or changing the following files to add the Ledger button and some extra functionalities

- `pages/_app.tsx`, add the RainbowKit Ledger connector
- `pages/index.tsx`, reference the components we want to show
- `hooks/useIsMounted.ts`, used to know when a component that uses it has been mounted
- `components/StyledComponents.ts`, some UI components
- `components/Account.tsx`, shows connection information
- `components/SignMessage.tsx`, allows signing a predefined message
- `components/SignTypedData.tsx`, allows signing a predefined set of data

(note that below, the imports are split to make sense for each block of code but they can be merged into fewer lines)

### Setting up RainbowKit

Most of this is already taken care of by the scafolding process. The file `pages/_app.tsx` has the chain configuration

```ts
import { configureChains } from 'wagmi'
import { mainnet, goerli, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon],
  [publicProvider()],
)
```

The same file also has sets the RainbowKit connectors and the wagmi client up, we just need to make sure the Ledger connector is there.

```ts
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  ledgerWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createClient } from 'wagmi'

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      ledgerWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})
```

Notice the `autoConnect` property; when set to true wagmi will automatically try to reconnect to an existing session when the dApp is reloaded, without you having to press the "Connect" button.

Still on the same file, the main component is wrapped by `WagmiConfig` and `RainbowKitProvider`

```tsx
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
```

### Connection information

The file `src/components/Account.tsx` shows the wagmi connector when connected and uses the `useAccount` wagmi hook

```ts
  const isMounted = useIsMounted()
  const account = useAccount()
  // ...
  // TSX
    {isMounted && account?.connector?.name && (
      <Box>Connected to {account.connector.name}</Box>
    )}
```

### Signing messages

The file `src/components/SignMessage.tsx` uses the `useSignMessage` hook to allow signing a message by calling `signMessage({ message })`; the other properties are used to access the operation status and response.

```ts
  const { variables, data, error, isLoading, signMessage } = useSignMessage()
  // ...
  // TSX
    <Button
      disabled={isLoading}
      onClick={() => signMessage({ message: 'Test message' })}
    >...
```

The file `src/components/SignMessage.tsx` is similar and uses the `useSignTypedData` hook to allow signing a predefined set of data, composed by `domain`, `types` and `value`.

```ts
  const { data, error, isLoading, signTypedData } = useSignTypedData({
    domain,
    types,
    value,
  })
  // ...
  // TSX
    <Button disabled={isLoading} onClick={() => signTypedData()}>...
```

### Wrapping up

Finally add all the components in `pages/index.tsx`

```tsx
  return (
    <>
        <ConnectButton />
        <Account />
        <SignMessage />
        <SignTypedData />
    </>
  )
```

The `ConnectButton` component shows the button to connect to a wallet and also the UI components to change chain, copy the current address and disconnect, replacing other components we would have to implement manually if using wagmi alone.

Test it again with

```sh
$ pnpm dev
```

If you now open the app in your browser (usually in http://localhost:3000/) you should now see a "Ledger" button and be able to interact with your Ledger wallet using the Ledger Extension or Ledger Live.

For more information see

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.
