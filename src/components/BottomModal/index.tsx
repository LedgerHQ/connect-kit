import {
  ModalBody,
  ModalFooter,
  ModalSubtitle,
  ModalTitle,
  ModalSpacer,
  ModalWrapper,
} from "../Modal/index.styles";
import {
  BuyNowButton,
  BuyNowButtonContainer,
  BuyNowText,
  Spacer,
  ModalContent,
} from "./index.styles";

const BottomModal = () => {
  const handleOnBuyNowClick = () => {
    window.open("https://shop.ledger.com/pages/ledger-nano-x", "_blank");
  };

  return (
    <ModalWrapper>
      <ModalContent>
        <ModalSpacer>
          <ModalBody>
            <ModalTitle>Need a Ledger?</ModalTitle>
            <Spacer />
            <ModalSubtitle>
              Keep your assets safe with the most secure multi-chain hardware
              wallet.
            </ModalSubtitle>
          </ModalBody>
          <ModalFooter>
            <BuyNowButtonContainer>
              <BuyNowButton onClick={handleOnBuyNowClick}>
                <BuyNowText>Buy Now</BuyNowText>
              </BuyNowButton>
            </BuyNowButtonContainer>
          </ModalFooter>
        </ModalSpacer>
      </ModalContent>
    </ModalWrapper>
  );
};

export default BottomModal;
