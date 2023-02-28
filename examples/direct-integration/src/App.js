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
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    resetState();

    try {
      const connectKit = await loadConnectKit();
      connectKit.enableDebugLogs();
      const checkSupportResult = connectKit.checkSupport({
        chainId: 1,
        providerType: SupportedProviders.Ethereum,
        rpc: {
          1: `https://cloudflare-eth.com/`, // Mainnet
          5: 'https://goerli.optimism.io',  // Goerli
          137: "https://polygon-rpc.com/",  // Polygon
        }
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
      setMessage(error);
    }
  };

  const disconnectWallet = async () => {
    if (provider.disconnect) {
      provider.disconnect();
    }

    // needs to be called here
    // the Ledger Extension does not fire a disconnect event
    resetState();
  }

  const resetState = async () => {
    setAccount();
    setChainId();
    setProvider();
    setLibrary();
    setMessage();
  };

  useEffect(() => {
    if (provider?.on) {
      const handleDisconnect = (props) => {
        console.log('> handleDisconnect', props);

        // needs to be called here to handle disconnect from Ledger Live
        resetState();
      };

      const handleChainChanded = async (chainId) => {
        console.log('> handleChainChanded', chainId);
        setChainId(chainId);
      }

      const handleAccountsChanged = async (accounts) => {
        console.log('> handleAccountsChanged', accounts);
        setAccount(accounts[0]);
      }

      provider.on('chainChanged', handleChainChanded);
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('chainChanged', handleChainChanded);
          provider.removeListener('accountsChanged', handleAccountsChanged);
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

        <Box>{message ? message.message : null}</Box>

        <Box>
          {!account ? (
            <Button bg='primary' onClick={connectWallet}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnectWallet}>Disconnect</Button>
          )}
        </Box>
      </Stack>
    </>
  );
}
