# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
