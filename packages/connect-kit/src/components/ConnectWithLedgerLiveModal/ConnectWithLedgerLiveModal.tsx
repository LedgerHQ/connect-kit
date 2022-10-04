import { useEffect, useState } from "react";
import { getLogger } from "../../lib/logger";
import { getWalletConnectUri } from "../../providers/WalletConnect";
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

const log = getLogger('ConnectWithLedgerLiveModal');

type ConnectWithLedgerLiveModalProps = {
  withQrCode?: boolean;
}

const ConnectWithLedgerLiveModal = ({
  withQrCode = false
}: ConnectWithLedgerLiveModalProps) => {
  const [walletConnectUri, setWalletConnectUri] = useState<string>('');
  const [ledgerLiveDeepLink, setLedgerLiveDeepLink] = useState<string>('');

  log('initializing', { withQrCode });

  useEffect(() => {
    const uri = getWalletConnectUri();
    const deepLink = `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;

    log('WC URI', uri);
    log('deeplink', deepLink);

    setWalletConnectUri(uri);
    setLedgerLiveDeepLink(deepLink);
  })

  const onUseLedgerLiveClick = () => {
    window.open(ledgerLiveDeepLink);
    return false;
  };

  const onInstallLedgerLiveClick = () => {
    window.open('https://www.ledger.com/ledger-live');
    return false;
  };

  return (
    <Modal>
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

            {walletConnectUri !== '' &&
              <ModalButton variant="primary" onClick={onUseLedgerLiveClick}>
                Use Ledger Live
              </ModalButton>
            }
          </Stack>
        </ModalSection>

        {withQrCode && walletConnectUri !== '' &&
          <QrCodeSection>
            <Stack direction="row" gap={1}>
              <Stack direction="column" gap={0}>
                <ModalSubtitle>Or scan to connect</ModalSubtitle>
                <ModalText>Scan this QR code with your mobile to connect with Ledger Live.</ModalText>
              </Stack>
              <QrCode value={walletConnectUri} size={128} />
            </Stack>
          </QrCodeSection>
        }

        <NeedALedgerSection />
      </>
    </Modal>
  );
};

export default ConnectWithLedgerLiveModal;
