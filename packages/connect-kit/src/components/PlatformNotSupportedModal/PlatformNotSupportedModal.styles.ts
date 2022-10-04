import styled from "styled-components";

export const BrowserList = styled.div`
  margin: 1.4rem 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: start;
  font-size: 1rem;
  gap: 12px 20px;
`;

export const BrowserListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: keep-all;

  & > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;
