# Ledger Connect Kit

This package allows you to check the level of support for Ledger Connect on
the user's platform (OS and browser combination), to guide the user to
install Connect or fallback to a USB transport if supported.


## Support status

Ledger Connect is currently only supported on Safari iOS. There are two edge cases
in the detection logic

- Safari on iPadOS is shown as supported if the user requests the mobile
  website, as it sets the userAgent string to be the same as iOS, otherwise
  the userAgent string is the same as Safari on MacOS, which is not supported;
- Brave on iOS is shown as supported because it sets the userAgest string to
  be the same as Safari on iOS, but Connect will not work.


## Connect Kit loader

The Connect Kit is designed to be loaded at runtime from a CDN so that we
can update the UI and logic as we release new updates without the wait for
wallet libraries and dapps updating package versions and releasing new
builds.

The @ledgerhq/connect-kit-loader package provides a function that allows
developers to consume Connect Kit in a transparent way.

You just have to add the loader package as a dependency and use it as below

```js
import { loadConnectKit } from '@ledgerhq/connect-kit-loader'

// ...
const { checkConnectSupport, showModal } = await loadConnectKit()
```


## Connect Kit API

Connect Kit exports two functions

- `checkConnectSupport`, returns an object with properties that allow you to
  know the level of support for Connect and the current status.
  The object has the following form

        type ConnectSupport = {
          isConnectSupported: boolean,
          isProviderDefined: boolean,
          isLedgerConnectExtensionLoaded: boolean,
          isWebUSBSupported: boolean,
          isU2FSupported: boolean,
          connectorSupportsUsb: boolean
        }

- `showModal(connectSupport)`, shows the appropriate modal for the current
  level of support on the user's platform. The value for the
  `connectorSupportsUsb` property must be passed to `showModal` deppending
  on wether the Ledger connector being implemented supports fallback to USB.

  Shows one of two modals to the user

  - Extension Not Available, in case the user's platform supports Connect but
    it is not installed or enabled.

  - Platform not Supported, in case the user's platform does not support
    Connect or USB fallback. If the value for `connectorSupportsUsb` is not
    passed to the function, only Connect support is taken into account to sho
    w the modal.


## Debugging

You can check that the loader is working by looking at the network tab on the
developer tools. You should see a request for `https://<CDN>/umd/index.js` each
time the Ledger button is pressed to initiate the connection to the wallet.

