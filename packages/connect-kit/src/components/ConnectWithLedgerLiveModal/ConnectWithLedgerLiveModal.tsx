import { getDebugLogger } from "../../lib/logger";
import Modal, { ModalProps, setIsModalOpen } from "../Modal/Modal";
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

            {ledgerLiveDeepLink !== '' &&
              <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
                Use Ledger Live
              </ModalButton>
            }
          </Stack>
        </ModalSection>

        {withQrCode && ledgerLiveDeepLink !== '' &&
          <QrCodeSection>
            <Stack direction="row" gap={1}>
              <Stack direction="column" gap={0}>
                <ModalSubtitle>Or scan to connect</ModalSubtitle>
                <ModalText>Scan this QR code with your mobile to connect with Ledger Live.</ModalText>
              </Stack>
              <QrCode value={ledgerLiveDeepLink} size={128} />
            </Stack>
          </QrCodeSection>
        }

        <NeedALedgerSection />
      </>
    </Modal>
  );
};

export default ConnectWithLedgerLiveModal;
