# Ledger Connect Kit

The Ledger dApps Connect Kit enables developers to connect their dApps to
Ledger hardware wallets using the Ledger Extension or Ledger Live.
We will guide the user to install the Ledger Extension in case it is supported
on the platform they're on, or install Ledger Live if it's not.

The `@ledgerhq/connect-kit-loader` allows dApps to load Connect Kit at runtime
from a CDN so that we can improve the logic and UI without users having to wait
for wallet libraries and dApps updating package versions and releasing new builds.


## Using Connect Kit loader

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
Connect Kit functions to see the debug messages. Just reload the dApp to
disable them.

### `checkSupport`

#### Parameters for WalletConnect v2

```ts
type CheckSupportOptions = {
  providerType: SupportedProviders;
  walletConnectVersion?: number;

  // WalletConnect v2 init parameters
  projectId?: string;              // REQUIRED WC v2 project id
  chains?: number[];               // REQUIRED ethereum chains
  optionalChains?: number[];       // OPTIONAL ethereum chains
  methods?: string[];              // REQUIRED ethereum methods
  optionalMethods?: string[];      // OPTIONAL ethereum methods
  events?: string[];               // REQUIRED ethereum events
  optionalEvents?: string[];       // OPTIONAL ethereum events
  rpcMap?: { [chainId: string]: string; };  // OPTIONAL rpc urls for each chain
}
```

To enable WalletConnect v2 you should update to version 1.1.0 of Connect Kit
Loader.

The simplest use case is to just specify the `providerType`, `walletConnectVersion` and
`projectId` parameters.

- `providerType: SupportedProviders.Ethereum`
- `walletConnectVersion: 2` - use WallertConnect v2, default is 1
- `projectId` - required for WalletConnect v2 projects, create one at
  [WalletConnect Cloud](https://cloud.walletconnect.com/)

You can also specify these parameters

- `chains` - an array of integer chain ids that the wallet must support, the
  connection will be refused if not all ids are supported, defaults to `[1]`
- `rpcMap` - a map of chainIds to URLs
- `optionalChains` - an array of integer chain ids that the wallet might connect to
- `methods` - an array of method names that the wallet must support
- `optionalMethods` - an array of method names that the wallet may support
- `events` - an array of event names that the wallet must support
- `optionalEvents` - an array of method names that the wallet may support

#### Parameters for WalletConnect v1

Note that WalletConnect v1 is deprecated and will stop working on June 28.
Version 1 is still the default in Connect Kit in order to not break existing
apps.

```ts
type CheckSupportOptions = {
  providerType: SupportedProviders;

  // WalletConnect v1 init parameters
  chainId?: ConnectSupportedChains;
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

If the Ledger Extension is installed and enabled it will pop up when the dApp
calls the provider's `eth_requestAccounts`, else the user will be presented one
of two modals.

- "Try the Ledger Extension", in case the user's platform supports the Extension
  but it is not installed or enabled; a button will be shown to let the user
  install the Extension.
- "Connect with Ledger Live", in case the user's platform does not support
  the Extension they will be able to use or install Ledger Live Mobile or Desktop.

### `getProvider`

#### Returns

`Promise<EthereumProvider>`

#### Description

Based on the parameters passed to `checkSupport` it will return an instance of the
Ledger Extension provider or a WalletConnect provider.


## Migration to WalletConnect v2

To migrate from WaletConnect version 1 to version 2:

- Create a project id from the [WalletConnect Cloud](https://cloud.walletconnect.com/),
  it's free
- Update Connect Kit loader to the latest version
- Add `walletConnectVersion: 2` and `projectId: 'id from step 1'` and rename `rpc` to `rpcMap` on your `checkSupport` parameters

Have a look at the example velow and the full list of WalletConnect v2 options above.


## Examples

### Example for WalletConnect v2

An example function using the *Ledger Connect Kit* and *ethers.js*, that would
be called when pressing the connect button on a React app.

`setProvider`, `setAccount`, `setChainId` and `setError` are just
simple `useState` functions to manage the app state.

```ts
// click handler function
const connectWallet = async () => {
  try {
    const connectKit = await loadConnectKit();
    connectKit.enableDebugLogs();
    const checkSupportResult = connectKit.checkSupport({
      providerType: SupportedProviders.Ethereum,
      walletConnectVersion: 2,
      projectId: 'YOUR_PROJECT_ID',
      chains: [1, 137],
      optionalChains: [5],
      rpcMap: {
        '1': 'https://cloudflare-eth.com/',
        '5': 'https://goerli.optimism.io',
        '137': 'https://polygon-rpc.com/',
      },
    });

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

### Example for WalletConnect v1

If you are currently using WalletConnect version 1 you should migrate to version 2 as soon as possible, as the servers for version 1 are going to be shutdown on 28 June.

An example function using the *Ledger Connect Kit* and *ethers.js*, that would
be called when pressing the connect button on a React app.

`setProvider`, `setAccount`, `setChainId` and `setError` are just
simple `useState` functions to manage the app state.

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
      providerType: SupportedProviders.Ethereum,
      walletConnectVersion: 1,
      chainId: 1,
      rpc: {
        1: `https://cloudflare-eth.com`,                 // Mainnet
        5: 'https://goerli.optimism.io',                 // Goerli
        137: "https://matic-mainnet.chainstacklabs.com", // Polygon
      },
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


## Development

If you want to fix a bug or develop a new feature for Connect Kit follow these steps:

- clone the repository

    git clone https://github.com/LedgerHQ/connect-kit

- build the Connect Kit package

    cd packages/connect-kit
    yarn && yarn build

- deploy it somewhere by using a service like vercel or netlify for test builds; e.g.

    netlify deploy -d dist/ --prod

- update the URL on the Connect Kit loader

    // packages/connect-kit-loader/src/index.ts
    const src = "https://DEPLOY_ADDRESS/umd/index.js";

- build and link it locally; e.g.

    yarn build && yarn link

- use the linked loader package on your app

    cd <my_app>
    yarn
    yarn link @ledgerhq/connect-kit-loader

Your app will now use the local version of the Connect Kit loader and you just need to deploy new changes to the same URL and reload the app to test them.
