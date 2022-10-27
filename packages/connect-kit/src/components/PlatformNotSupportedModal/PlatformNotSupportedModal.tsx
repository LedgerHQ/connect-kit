import Modal from "../Modal/Modal";
import {
  ModalSection,
  ModalText,
  ModalTitle,
} from "../Modal/Modal.styles";
import { BrowserList, BrowserListItem } from "./PlatformNotSupportedModal.styles";
import { default as SafariIcon } from "../../assets/svg/SafariIcon.svg";
import NeedALedgerSection from "../NeedALedgerSection";
import { getDebugLogger } from "../../lib/logger";

const log = getDebugLogger('PlatformNotSupportedModal')

const PlatformNotSupportedModal = () => {
  log('initializing');

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
        </ModalSection>

        <NeedALedgerSection variant="primary" />
      </>
    </Modal>
  );
};

export default PlatformNotSupportedModal;
