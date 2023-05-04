import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { GlobalStyle, Heading, Stack, SubHeading } from '../components/StyledComponents';
import { SignMessage } from '../components/SignMessage';
import { SignTypedData } from '../components/SignTypedData';
import { Account } from '../components/Account';

const Home: NextPage = () => {
  return (
    <>
      <GlobalStyle/>

      <Stack direction="column" justifyContent="center" height="100vh">
        <Heading>Connect with Ledger</Heading>
        <SubHeading>Using Next.js + RainbowKit</SubHeading>

        <ConnectButton />

        <Account />
        <SignMessage />
        <SignTypedData />
      </Stack>
    </>
  );
};

export default Home;
