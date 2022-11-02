import styled, { css, createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font: 16px sans-serif;
  }
`;

export const Stack = styled.div`
  box-sizing: 'border-box';
  display: flex;
  align-items: center;

  ${({direction}) => css`
    flex-direction: ${direction};
  `}
`;

export const Box = styled.div`
  margin-bottom: 0.6rem;
`;

export const Heading = styled.h2`
  margin-bottom: 2rem;
`;

export const Button = styled.button`
  bacground: #aaa;
  color: black;

  margin-bottom: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;

  font: inherit;
`;

export const On = styled.span`
  color: green;
`;

export const Off = styled.span`
  color: darkRed;
`;
