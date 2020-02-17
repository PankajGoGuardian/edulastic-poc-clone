import styled from "styled-components";

import {
  white,
  secondaryTextColor,
  themeColor,
  green,
  red,
  greyishDarker1,
  extraDesktopWidthMax,
  smallDesktopWidth,
  inputBorder,
  whiteSmoke
} from "@edulastic/colors";

const getBackground = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : white;

const getBorder = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColor) : greyishDarker1;

export const QuestionChunk = styled.div`
  min-width: 180px;
  &:not(:last-child) {
    margin-bottom: 5px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    min-width: 145px;
  }
`;

export const QuestionOption = styled.span`
  display: inline-block;
  min-width: 32px;
  height: 32px;
  border: 1px solid ${getBorder};
  font-size: 13px;
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
    min-width: 32px;
    height: 32px;
    font-size: 13px;
    line-height: 30px;
  }
`;

export const QuestionText = styled.p`
  margin: 0;
  font-size: 14px;
  padding: 10px 0;
  width: ${({ check }) => (check ? "210px" : "178px")};
  border: 1px solid ${inputBorder};
  border-radius: 4px;
  padding: 4px 11px;
  background: ${whiteSmoke};
  color: rgba(0, 0, 0, 0.25); /* TODO: re-visit once mockup is updated */
`;
