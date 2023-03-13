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
  isDesktop?: boolean;
  uri?: string;
} & ModalProps;

const ConnectWithLedgerLiveModal = ({
  isDesktop = false,
  uri = '',
  onClose = () => void 0,
}: ConnectWithLedgerLiveModalProps) => {
  log('initializing', { isDesktop, uri });

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
        <ModalTitle>Connect with Ledger Live</ModalTitle>

        {isDesktop && ledgerLiveDeepLink !== '' &&
          <>
            <ModalText>
            Scan for Ledger Live mobile
            </ModalText>

            <QrCodeSection>
              <QrCode value={ledgerLiveDeepLink} size={310} />
            </QrCodeSection>

            <ModalText noMargin>or</ModalText>

            <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
            Connect with Ledger Live desktop
            </ModalButton>
          </>
        }

        {!isDesktop && ledgerLiveDeepLink !== '' &&
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

export default ConnectWithLedgerLiveModal;
