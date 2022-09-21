export type LedgerConnectKit = {
  checkConnectSupport: Function;
  showModal: Function;
};

function loadScript(src: string, globalName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptId = `lckit-script-${globalName}`

    if (document.getElementById(scriptId)) {
      resolve((window as { [key: string]: any })[globalName])
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.id = scriptId
    script.addEventListener("load", () => {
      resolve((window as { [key: string]: any })[globalName])
    })
    script.addEventListener("error", (e) => reject(e.error));
    document.head.appendChild(script)
  })
}

export async function loadConnectKit(): Promise<LedgerConnectKit> {
  const CONNECT_KIT_CDN_URL = "https://incomparable-duckanoo-b48572.netlify.app/umd/index.js"
  const CONNECT_KIT_GLOBAL_NAME = "ledgerConnectKit"

  return await loadScript(CONNECT_KIT_CDN_URL, CONNECT_KIT_GLOBAL_NAME)
}
