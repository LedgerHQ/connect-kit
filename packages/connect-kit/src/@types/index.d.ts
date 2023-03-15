// The WalletConnect packages are currently  not browser safe, there is an
// open issue since 2020 here: WalletConnect/walletconnect-monorepo#341
//
// The solution is to consume the pre bundled packages and adding these
// declarations. See imports on src/providers/WalletConnectEvm.ts and
// src/providers/WalletConnectLegacy.ts.

declare module '@walletconnect/ethereum-provider/dist/index.umd.js' {
  import WalletConnectProvider from '@walletconnect/ethereum-provider/dist/index.umd.js';
  export default WalletConnectProvider
};

declare module '@walletconnect/legacy-provider/dist/umd/index.min.js' {
  import WalletConnectProvider from '@walletconnect/legacy-provider/dist/umd/index.min.js';
  export default WalletConnectProvider
};
