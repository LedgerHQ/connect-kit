import styled from "styled-components";

export const CardWrapper = styled.div`
  margin: 0 1rem;
  display: flex;
  flex-direction: row;
  margin-bottom: 1.2rem;
`;

export const CardContent = styled.div`
  border-radius: 12px;
  padding: 1.2em;
  padding-bottom: 1.6em;
  background: #000;
`;

export const CardHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const CardFooter = styled.div`
  margin-top: 1rem;
  display: flex;
  flex: 1;
  align-items: center;
`;

export const CardTitle = styled.h1`
  font-size: 2rem;
  line-height: 2.4rem;
  color: #fff;
  font-weight: 400;
  margin-block-end: 0;
  margin-bottom: 0.5rem;
`;

export const CardSubtitle = styled.p`
  font-size: 1rem;
  color: #fff;
  margin-block-end: 0;
  margin-block-start: 0;
  margin-bottom: 0.5rem;
`;

export const CardFooterText = styled.h4`
  font-size: 1.3rem;
  color: #fff;
  margin-left: 0.5rem;
  font-weight: 400;
`;
