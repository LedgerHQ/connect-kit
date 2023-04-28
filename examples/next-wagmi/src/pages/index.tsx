import { GlobalStyle, Heading, Stack, SubHeading } from '@/components/StyledComponents'
import { Account, Connect, NetworkSwitcher } from '../components'
import { useIsMounted } from '../hooks'
import { SignMessage } from '@/components/SignMessage'
import { SignTypedData } from '@/components/SignTypedData'

const Page = () => {
  const isMounted = useIsMounted()

  if (!isMounted) return null
  return (
    <>
      <GlobalStyle />

      <Stack direction="column" justifyContent="center" height="100vh">
        <Heading>Connect with Ledger DApp Connect Kit</Heading>
        <SubHeading>Using Next.js + wagmi</SubHeading>

        <Connect />
        <Account />
        <SignMessage />
        <SignTypedData />
        <NetworkSwitcher />
      </Stack>
    </>
  )
}

export default Page
