import Card from "./components/Card"
import { GlobalStyle, Stack, Heading, SubHeading } from "./components/StyledComponents"
// import { useWeb3React } from "@web3-react/core"
// import { connectorsObj } from "./connectors"
import './App.css'
import { useWeb3React } from "@web3-react/core";

function App() {
  const { connector, hooks } = useWeb3React();
  // TODO get all connectors
  // const [ urlConnector, urlHooks ] = connectorsObj.url
  // const [ ledgerConnector, ledgerHooks ] = connectorsObj.ledger
  // const [ walletConnectConnector, walletConnectHooks ] = connectorsObj.walletConnect

  return (
    <>
      <GlobalStyle />

      <Stack direction="column" justifyContent="center" height="100vh">
        <Heading>Connect with Ledger DApp Connect Kit</Heading>
        <SubHeading>Using Vite + web3-react</SubHeading>

        <Card connector={connector} hooks={hooks} name='Ledger' />
        {/* <Card connector={urlConnector} hooks={urlHooks} name='URL' />
        <Card connector={ledgerConnector} hooks={ledgerHooks} name='Ledger' />
        <Card connector={walletConnectConnector} hooks={walletConnectHooks} name='WalletConnect' /> */}
      </Stack>
    </>
  )
}

export default App
