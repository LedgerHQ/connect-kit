import { useEffect, useState } from 'react';
import { On, Off, Heading, Button, Box, Stack } from './components';
import { ethers } from 'ethers';
import { loadConnectKit, SupportedProviders } from '@ledgerhq/connect-kit-loader';

export const shortenAddress = (address) => {
  if (!address) return "none";

  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );

  return match ? `${match[1]}...${match[2]}` : address;
};

export default function Home() {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [error, setError] = useState("");

  const connectWallet = async (chainId = 1) => {
    console.log('>>> connectWallet');

    resetState();

    try {
      const connectKit = await loadConnectKit();
      connectKit.enableDebugLogs();

      // v1
      // const checkSupportResult = connectKit.checkSupport({
      //   chainId: 137,
      //   providerType: SupportedProviders.Ethereum,
      //   // rpc: {
      //   //   1: 'https://cloudflare-eth.com/', // Mainnet
      //   //   5: 'https://goerli.optimism.io',  // Goerli
      //   //   137: "https://polygon-rpc.com/",  // Polygon
      //   // }
      // });

      // v2
      const checkSupportResult = connectKit.checkSupport({
        providerType: SupportedProviders.Ethereum,
        version: 2,
        projectId: '85a25426af6e359da0d3508466a95a1d',
        // test 1
        // chains: [1],
        // optionalChains: [1],
        // test 2
        // chains: [1],
        // optionalChains: [137],
        // test 3
        // chains: [1],
        // optionalChains: [1, 5, 137],
        // test 4
        // chains: [137],
        // optionalChains: [1, 5, 137],
        // test 5
        // chains: [1, 137],
        // optionalChains: [5],
        // rpcMap: {
        //   '1': 'https://cloudflare-eth.com/',
        //   '5': 'https://goerli.optimism.io',
        //   '137': 'https://polygon-rpc.com/',
        // },
        metadata: {
          name: 'DApps Connect Kit demo',
          description: 'A simple example DApps Connect Kit integration.',
          url: 'string',
          icons: 'string',
        }
      });
      console.log('checkSupportResult is', checkSupportResult);

      const provider = await connectKit.getProvider();
      setProvider(provider);
      const library = new ethers.providers.Web3Provider(provider);
      setLibrary(library);

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts) setAccount(accounts[0]);

      const network = await library.getNetwork();
      setChainId(network.chainId);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const disconnectWallet = async () => {
    console.log('>>> disconnectWallet');

    if (provider.disconnect) {
      provider.disconnect();
    }

    resetState();
  }

  const resetState = async () => {
    console.log('>>> resetState');

    setAccount();
    setChainId();
    setProvider();
    setLibrary();
    setError();
  };

  const assignProviderEvents = () => {
    console.log('>>> assignProviderEvents');

    if (!provider?.on) {
      console.log('>>> no provider.on');
      return;
    }

    const handleMessage = (props) => {
      console.log('> message', props);
    }

    const handleConnect = (props) => {
      console.log('> connected', props);
    }

    const handleDisconnect = (props) => {
      console.log('> disconnected', props);

      // common
      provider.removeListener('message', handleMessage);
      provider.removeListener('connect', handleConnect);
      provider.removeListener('chainChanged', handleChainChanded);
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('display_uri', handleDisplayUri);
      // session event - chainChanged/accountsChanged/custom events
      provider.removeListener('session_event', handleSessionEvent);

      // WC v1
      provider.removeListener('disconnect', handleDisconnect);

      // WC v2
      provider.removeListener('session_delete', handleDisconnect);
      provider.removeListener('session_update', handleSessionEvent);

      resetState();
    }

    const handleDisplayUri = (props) => {
      console.log('> handleDisplayUri');

      console.log('URI is', props);
    }

    const handleChainChanded = (chainId) => {
      console.log('> handleChainChanded', chainId);

      setChainId(chainId);
    }

    const handleAccountsChanged = (accounts) => {
      console.log('> handleAccountsChanged', accounts);

      setAccount(accounts[0]);
    }

    const handleSessionEvent = (props) => {
      console.log('> handleSessionEvent', props);
    }

    provider.on('message', handleMessage);
    provider.on('connect', handleConnect);
    provider.on('disconnect', handleDisconnect);
    provider.on('chainChanged', handleChainChanded);
    provider.on('accountsChanged', handleAccountsChanged);
    // session event - chainChanged/accountsChanged/custom events
    provider.on('session_event', handleSessionEvent);
    provider.on('session_update', handleSessionEvent);
    provider.on('session_delete', handleDisconnect);
    provider.on('display_uri', handleDisplayUri);

    return () => {
      if (provider.removeListener) {
        console.log('> removing handleDisconnect');
        handleDisconnect();
        provider.removeListener('disconnect', handleDisconnect);
      }
    };
  };

  useEffect(assignProviderEvents, [provider]);

  return (
    <>
      <Stack direction="column" justifyContent="center" height="100vh">
        <Heading>Connect with Ledger Connect Kit</Heading>

        <Box>Status: {account
          ? (<On>Connected</On>)
          : (<Off>Not connected</Off>)
        }</Box>

        {account && (
          <>
            <Box>{`Network Id: ${chainId ? chainId : "none"}`}</Box>
            <Box>{`Account: ${shortenAddress(account)}`}</Box>
          </>
        )}

        <Box>{error ? error.message : null}</Box>

        <Box>
          {!account ? (
            <Button bg='primary' onClick={() => connectWallet(1)}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnectWallet}>Disconnect</Button>
          )}
        </Box>
      </Stack>
    </>
  );
}
