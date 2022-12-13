import { getDebugLogger } from "../../lib/logger";
import Modal, { ModalProps, setIsModalOpen } from "../Modal/Modal";
import {
  ModalButton,
  ModalSection,
  ModalText,
  ModalTitle,
  Link,
} from "../Modal/Modal.styles";
import { QrCode, QrCodeSection } from "./ConnectWithLedgerLiveModal.styles";

const log = getDebugLogger('ConnectWithLedgerLiveModal');

export type ConnectWithLedgerLiveModalProps = {
  withQrCode?: boolean;
  uri?: string;
} & ModalProps;

const ConnectWithLedgerLiveModal = ({
  withQrCode = false,
  uri = '',
  onClose = () => void 0,
}: ConnectWithLedgerLiveModalProps) => {
  log('initializing', { withQrCode, uri });

  const ledgerLiveDeepLink = `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;

  const onUseLedgerLiveClick = () => {
    window.location.href = ledgerLiveDeepLink;

    // close the modal so that the current WalletConnect URI cannot be reused
    setIsModalOpen(false);

    return false;
  };

  const onInstallLedgerLiveClick = () => {
    window.open('https://www.ledger.com/ledger-live');
    return false;
  };

  return (
    <Modal onClose={() => onClose()}>
      <ModalSection textAlign="center">
        <ModalTitle>Do you have Ledger Live?</ModalTitle>

        {withQrCode && ledgerLiveDeepLink !== '' &&
          <>
            <ModalText>
              Scan with your mobile.
            </ModalText>

            <QrCodeSection>
              <QrCode value={ledgerLiveDeepLink} size={310} />
            </QrCodeSection>

            <ModalText noMargin>or</ModalText>

            <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
              Open Ledger Live Desktop
            </ModalButton>
          </>
        }

        {!withQrCode && ledgerLiveDeepLink !== '' &&
          <ModalButton variant="primary" onClick={onUseLedgerLiveClick} extraMargin>
            Open Ledger Live
          </ModalButton>
        }

        <ModalText>Don't have Ledger Live? <Link onClick={onInstallLedgerLiveClick}>
          Install</Link>
        </ModalText>
      </ModalSection>
    </Modal>
  );
};

export default ConnectWithLedgerLiveModal;
