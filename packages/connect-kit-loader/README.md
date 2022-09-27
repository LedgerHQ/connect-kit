# Ledger Connect Kit

The Ledger Connect Kit can be used to check the level of support for Ledger
Connect on the user's platform. We will guide the user to install Connect or use a fallback connection if you have it available. The code is designed to be loaded at runtime from a CDN so that the logic and UI can be updated as we release new updates to Connect without
the wait for wallet libraries and dapps updating package versions and releasing
new builds.

The `@ledgerhq/connect-kit-loader` allows developers to consume Connect Kit in
a transparent way.


## Support status

Ledger Connect is currently only supported on Safari iOS. There are two edge cases
in the detection logic

- Safari on iPadOS is shown as supported if the user requests the mobile
  website, as it sets the userAgent string to be the same as iOS, otherwise
  the userAgent string is the same as Safari on MacOS, which is not supported;
- Brave on iOS is shown as supported because it sets the userAgest string to
  be the same as Safari on iOS, but Connect will not work.


## Connect Kit loader

To consume Connect Kit you just have to add the `@ledgerhq/connect-kit-loader` package as a dependency and use it as below

```js
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'

// ...
const connectKit = await loadConnectKit()
```

If you are using classes you can get the promise on the class constructor and its value where you need it

```ts
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'

export class LedgerConnector {
  private provider: any
  private connectKit: Promise<LedgerConnectKit>

  constructor() {
    super()

    this.connectKit = loadConnectKit()
  }

  public async connect(): Promise<Connector> {
    if (!this.provider) {
      // load Connect Kit, check support and show a UI modal if not supported
      const connectKit = await this.connectKit
```

See what functions are provided by the Connect Kit API below.


## Connect Kit API

Connect Kit exports two functions

- `checkSupport`, returns an object with properties that allow you to
  know the level of support for Ledger Connect on the user's platform.
  It accepts the folowing options

      type CheckSupportOptions = {
        connectorSupportsUsb?: boolean;
        browserSupportsUsb?: boolean;
      }

  If you're implementing a Ledger connector that has some kind of fallback support you would pass `connectorSupportsUsb: true`, so that if the user's browser does not support Connect but it supports USB, it will fallback to using that and not show the UI modal. If this property is not specified, only Connect support is taken into account when showing the modal.

  For the USB fallback to work the user's browser will also have to support USB, and that depends on how you implement the fallback code. You should have a way to check that the user's platform supports your fallback implementation and pass the `browserSupportsUsb` property with that result. The UI modal will suggest using another browser so that it works.

  The result object has the following form

      type ConnectSupport = type CheckSupportResult = {
        isLedgerConnectSupported: boolean;
        isLedgerConnectEnabled: boolean;
        error?: Error;
      }

  If Connect can not be used on the user's platform one of these modals will be shown

  - Extension Not Available, in case the user's platform supports Connect but
    it is not installed or enabled; a link will be shown to guide the user to install the browser extension;
  - Platform not Supported, in case the user's platform does not support
    Connect nor USB fallback.


## Debugging

You can check that the loader is working by looking at the network tab on the
developer tools. You should see a request for `https://<CDN>/umd/index.js`.
