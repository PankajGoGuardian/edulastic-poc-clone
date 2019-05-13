import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";

export const AnswerItem = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 8px;
  & > div:nth-child(1) {
    width: calc(50% - 50px);
    align-self: stretch;
  }
  & > div:nth-child(2) {
    width: 50px;
  }
  & > div:nth-child(3) {
    width: calc(50% - 50px);
    align-self: stretch;
  }
  img {
    max-width: 100%;
  }
`;

AnswerItem.displayName = "AnswerItem";
