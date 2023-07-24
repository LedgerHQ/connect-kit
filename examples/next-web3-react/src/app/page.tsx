import Card from '@/components/Card'
import { GlobalStyle, Heading, Stack, SubHeading } from '@/components/StyledComponents'
import { connectorsObj } from "../connectors"

export default function Home() {
  // const [ urlConnector, urlHooks ] = connectorsObj.url
  const [ ledgerConnector, ledgerHooks ] = connectorsObj.ledger
  const [ walletConnectConnector, walletConnectHooks ] = connectorsObj.walletConnect

  return (
    <>
      <GlobalStyle />

      <Stack direction="column" justify="center" height="100vh">
        <Heading>Connect with Ledger DApp Connect Kit</Heading>
        <SubHeading>Using Vite + web3-react</SubHeading>

        {/* <Card connector={urlConnector} hooks={urlHooks} name='URL' /> */}
        <Card connector={ledgerConnector} hooks={ledgerHooks} name='Ledger' />
        <Card connector={walletConnectConnector} hooks={walletConnectHooks} name='WalletConnect' />
      </Stack>
    </>
  )
}
