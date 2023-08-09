import { useCallback, useEffect, useState } from 'react';
import { default as WalletConnectProvider } from '@walletconnect/ethereum-provider';
import { loadConnectKit, SupportedProviders } from '@ledgerhq/connect-kit-loader';
import { Buffer } from 'buffer';
import { On, Off, Heading, Button, Box, Stack, Message } from './components';

const testProjectId = '85a25426af6e359da0d3508466a95a1d';

const useBalance = (
  provider,
  account,
  chainId
) => {
  const [balance, setBalance] = useState(0)
  let stale = false

  useEffect(() => {
    (async () => {
      if (!provider || !account || !chainId || stale) return;

      try {
        const hexBalance = await provider.request({
          method: 'eth_getBalance', params: [account, 'latest']
        });
        if (hexBalance) setBalance(hexBalance);
      } catch (error) {
        console.error(error)
      }
    })()

    return () => {
      stale = true
      setBalance(0)
    }
  }, [provider, account, chainId])

  return balance
}

export const shortenAddress = (address) => {
  if (!address) return "none";

  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );

  return match ? `${match[1]}...${match[2]}` : address;
};

export default function Home() {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [message, setMessage] = useState('');
  const balance = useBalance(provider, account, chainId);

  // click handlers

  const connectWithLedger = async () => {
    console.log('> connectWithLedger');

    resetState();

    try {
      const connectKit = await loadConnectKit();
      connectKit.enableDebugLogs();
      const checkSupportResult = connectKit.checkSupport({
        providerType: SupportedProviders.Ethereum,
        walletConnectVersion: 2,
        projectId: testProjectId,
        chains: [5],
        optionalChains: [1, 137],
        methods: [
          // 'eth_getBalance', // no error on request but no result
        ],
        optionalMethods: [
          'eth_signTypedData_v4', // needed for sign typed data to work
          // 'eth_getBalance', // error on request
        ],
        rpcMap: {
          1: 'https://cloudflare-eth.com/',  // Mainnet
          5: 'https://goerli.optimism.io/',  // Goerli
          137: 'https://polygon-rpc.com/',   // Polygon
        },
      });
      console.log('checkSupportResult is', checkSupportResult);

      const connectKitProvider = await connectKit.getProvider();
      setProvider(connectKitProvider);

      const requestAccountsResponse = await (requestAccounts(connectKitProvider));
      if (requestAccountsResponse) {
        setAccount(requestAccountsResponse[0]);
        const chainIdResponse = await getChainId(connectKitProvider);
        if (chainIdResponse) setChainId(chainIdResponse);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const connectWithWalletConnect = async () => {
    console.log('> connectWithWalletConnect');

    resetState();

    try {
      const initOptions = {
        providerType: SupportedProviders.Ethereum,
        walletConnectVersion: 2,
        projectId: testProjectId,
        chains: [5],
        optionalChains: [1, 137],
        methods: [
          // 'eth_getBalance', // no error on request but no result
        ],
        optionalMethods: [
          'eth_signTypedData_v4', // needed for sign typed data to work
          'eth_getBalance', // error on request
        ],
        rpcMap: {
          1: 'https://cloudflare-eth.com/',  // Mainnet
          5: 'https://goerli.optimism.io/',  // Goerli
          137: 'https://polygon-rpc.com/',   // Polygon
        },
        showQrModal: true,
      };
      const walletConnectProvider = await WalletConnectProvider.init(initOptions);
      setProvider(walletConnectProvider);
      console.log('provider is', walletConnectProvider);

      await walletConnectProvider.connect({
        chains: initOptions.chains,
        optionalChains: initOptions.optionalChains,
      });

      const requestAccountsResponse = await (requestAccounts(walletConnectProvider));
      if (requestAccountsResponse) {
        setAccount(requestAccountsResponse[0]);
        const chainIdResponse = await getChainId(walletConnectProvider);
        if (chainIdResponse) setChainId(chainIdResponse);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const disconnectWallet = async () => {
    console.log('> disconnectWallet');

    if (provider.disconnect) {
      console.log('> calling provider.disconnect()');
      provider.disconnect();
    }

    // needs to be called here
    // the Extension does not emit a disconnect event
    resetState();
  };

  const switchChain = useCallback(async (chainId) => {
    console.log('> switchChain', chainId);
    setMessage('');

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error(error)
      setMessage(error.message);
    }
  });

  const personalSign = useCallback(async () => {
    console.log('> personalSign');
    setMessage('');

    const exampleMessage = 'Example message';
    try {
      const from = account;
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const signedMessage = await provider.request({
        method: 'personal_sign',
        params: [msg, from, 'no password'],
      });
      setMessage(`Signed message is: ${signedMessage}`);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  });

  const signTypedData = useCallback(async () => {
    console.log('> signTypedData');
    setMessage('');

    console.log('chainId is', chainId);

    const messageData = {
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId,
        // Give a user-friendly name to the specific contract you're signing for.
        name: 'Ether Mail',
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // This identifies the latest version.
        version: '1',
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: 'Mail',
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to primaryType.
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };

    const from = account;
    const msgParams = JSON.stringify(messageData)

    try {
      const signedMessage = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [from, msgParams],
      });
      setMessage(`Signed message is: ${signedMessage}`);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  });

  // effects

  useEffect(() => {
    console.log('> set provider events useEffect');

    if (provider?.on) {
      const handleDisconnect = (props) => {
        console.log('> handleDisconnect', props);

        // needs to be called here to handle disconnect from Ledger Live
        resetState();
      };

      const handleConnect = async () => {
        console.log('> handleConnect');

        console.log('provider is', provider);

        setChainId(provider.chainId);
        setAccount(provider.account);
      }

      const handleChainChanded = async (chainId) => {
        console.log('> handleChainChanded', chainId);
        setChainId(chainId);
      }

      const handleAccountsChanged = async (accounts) => {
        console.log('> handleAccountsChanged', accounts);
        setAccount(accounts[0]);
      }

      provider.on('connect', handleConnect);
      provider.on('chainChanged', handleChainChanded);
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        console.log('> unset provider events useEffect');

        // handle removing event listeners here,
        // when disconnecting from the Extension no disconnect event is emited
        if (provider.removeListener) {
          console.log('> removing event listeners');
          provider.removeListener('connect', handleConnect);
          provider.removeListener('chainChanged', handleChainChanded);
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  // utils

  const resetState = async () => {
    console.log('> resetState');

    setAccount();
    setChainId();
    setProvider();
    setMessage('');
  };

  const getChainId = async (provider) => {
    try {
      return await provider.request({ method: 'eth_chainId' });
    } catch (error) {
      console.error(error)
      setMessage(error);
    }
  }

  const requestAccounts = async (provider) => {
    try {
      return await provider.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const isRequestedChainId = (requestedChainId) => {
    return chainId === requestedChainId || chainId === `0x${requestedChainId.toString(16)}`;
  };

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
            <Box>{`Chain Id: ${chainId ? chainId : "none"}`}</Box>
            <Box>{`Account: ${shortenAddress(account)}`}</Box>
            <Box>{`Balance: ${balance}`}</Box>
          </>
        )}

        <Message>{message ? message : null}</Message>

        {!account ? (
          <>
            <Box>
              <Button bg='primary' onClick={connectWithLedger}>Ledger</Button>
            </Box>
            <Box>
              <Button bg='primary' onClick={connectWithWalletConnect}>WalletConnect</Button>
            </Box>
          </>
      ) : (
          <>
            <Box>
              <Button onClick={disconnectWallet}>Disconnect</Button>
            </Box>

            <Box>
              <Button onClick={personalSign}>Personal sign</Button>
            </Box>
            <Box>
              <Button onClick={signTypedData}>Sign typed data</Button>
            </Box>

            <Box>
              <Button disabled={isRequestedChainId(137)} onClick={() => switchChain(137)}>Switch to Polygon</Button>
            </Box>
            <Box>
              <Button disabled={isRequestedChainId(5)} onClick={() => switchChain(5)}>Switch to Göerli</Button>
            </Box>
            <Box>
              <Button disabled={isRequestedChainId(1)} onClick={() => switchChain(1)}>Switch to Mainnet</Button>
            </Box>
            </>
        )}
      </Stack>
    </>
  );
}
