import React from 'react'
import ReactDOM from 'react-dom/client'
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core'

import App from './App.tsx'
import { connectorsObj as allConnectors } from './connectors.ts'
import { Connector } from '@web3-react/types'

const connections: [Connector, Web3ReactHooks][] = Object.values(allConnectors).map(
  ([connector, hooks]) => [connector, hooks]
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Web3ReactProvider connectors={connections}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3ReactProvider>
)
