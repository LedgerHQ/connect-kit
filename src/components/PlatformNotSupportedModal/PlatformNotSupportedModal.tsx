import Modal, { setIsModalOpen } from "../Modal";
import {
  CloseButtonWrapper,
} from "../Modal/index.styles";
import {
  CardBody,
  CardContent,
  CardFooter,
  CardFooterText,
  CardHeader,
  CardSubtitle,
  CardTitle,
  CardWrapper,
} from "../Modal/Card.styles";
import { default as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { default as AppleSvg } from "../../assets/svg/Apple.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";
import NeedALedgerCard from "../NeedALedgerCard";

const PlatformNotSupportedModal = () => {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal>
      <>
        <CardWrapper>
          <CardContent>
            <CardHeader>
              <img src={LedgerConnectSvg} />
              <CloseButtonWrapper onClick={handleClose}>
                <img src={XButtonSvg} />
              </CloseButtonWrapper>
            </CardHeader>
            <CardBody>
              <CardTitle>
                Sorry, we don't support this platform just yet.
              </CardTitle>
              <CardSubtitle>
                We're working hard to expand our coverage.
                <br />
                Until we get there you can try Connect on...
              </CardSubtitle>
            </CardBody>
            <CardFooter>
              <img src={AppleSvg} />
              <CardFooterText>Safari on iOS</CardFooterText>
            </CardFooter>
          </CardContent>
        </CardWrapper>
        <NeedALedgerCard />
      </>
    </Modal>
  );
};

export default PlatformNotSupportedModal;
