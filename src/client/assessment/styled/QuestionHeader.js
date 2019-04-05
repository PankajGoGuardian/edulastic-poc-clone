import styled from "styled-components";
import { WithMathFormula } from "@edulastic/common";

export const QuestionHeader = WithMathFormula(
  styled.div`
    font-size: 15px;
    color: #434b5d;
    line-height: 1.63;
    margin-bottom: 10px;
    padding: 10px 20px;
    label {
      font-size: 16px;
      font-weight: 700;
      margin-right: 10px;
    }
  `
);
// ?Original style
// export const QuestionHeader = WithMathFormula(
//   styled.div`
//     font-size: ${({ smallSize, theme }) =>
//       smallSize ? theme.common.questionHeaderSmallFontSize : theme.common.questionHeaderFontSize};
//     color: ${props => props.theme.common.questionHeaderColor};
//     line-height: 1.63;
//     margin-bottom: ${({ smallSize }) => (smallSize ? "10px" : "25px")};
//     &:before {
//       content: "Q:";
//       font-weight: bold;
//       margin-right: 5px;
//     }
//   `
// );
