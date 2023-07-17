import { useCallback, useEffect, useRef, useState } from "react";
import { getDebugLogger } from "../../lib/logger";
import Modal, { ModalProps, setIsModalOpen } from "../Modal/Modal";
import {
  ModalButton,
  ModalSection,
  ModalText,
  ModalTitle,
  Link,
} from "../Modal/Modal.styles";
import { QrCode, QrCodeSection } from "./UseLedgerLiveModal.styles";
//import analyticsInstance from "../../Analytics/Analytics"
import { useAnalytics } from "../../hooks/useAnalytics";

const log = getDebugLogger('UseLedgerLiveModal');

// placeholder functions until the component is initialized
let setModalUri = (uri: string) => {};

// called by the WalletConnect display_uri event handler to set a new URI
export let setWalletConnectUri = (uri: string): void => {
  log('setModalUri', uri);
  setModalUri(uri);
}

export type UseLedgerLiveModalProps = {
  isDesktop?: boolean;
  uri?: string;
} & ModalProps;

const UseLedgerLiveModal = ({
  isDesktop = false,
  uri = '',
  onClose = () => void 0,
}: UseLedgerLiveModalProps) => {
  log('initializing', { isDesktop, uri });

  // use the uri prop as the initial start value
  const [wcUri, setWcUri] = useState<string>(uri);
  // replace the placeholder function by the setState one
  setModalUri = setWcUri;
  // update state only if supplied URI is different from previous and current
  const previousUriRef = useRef<string>();
  const previousUri = previousUriRef.current;
  if (uri !== previousUri && uri !== wcUri) {
    setWcUri(uri);
  }
  // update the previous URI ref on each rerender
  useEffect(() => {
    previousUriRef.current = uri;
  });

  const onUseLedgerLiveClick = useCallback(() => {
    log('loading Ledger Live, ', wcUri);
    window.location.href = `ledgerlive://wc?uri=${encodeURIComponent(wcUri)}`;

    // close the modal so that the current WalletConnect URI cannot be reused
    setIsModalOpen(false);

    return false;
  }, [wcUri]);

  const onInstallLedgerLiveClick = useCallback(() => {
    window.open('https://www.ledger.com/ledger-live');
    return false;
  }, []);


  const { init, track } = useAnalytics();

  useEffect(() => {
    init(
      {
        dappName: "connect-kit",
      },
      { ip: "0.0.0.0" }
    ).then(() => {
      console.log("init segment")
      void track(window.location.hostname)
    });
  }, []);


  return (
    <Modal onClose={onClose}>
      <ModalSection textAlign="center">
        <ModalTitle>Connect with Ledger Live</ModalTitle>

        {isDesktop && wcUri !== '' &&
          <>
            <ModalText>
            Scan for Ledger Live mobile
            </ModalText>

            <QrCodeSection>
              <QrCode value={wcUri} size={310} />
            </QrCodeSection>

            <ModalText noMargin>or</ModalText>

            <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
            Connect with Ledger Live desktop
            </ModalButton>
          </>
        }

        {!isDesktop && wcUri !== '' &&
          <ModalButton variant="primary" onClick={onUseLedgerLiveClick} extraMargin>
            Connect with Ledger Live mobile
          </ModalButton>
        }

        <ModalText>
          Don't have Ledger Live for {isDesktop ? 'desktop' : 'mobile'}?
        </ModalText>
        <ModalText noMargin>
          <Link onClick={onInstallLedgerLiveClick}>Install it</Link>
        </ModalText>
      </ModalSection>
    </Modal>
  );
};

export default UseLedgerLiveModal;
