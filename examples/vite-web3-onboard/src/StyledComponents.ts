import styled, { css, createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    background: #eee;
    font-family: "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-feature-settings: "kern";
    text-align: center;
  }
`;

export const Stack = styled.div<{
  direction?: string,
  justifyContent?: string,
  height?: string
}>`
  box-sizing: 'border-box';
  display: flex;
  align-items: center;

  ${({direction}) => css`
    flex-direction: ${direction};
  `}

  ${({justifyContent}) => css`
    justify-content: ${justifyContent || 'flex-start'};
  `}

  ${({height}) => height && css`
    height: ${height};
  `}
`;

export const Box = styled.div`
  margin-bottom: 0.6rem;
`;

export const Message = styled.div`
  margin-bottom: 0.6rem;
  word-wrap: anywhere;
`;

export const Heading = styled.h2`
  font-weight: normal;
  font-size: 2rem;
  margin-bottom: 10px;
`;

export const SubHeading = styled.h3`
  font-weight: normal;
  font-size: 1.2rem;
  margin-bottom: 60px;
`;

export const Button = styled.button<{
  onClick: any,
  disabled?: boolean
}>`
  background-color: #dedede;
  color: black;

  margin-bottom: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;

  font: inherit;

  ${({disabled}) => disabled
  ? css`
    color: #8e8e8e;
  `
  : css`
    cursor: pointer;

    &:hover {
      background-color: #d0d0d0;
    }
    &:active {
      background-color: #c0c0c0;
    }
  `
  }
`;

export const On = styled.span`
  color: green;
`;

export const Off = styled.span`
  color: darkRed;
`;
