import styled from "styled-components";
import { Paper } from "@edulastic/common";
import { mobileWidth } from "@edulastic/colors";

export const Container = styled(Paper)`
  ${props => props.padding && `padding:${props.padding};`}
  ${props => props.borderRadius && `border-radius:${props.borderRadius};`}
  width: 100%;
  margin-bottom: 20px;
  background: ${props => props.theme.questionMetadata.containerBackground};
  box-shadow: none;
  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
      display: flex;
      flex-direction: column;
    }
  }
`;
