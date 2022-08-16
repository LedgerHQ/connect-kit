import { LedgerConnectKit } from '@types'

function loadScript(src: string, globalName: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.addEventListener("load", () => {
      resolve((window as { [key: string]: any })[globalName])
    })
    script.addEventListener("error", (e) => reject(e.error));
    document.head.appendChild(script)
  })
}

export async function loadConnectKit() {
  const CONNECT_KIT_CDN_URL = "https://incomparable-duckanoo-b48572.netlify.app/umd/index.js"
  const CONNECT_KIT_GLOBAL_NAME = "ledgerConnectKit"

  return await loadScript(CONNECT_KIT_CDN_URL, CONNECT_KIT_GLOBAL_NAME) as LedgerConnectKit
}
