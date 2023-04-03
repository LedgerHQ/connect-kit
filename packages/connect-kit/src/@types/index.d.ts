// The WalletConnect packages are currently not browser safe, there is an
// open issue since 2020 here: WalletConnect/walletconnect-monorepo#341
//
// The solution is to consume the pre bundled packages and adding these
// declarations.

// imported on src/providers/WalletConnectEvm.ts
declare module '@walletconnect/universal-provider/dist/index.umd.js' {
  import { Metadata, Namespace, UniversalProvider } from '@walletconnect/universal-provider/dist/index.umd.js';
  export { Metadata, Namespace, UniversalProvider };
};

// imported on src/providers/WalletConnectLegacy.ts
declare module '@walletconnect/legacy-provider/dist/umd/index.min.js' {
  import WalletConnectProvider from '@walletconnect/legacy-provider/dist/umd/index.min.js';
  export default WalletConnectProvider
};
