import { useEffect, useState } from 'react';
import { On, Off, Heading, Button, Box, Text, Stack } from './components';
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
    console.log('connectWallet');

    try {
      console.log('loading Connect Kit');
      const connectKit = await loadConnectKit();
      console.log('Connect Kit loaded');

      connectKit.enableDebugLogs();

      // v1
      // const checkSupportResult = connectKit.checkSupport({
      //   chainId,
      //   providerType: SupportedProviders.Ethereum,
      //   rpc: {
      //     1: `https://cloudflare-eth.com/`, // Mainnet
      //     5: 'https://goerli.optimism.io',  // Goerli
      //     137: "https://polygon-rpc.com/",  // Polygon
      //   }
      // });

      // v2
      const checkSupportResult = connectKit.checkSupport({
        providerType: SupportedProviders.Ethereum,
        projectId: '85a25426af6e359da0d3508466a95a1d',
        chains: [
          { id: 1, rpcUrls: { default: { http: [ 'https://cloudflare-eth.com/' ]}}},
          { id: 5, rpcUrls: { default: { http: [ 'https://goerli.optimism.io' ]}}},
          { id: 137, rpcUrls: { default: { http: [ 'https://polygon-rpc.com/' ]}}},
        ]
      });
      console.log('checkSupportResult is', checkSupportResult);

      const provider = await connectKit.getProvider();
      setProvider(provider);

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts) setAccount(accounts[0]);

      const library = new ethers.providers.Web3Provider(provider);
      setLibrary(library);

      const network = await library.getNetwork();
      setChainId(network.chainId);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const disconnect = async () => {
    setAccount();
    setChainId();
    setProvider();
    setLibrary();
  };

  useEffect(() => {
    if (provider?.on) {
      const handleDisconnect = (error) => {
        disconnect();
      };

      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

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
            <Button onClick={disconnect}>Disconnect</Button>
          )}
        </Box>
      </Stack>
    </>
  );
}
