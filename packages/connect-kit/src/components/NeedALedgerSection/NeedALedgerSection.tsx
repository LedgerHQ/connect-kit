import {
  ModalText,
  ModalSubtitle,
  VariantOptions,
} from "../Modal/Modal.styles";
import {
  BuyNowButton,
  CustomBackground,
  ContentWrapper,
} from "./NeedALedgerSection.styles";

const NeedALedgerCard = ({variant = 'default'}: VariantOptions) => {
  const handleOnBuyNowClick = () => {
    window.open("https://shop.ledger.com/pages/ledger-nano-x", "_blank");
  };

  return (
    <CustomBackground>
      <ContentWrapper>
        <ModalSubtitle>Need a Ledger?</ModalSubtitle>

        <ModalText>
          Keep your assets safe with the most secure multi&#8209;chain hardware
          wallet.
        </ModalText>

        <BuyNowButton variant={variant} onClick={handleOnBuyNowClick}>Buy Now</BuyNowButton>
      </ContentWrapper>
    </CustomBackground>
  );
};

export default NeedALedgerCard;
