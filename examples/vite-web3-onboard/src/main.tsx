import React from 'react'
import ReactDOM from 'react-dom/client'
import { Web3OnboardProvider } from '@web3-onboard/react'
import App from './App'
import { GlobalStyle } from './StyledComponents';
import web3Onboard from './web3-onboard'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle/>
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <App />
    </Web3OnboardProvider>
  </React.StrictMode>,
)
