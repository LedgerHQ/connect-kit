import {
  CardContent,
  CardBody,
  CardFooter,
  CardSubtitle,
  CardTitle,
  CardWrapper,
} from "../Modal/Card.styles";
import {
  BuyNowButton,
  BuyNowText,
  NeedALedgerCardContent,
} from "./index.styles";

const NeedALedgerCard = () => {
  const handleOnBuyNowClick = () => {
    window.open("https://shop.ledger.com/pages/ledger-nano-x", "_blank");
  };

  return (
    <CardWrapper>
      <NeedALedgerCardContent>
        <CardBody>
          <CardTitle>Need a Ledger?</CardTitle>
          <CardSubtitle>
            Keep your assets safe with the most secure multi-chain hardware
            wallet.
          </CardSubtitle>
        </CardBody>
        <CardFooter>
          <BuyNowButton onClick={handleOnBuyNowClick}>
            <BuyNowText>Buy Now</BuyNowText>
          </BuyNowButton>
        </CardFooter>
      </NeedALedgerCardContent>
    </CardWrapper>
  );
};

export default NeedALedgerCard;
