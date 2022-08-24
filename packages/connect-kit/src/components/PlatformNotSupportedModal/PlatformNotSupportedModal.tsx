import Modal from "../Modal/Modal";
import {
  ModalSection,
  ModalText,
  ModalTitle,
} from "../Modal/Modal.styles";
import { BrowserList, BrowserListItem } from "./PlatformNotSupported.styles";
import { default as ChromeIcon } from "../../assets/svg/ChromeIcon.svg";
import { default as SafariIcon } from "../../assets/svg/SafariIcon.svg";
import { default as FirefoxIcon } from "../../assets/svg/FirefoxIcon.svg";
import NeedALedgerSection from "../NeedALedgerSection";

type PlatformNotSupportedModalProps = {
  withUsb?: boolean;
}

const PlatformNotSupportedModal = ({ withUsb }: PlatformNotSupportedModalProps) => {
  return (
    <Modal>
      <>
        <ModalSection>
          <ModalTitle>
            Sorry, we don't support this platform just yet.
          </ModalTitle>

          <ModalText>
            We're working hard to expand our coverage.
            <br/>
            Until we get there, you can try Ledger Connect on:
          </ModalText>
          <BrowserList>
            <BrowserListItem>
              <img src={SafariIcon} />
              Safari on iOS
            </BrowserListItem>
          </BrowserList>

          {withUsb && (
            <>
              <ModalText>
                Or still use USB on:
              </ModalText>
              <BrowserList>
                <BrowserListItem>
                  <img src={ChromeIcon} />
                  Chrome based browsers on desktop
                </BrowserListItem>
                <BrowserListItem>
                  <img src={FirefoxIcon} />
                  Firefox on desktop
                </BrowserListItem>
              </BrowserList>
            </>
          )}
        </ModalSection>

        <NeedALedgerSection variant="primary" />
      </>
    </Modal>
  );
};

export default PlatformNotSupportedModal;
