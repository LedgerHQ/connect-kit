# Ledger Connect Kit

The Ledger DApps Connect Kit enables developers to connect their DApps to
Ledger hardware wallets using the Ledger Extension or Ledger Live.
We will guide the user to install the Ledger Extension in case it is supported
on the platform they're on, or install Ledger Live if it's not.

The `@ledgerhq/connect-kit-loader` allows DApps to load Connect Kit at runtime
from a CDN so that we can improve the logic and UI without users having to wait
for wallet libraries and DApps updating package versions and releasing new builds.


## Connect Kit loader

To use Connect Kit you just have to add the `@ledgerhq/connect-kit-loader`
package as a dependency using your preferred package manager, using yarn as an
example

```sh
yarn add @ledgerhq/connect-kit-loader
```

and use it as below

```js
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'

const connectKit = await loadConnectKit()
```

If you are using classes you can get the promise on the class constructor and
its value where you need it

```ts
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'

export class LedgerConnector {
  private provider: any
  private connectKitPromise: Promise<LedgerConnectKit>

  constructor() {
    super()

    this.connectKitPromise = loadConnectKit()
  }

  public async connect(): Promise<Connector> {
    if (!this.provider) {
      const connectKit = await this.connectKitPromise
```

You can check that Connect Kit is loaded by looking at the network tab on the
developer tools. You should see a request for `https://<CDN>/umd/index.js`.

See what functions are provided by the Connect Kit API below.


## Connect Kit API

Connect Kit exports three functions, `enableDebugLogs`, `checkSupport` and
`getProvider`.

### `enableDebugLogs`

#### Description

Enables debug messages on the browser console in case you need to diagnose a
possible problem.

Once Connect Kit is loaded you can call it from the browser's developer tools
console with `window.ledgerConnectKit.enableDebugLogs()` and call the other
Connect Kit functions to see the debug messages. Just reload the dapp to
disable them.

### `checkSupport`

#### Parameters

```ts
type CheckSupportOptions = {
  providerType: SupportedProviders;
  chainId: ConnectSupportedChains;
  bridge?: string;
  infuraId?: string;
  rpc: { [chainId: number]: string; };
}
```

#### Returns

```ts
type ConnectSupport = type CheckSupportResult = {
  isLedgerConnectSupported?: boolean;
  isLedgerConnectEnabled?: boolean;
  isChainIdSupported?: boolean;
  providerImplementation: 'LedgerConnect' | 'WalletConnect';
}
```

#### Description

This call initializes Connect Kit and lets you know if the user's platform
supports the Ledger Extension.

Based on the parameters that you pass and on the user's platform, Connect Kit
will decide what provider will be returned when you call `getProvider`.

If the Ledger Extension is installed and enabled it will pop up when the DApp
calls the provider's `eth_requestAccounts`, else the user will be presented one
of two modals.

- "Try the Ledger Extension", in case the user's platform supports the Extension
  but it is not installed or enabled; a button will be shown to let the user
  install the Extension.
- "Do you have Ledger Live?", in case the user's platform does not support
  the Extension they will be able to use Ledger Live Mobile or Desktop.

### `getProvider`

#### Returns

`Promise<EthereumProvider | SolanaProvider>`

#### Description

Based on the options passed to `checkSupport` it will return an instance of the
Ledger Extension provider or a WalletConnect provider.

### Example

An example function using the *Ledger Connect Kit* and *ethers.js*, that would
be called when pressing the connect button on a React app.

`setProvider`, `setAccount`, `setChainId` and `setError` are just
simple `useState` functions to keep app state.

```js
// JSX code
<Button onClick={() => connectWallet()}>Connect With Ledger</Button>
```

```js
// click handler function
const connectWallet = async () => {
  try {
    const connectKit = await loadConnectKit();
    connectKit.enableDebugLogs();
    const checkSupportResult = connectKit.checkSupport({
      chainId: 1,
      providerType: SupportedProviders.Ethereum,
      rpc: {
        1: `https://cloudflare-eth.com`, // Mainnet
        137: "https://matic-mainnet.chainstacklabs.com", // Polygon
      }
    });
    console.log('checkSupportResult is', checkSupportResult);

    const provider = await connectKit.getProvider();
    setProvider(provider);

    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (accounts) setAccount(accounts[0]);

    const library = new ethers.providers.Web3Provider(provider);
    const network = await library.getNetwork();
    setChainId(network.chainId);
  } catch (error) {
    setError(error);
  }
}
```
