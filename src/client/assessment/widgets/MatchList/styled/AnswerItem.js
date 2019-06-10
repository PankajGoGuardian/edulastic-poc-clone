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
  .drag-drop-item-match-list {
    img {
      max-width: 165px !important;
      max-height: 110px !important;
      width: auto !important;
    }
  }
  & > div:nth-child(3) {
    width: calc(50% - 50px);
    align-self: stretch;
  }
`;

AnswerItem.displayName = "AnswerItem";
