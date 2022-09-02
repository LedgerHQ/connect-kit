import styled from "styled-components";
import { ModalButton } from "../Modal/Modal.styles";

export const ConnectFeature = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.6rem 0 0.6rem 0;
  padding: 0 3rem 0 0;

  & > img {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
`;

export const InstallButton = styled(ModalButton)`
  width: 100%;
  margin-top: 1.4rem;
`;
