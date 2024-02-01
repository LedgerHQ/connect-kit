# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.1.12 - 2024-02-01
Export SupportedProviderImplementations

## 1.1.11 - 2024-01-31
Remove analytics

## 1.1.10 - 2024-01-24
Fix connect-kit dependencies
Update connect-kit README

## 1.1.9 - 2024-01-18
Export SupportedProviders and EthereumProvider
Bumps node version (16->20) in connect-kit release workflow

## 1.1.8 - 2023-12-14
New version fix

## 1.1.4 - 2023-08-17
Add configuration to segment to use custom proxy

## 1.1.3 - 2023-08-10
Change default methods

## 1.1.2 - 2023-08-04
Fix merged optional variable event

## 1.1.1 - 2023-08-01
Nothing changed from the last version

## 1.1.1-beta.0 - 2023-08-01
### Changed
- Use WalletConnect's default list of optional methods and events.
- Add analytics support so that we can better understand usage.
- Handle display_uri event only once when calling eth_requestAccounts.
- Update WalletConnect package versions.
- Switch to the correct chain when connecting with the Extension.
- Expose provider.chainId.
- Remove unfinished Solana support.

## 1.1.0 - 2023-06-22
Connect Kit now supports WalletConnect v2.

Have a look at the Connect Kit loader documentation for
more details.

## 1.1.0-beta.3 - 2023-06-21
### Changed
- Rename the version parameter to walletConnectVersion.
- Internal improvements.

## 1.1.0-beta.1 - 2023-06-19
### Added
- Support for WalletConnect v2.

## 1.0.16 - 2023-04-04
### Changed
- Add campaign params to App Store link.

## 1.0.15 - 2023-03-16
### Changed
- Use App Store link in the Extension install button.

## 1.0.13 - 2023-03-13

## 1.0.12 - 2023-03-13
### Changed
- Remove the "Need a Ledger?" section from the modals.
- Replace Connect with Ledger Extension.
- Center the modal.

## 1.0.11 - 2023-02-24
### Changed
- Enable Connect support for Polygon (chainId 137).

## 1.0.10 - 2023-01-04
### Changed
- Fix image positioning in the "Need a Ledger?" modal section.

## 1.0.9 - 2022-12-30
### Changed
- Enable Connect support on macOS.

## 1.0.8 - 2022-12-21
### Changed
- Expose WalletConnect's connector property as optional in the
  EthereumProvider type for integration into web3-onboard.

## 1.0.7 - 2022-12-13
### Changed
- Close the ConnectWithLedgerLive modal when clicking outside.
- Make the cursor a pointer for the "Install" link on the
  ConnectWithLedgerLive modal.
- Fix spacing around the "or" line on the ConnectWithLedgerLive modal

## 1.0.6 - 2022-12-13
### Changed
- Redesign the ConnectWithLedgerLive to be visually simpler.
- Add back a call to hide the ConnectWithLedgerLive modal to the
  WalletConnect connect event handler since it is still needed when scanning
  the QR code.

## 1.0.5 - 2022-12-12
### Changed
- Return a valid provider in case the Connect extension is supported but not
  enabled, instead of throwing an exception. The modal that guides the user to
  install the extension was being shown on the `getProvider` function, but has
  been moved to the `eth_requestAccounts` request on the new provider to
  correctly work with autoconnect on wagmi.

## 1.0.4 - 2022-12-06
### Changed
- Create a new WalletConnect session each time `eth_requestAccounts` is called
  (and hence each time the "Use Ledger Live" modal is shown) to avoid reusing
  the same WalletConnect URI.
- The "Use Ledger Live" modal is now closed when pressing the "Use Ledger
  Live" button to avoid the same WalletConnect URI being reused (e.g. if the
  user clicks "Decline" in Ledger Live and clicks "Use Ledger Live" again.
- No longer reuse the provider instance in the Provider module as it
  interferes with refreshing the WalletConnect URI.
- No longer reuse the provider instance in the WalletConnect module.

## 1.0.3 - 2022-12-06

## 1.0.2 - 2022-12-02
### Changed
- Use the ledgerlive: deeplink for the QR code instead of the WalletConnect
  URI; this allows scanning the QR code with the native camera app.

## 1.0.1 - 2022-12-02
### Changed
- Don't open a blank tab when pressing the User Ledger Live deeplink.
- Correctly detect the Brave browser on iOS.
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
