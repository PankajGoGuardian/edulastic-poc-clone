import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";

export const AnswerItem = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 8px;
  .__prevent-page-break {
    width: 100%;
  }
`;

AnswerItem.displayName = "AnswerItem";
