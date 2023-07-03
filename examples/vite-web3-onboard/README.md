## Example with Vite and web3-onboard

This is an example application using vite and web3-onboard to show how to integrate the Ledger button.

You can recreate this project from scratch using these instructions. We're using Vite and pnpm but you can adapt the instructions to use another package manager and setup.

Create a project and install the dependencies with

    $ pnpm create vite --template react-ts vite-ledger-web3-onboard
    $ cd vite-ledger-web3-onboard
    $ pnpm install

Run the project with

    $ pnpm dev

This is just the standard Vite web project with no web3 functionalities. We are adding and changing the following four files to use web3-onboard

- `src/StyledComponents.ts`, we create this one with some UI components
- `src/web3-onboard.ts`, we create this one with the web3-onboard set up
- `src/main.tsx`, we wrap the main app with the web3-onboard provider and add global styles
- `src/App.tsx`, we add some buttons and functions to this one

Add the web3-onboard react and Ledger connector packages with

    $ pnpm add @web3-onboard/react @web3-onboard/ledger

You now just need to setup web3-onboard like shown below, check the file `src/web3-onboard.ts` for the full details

```ts
import ledgerModule from '@web3-onboard/ledger'
import { init } from '@web3-onboard/react'

const ledger = ledgerModule({
  chainId: 1,
})

export default init({
  wallets: [ ledger ],      // the wallet connectors you want to make available to users
  chains: [ /*...*/ ],      // the chains your dApp will be able to connect to
  connect: { /*...*/ },     // web3-onboard connect options like autoconnect
  appMetadata: { /*...*/ }, // information about your app like name, icon and links
})
```

Add the `GlobalStyle` and `Web3OnboardProvider` in `src/main.tsx`

```ts
  <GlobalStyle/>
  <Web3OnboardProvider web3Onboard={web3Onboard}>
    <App />
  </Web3OnboardProvider>
```

Then import the web3-onboard hooks into your code, done on the file `src/App.tsx`

```ts
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
```

And use them in your App function. We use the `useConnectWallet` and `useSetChain` hooks from web3-onboard to get the functions and properties that we need to connect, disconnect and display on the dApp.

```ts
function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ connectedChain }, setChain] = useSetChain()
  // ...
```

With those we have access to

- connect to a wallet with `connect()`
- if we are currently in the process of connecting with `connecting`
- if we are already connected to an account with `wallet?.accounts.length`
- the current wallet address with `wallet.accounts[0].address`
- disconnect from a specific wallet with `disconnect({label})`
- the wallet label to disconnect from in `wallet.label`
- the current chain id with `connectedChain?.id`

To show the connect and disconnect buttons you can use something like the following

```ts
{!wallet?.accounts.length ? (
  <Button onClick={() => connect()} disabled={connecting}>
    Connect Wallet
  </Button>
) : (
  <Button onClick={() => disconnect({ label: wallet.label })}>
    Disconnect
  </Button>
  // ,,,
)}
```

We can add personal signing of a message with this function

```ts
const personalSign = useCallback(async () => {
  const from = wallet?.accounts[0].address
  const exampleMessage = 'Example `personal_sign` message'
  const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`

  try {
    const signedMessage = await wallet?.provider.request({
      method: 'personal_sign',
      params: [msg, from, 'no password'],
    })
    alert(`Signed message is: ${signedMessage}`)
  } catch (error) {
    console.error(error)
  }
}, [wallet])
```

that is then called when clicking a button

```ts
  <Button onClick={personalSign}>Personal sign</Button>
```

Test it again with

    $ pnpm dev

You should now see a "Connect wallet" button and be able to interact with your Ledger wallet using the Ledger Extension or Ledger Live.
