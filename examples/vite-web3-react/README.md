
create app

    $ pnpm create vite --template react-ts vite-ledger-web3-react
    $ cd vite-ledger-web3-react
    $ pnpm install

add web3-react packages

    $ pnpm add @web3-react/types @web3-react/core @web3-react/walletconnect-v2 @web3-react/ledger

Run with

    $ pnpm dev


Connectors

```ts [connectors.ts]
// connectors.ts
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { Connector, Web3ReactStore } from '@web3-react/types'
import { Phantom } from 'web3-react-phantom'

const phantom = initializeConnector<Phantom>((actions) => new Phantom({ actions }))

const connectors: [Connector, Web3ReactHooks, Web3ReactStore][] = [phantom]

export default connectors
```

```ts [main.tsx]
// main.tsx
import { Web3ReactProvider, Web3ReactHooks, useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'

import allConnections from './connectors'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import { Web3ReactProvider, Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'

import allConnections from './connectors'
import Card from "./components/Card";

const connections: [Connector, Web3ReactHooks][] = allConnections.map(
  ([connector, hooks]) => [connector, hooks]
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Web3ReactProvider connectors={connections}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3ReactProvider>
)
```

```ts [components/Card.tsx]
//Card.tsx
import { useEffect, useState } from 'react'
import { Web3ReactSelectedHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'

export default function Card({connector, hooks, name}: {
  connector: Connector,
  hooks: Web3ReactSelectedHooks,
  name: string
}) {
  const {useSelectedAccount, useSelectedChainId, useSelectedIsActive, useSelectedIsActivating } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const chain = useSelectedChainId(connector)

  const [error, setError] = useState<Error | undefined>(undefined)
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')

  const handleToggleConnect = () => {
    setError(undefined) // clear error state

    if (isActive) {
      if(connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
    }
    else if (!isActivating) {
      setConnectionStatus('Connecting..')
        Promise.resolve(connector.activate(1))
        .catch((e) => {
          connector.resetState()
          setError(e)
        })
      }
  }
  useEffect(() => {
    if(isActive) {
      setConnectionStatus('Connected')
    } else {
      setConnectionStatus('Disconnected')
    }
  }
  ,[isActive])

  return (
    <div>
      <p>{name.toUpperCase()}</p>
      <h3>Status - {(error?.message) ? ("Error: " + error.message) : connectionStatus}</h3>
      <h3>Address - {account ? account : "No Account Detected"}</h3>
      <h3>ChainId -  {chain ? chain : 'No Chain Connected'}</h3>
      <button onClick={handleToggleConnect} disabled={false}>
        {isActive ? "Disconnect" : "Connect"}
      </button>
    </div>
  )
}
```

```ts [App.tsx]
import { useWeb3React } from "@web3-react/core";

function App() {
  const { connector, hooks } = useWeb3React();
  //...
  <Card connector={connector} hooks={hooks} name='phantom' />
}
```