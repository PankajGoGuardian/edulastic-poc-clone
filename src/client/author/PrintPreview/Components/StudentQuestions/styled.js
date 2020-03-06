import styled from "styled-components";
import { someGreyColor1, mobileWidthMax } from "@edulastic/colors";

export const QuestionDiv = styled.div`
  position: relative;
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  position: relative;

  border-bottom: 1px solid ${someGreyColor1};
  break-inside: avoid;
  >div {
    break-inside: avoid;
  }
`;
