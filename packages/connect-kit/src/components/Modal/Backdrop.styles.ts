import styled from "styled-components";

export const Backdrop = styled.div`
  z-index: 998;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  transition: opacity .25s;
`;
