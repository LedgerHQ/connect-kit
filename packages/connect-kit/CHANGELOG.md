# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Don't open a blank tab when pressing the User Ledger Live deeplink.
- Patch the provider's request method to handle the Connect With Ledger Live
  modal in the `eth_requestAccounts` method, allowing us to reject with the
  "user rejected connection" error when the modal is closed.

## 1.0.0 - 2022-11-17
### Changed
- Promoted to 1.0.

## 1.0.0-beta.4-5 - 2022-11-01
### Changed
- Release workflow changes.

## 1.0.0-beta.8 - 2022-11-15
### Changed
- Make disconnect on EthereumProvider optional since it is only available on
  WalletConnect.

## 1.0.0-beta.7 - 2022-11-14
### Changed
- Added disconnect and emit to the EthereumProvider interface to implement
  the lerger wagmi connector.

## 1.0.0-beta.6 - 2022-11-10
### Changed
- The rpc parameter is now optional.
- The chainId parameter is now optional, defaults to 1.
- No defaults are set for WalletConnect parameters.
- Hide the Connect Kit modal on the disconnect event handler.
- Add utm_medium parameter to buy URL.

## 1.0.0-beta.3 - 2022-11-01
### Fixed
- Set some CSS values instead of inheriting them from the app.

## 1.0.0-beta.2 - 2022-10-28
This is the first public version of the package.

### Added
- Show a modal to guide the user.
- Get a Ledger Connect provider on Safari on iOS when connecting to chainId 1.
- Get a WalletConnect provider when on other platforms and chainIds.
