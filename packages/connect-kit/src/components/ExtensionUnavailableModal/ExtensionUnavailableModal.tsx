import Modal, { setIsModalOpen } from "../Modal";
import {
  CloseButtonWrapper,
} from "../Modal/index.styles";
import {
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardWrapper,
  CardSubtitle,
  CardTitle,
} from "../Modal/Card.styles";
import {
  IconContainer,
  JoinBetaButton,
  JoinBetaText,
  ModalSubtitleContainer,
} from "./ExtensionUnavailableModal.styles";
import NeedALedgerCard from "../NeedALedgerCard";
import { default as LedgerConnectSvg } from "../../assets/svg/LedgerConnect.svg";
import { default as XButtonSvg } from "../../assets/svg/X.svg";
import { default as LightbulbSvg } from "../../assets/svg/Lightbulb.svg";
import { default as CheckmarkSvg } from "../../assets/svg/Checkmark.svg";

const ExtensionUnavailableModal = () => {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const onJoinBetaClick = () => {
    window.open("https://get-connect.ledger.com/", "_blank");
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
              <CardTitle> Try Ledger Connect </CardTitle>
              <ModalSubtitleContainer>
                <IconContainer>
                  <img src={LightbulbSvg} />
                </IconContainer>
                <CardSubtitle>
                  One secure wallet and extension that works across all dApps.
                </CardSubtitle>
              </ModalSubtitleContainer>
              <ModalSubtitleContainer>
                <IconContainer>
                  <img src={CheckmarkSvg} />
                </IconContainer>
                <CardSubtitle>
                  Stay safe and prevent harmful transactions with Web3 Check.
                </CardSubtitle>
              </ModalSubtitleContainer>
            </CardBody>
            <CardFooter>
              <JoinBetaButton onClick={onJoinBetaClick}>
                <JoinBetaText>Join the Beta</JoinBetaText>
              </JoinBetaButton>
            </CardFooter>
          </CardContent>
        </CardWrapper>
        <NeedALedgerCard />
      </>
    </Modal>
  );
};

export default ExtensionUnavailableModal;
