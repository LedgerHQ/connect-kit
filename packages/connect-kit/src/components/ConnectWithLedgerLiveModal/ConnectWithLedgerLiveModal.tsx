import { useState } from "react";
import { getDebugLogger } from "../../lib/logger";
import Modal from "../Modal/Modal";
import {
  ModalButton,
  ModalSection,
  ModalText,
  ModalTitle,
  ModalSubtitle,
  Stack,
} from "../Modal/Modal.styles";
import NeedALedgerSection from "../NeedALedgerSection";
import { QrCode, QrCodeSection } from "./ConnectWithLedgerLiveModal.styles";

const log = getDebugLogger('ConnectWithLedgerLiveModal');
let walletConnectUri: string;
let ledgerLiveDeepLink: string;

// placeholder functions until the component is initialized
let setModalUri = (uri: string) => {};
let setModalDeeplink = (uri: string) => {};

// called by the WalletConnect display_uri event handler
export let setWalletConnectUri = (uri: string): void => {
  log('setModalUri', uri);
  walletConnectUri = uri;
  ledgerLiveDeepLink = `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;

  // update internal component state
  setModalUri(uri);
  setModalDeeplink(ledgerLiveDeepLink);
}

export type ConnectWithLedgerLiveModalProps = {
  withQrCode?: boolean;
  onClose?: () => void;
}

const ConnectWithLedgerLiveModal = ({
  withQrCode = false,
  onClose = () => void 0,
}: ConnectWithLedgerLiveModalProps) => {
  log('initializing', { withQrCode });
  log('walletConnectUri', walletConnectUri);

  // use the module variables as the initial start values
  const [uri, setUri] = useState<string>(walletConnectUri);
  const [deeplink, setDeeplink] = useState<string>(ledgerLiveDeepLink);
  // replace the placeholder functions by the setState ones
  setModalUri = setUri;
  setModalDeeplink = setDeeplink;

  const onUseLedgerLiveClick = () => {
    window.location.href = deeplink;
    return false;
  };

  const onInstallLedgerLiveClick = () => {
    window.open('https://www.ledger.com/ledger-live');
    return false;
  };

  return (
    <Modal onClose={() => onClose()}>
      <>
        <ModalSection>
          <ModalTitle>Use Ledger Live</ModalTitle>
          <ModalText>
            Ledger Live is your one-stop shop to buy crypto, grow your assets,
            and manage NFTs.
          </ModalText>

          <Stack direction="row" gap={1}>
            <ModalButton variant="default" onClick={onInstallLedgerLiveClick}>
              Install Ledger Live
            </ModalButton>

            {uri !== '' &&
              <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
                Use Ledger Live
              </ModalButton>
            }
          </Stack>
        </ModalSection>

        {withQrCode && uri !== '' &&
          <QrCodeSection>
            <Stack direction="row" gap={1}>
              <Stack direction="column" gap={0}>
                <ModalSubtitle>Or scan to connect</ModalSubtitle>
                <ModalText>Scan this QR code with your mobile to connect with Ledger Live.</ModalText>
              </Stack>
              <QrCode value={uri} size={128} />
            </Stack>
          </QrCodeSection>
        }

        <NeedALedgerSection />
      </>
    </Modal>
  );
};

export default ConnectWithLedgerLiveModal;
