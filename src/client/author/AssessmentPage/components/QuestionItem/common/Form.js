import styled from "styled-components";

import {
  white,
  secondaryTextColor,
  themeColor,
  green,
  red,
  greyishDarker1,
  extraDesktopWidthMax
} from "@edulastic/colors";

const getBackground = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : white;

const getBorder = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : greyishDarker1;

export const QuestionChunk = styled.div`
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const QuestionOption = styled.span`
  display: inline-block;
  min-width: 32px;
  height: 32px;
  border: 1px solid ${getBorder};
  font-size: 10px;
  margin-bottom: 2px;
  text-align: center;
  line-height: 30px;
  color: ${({ selected }) => (selected ? white : secondaryTextColor)};
  background: ${getBackground};
  cursor: ${({ review, mode }) => (review && mode !== "report" ? "pointer" : "default")};
  border-radius: ${({ multipleResponses }) => (!multipleResponses ? "50%" : null)};
  &:not(:last-child) {
    margin-right: 4px;
  }
  font-weight: bold;
  @media (min-width: ${extraDesktopWidthMax}) {
    min-width: 36px;
    height: 36px;
    font-size: ${props => props.theme.questionTextextraFontSize};
    line-height: 34px;
  }
`;

export const QuestionText = styled.p`
  margin: 0;
  font-size: 14px;
  padding: 10px 0;
  width: ${({ check }) => check && "210px"};
`;
