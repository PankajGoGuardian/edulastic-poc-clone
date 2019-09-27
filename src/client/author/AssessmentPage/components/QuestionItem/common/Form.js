import styled from "styled-components";

import { white, secondaryTextColor, themeColorLight, green, red, greyishDarker1 } from "@edulastic/colors";

const getBackground = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColorLight) : white;

const getBorder = ({ selected, checked, correct }) =>
  selected ? (checked ? (correct ? green : red) : themeColorLight) : greyishDarker1;

export const QuestionChunk = styled.div`
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const QuestionOption = styled.span`
  display: inline-block;
  min-width: 36px;
  height: 36px;
  padding-top: 10px;
  border: 1px solid ${getBorder};
  font-size: 10px;
  text-align: center;
  color: ${({ selected }) => (selected ? white : secondaryTextColor)};
  background: ${getBackground};
  cursor: ${({ review, mode }) => (review && mode !== "report" ? "pointer" : "default")};
  border-radius: ${({ multipleResponses }) => (!multipleResponses ? "50%" : null)};
  &:not(:last-child) {
    margin-right: 5px;
  }
`;

export const QuestionText = styled.p`
  margin: 0;
  font-size: 14px;
  padding: 10px 0;
`;
