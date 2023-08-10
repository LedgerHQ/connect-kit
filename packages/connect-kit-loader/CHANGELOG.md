# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.1.2 - 2023-08-10
Add side effects at false

## 1.1.1 - 2023-08-01
Nothing changed from the last version

## 1.1.1-beta.1 - 2023-08-01
### Changed
- Fix Connect Kit script's src URL.

## 1.1.1-beta.0 - 2023-08-01
### Changed
- Expose chainId in the EthereumProvider type.
- Remove unfinished Solana support.

## 1.1.0 - 2023-06-22
Connect Kit now supports WalletConnect v2.

To migrate to WaletConnect version 2 you will need to create a project id on the
[WalletConnect Cloud](https://cloud.walletconnect.com/) (it's free), update
Connect Kit loader to version 1.1.0 and add `walletConnectVersion: 2`,
`projectId: 'id from step 1'` and rename `rpc` to `rpcMap` on your
`checkSupport` parameters.

Have a look at the documentation for more details.

After 28 June you will need to specify a custom bridge server to
keep using WalletConnect v1, passing `walletConnectVersion: 1` and
`bridge: 'https://wc.custom.bridge.com'`.

## 1.1.0-beta.2 - 2023-06-21
### Changed
- Rename the version parameter to walletConnectVersion

## 1.1.0-beta.1 - 2023-06-19
### Added
- Support for WalletConnect v2.

## 1.0.2 - 2022-12-21
### Changed
- Expose WalletConnect's connector property as optional in the
  EthereumProvider type for integration into web3-onboard.

## 1.0.1 - 2022-12-14
### Changed
- Add `"type":"module"` to `package.json`.

## 1.0.0 - 2022-11-17
### Changed
- Release workflow changes.
- Use version 1 on Connect Kit URL.

## 1.0.0-beta.8 - 2022-11-17
### Changed
- Make sure loadConnectKit is running on client side.

### Fixed
- CheckSupportOptions props.

## 1.0.0-beta.7 - 2022-11-15
### Changed
- Make disconnect on EthereumProvider optional since it is only available on
  WalletConnect.

## 1.0.0-beta.6 - 2022-11-14
### Changed
- Added disconnect and emit to the EthereumProvider interface to implement
  the lerger wagmi connector.

## 1.0.0-beta.5 - 2022-11-10
### Changed
- The rpc parameter is now optional.
- The chainId parameter is now optional, defaults to 1.

## 1.0.0-beta.4 - 2022-11-01
### Changed
- Release workflow changes.

## 1.0.0-beta.3 - 2022-11-01
### Fixed
- Declared @rollup/plugin-alias as a dev dependency.

## 1.0.0-beta.2 - 2022-10-28
This is the first public version of the package.

### Added
- Load the Connect Kit script from a CDN.
