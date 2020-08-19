import styled, { css } from "styled-components";
import { WithMathFormula } from "@edulastic/common";
import { smallDesktopWidth } from "@edulastic/colors";

const Style = css`
  background: transparent !important;
  font-family: ${props => props.theme.defaultFontFamily} !important;
  font-size: ${props => props.theme.questionTextnormalFontSize} !important;
  color: ${props => props.theme.questionTextColor} !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none;
`;

export const Stimulus = WithMathFormula(styled.div`
  color: ${props => props.theme.questionTextColor};
  margin-top: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 15px;
  height: ${({ isCollapse }) => isCollapse && "25px"};

  & *:not(.edu) {
    ${Style}
  }
  p {
    margin-left: 0 !important;
    -moz-padding-inline-end: ${({ isCollapse }) => (isCollapse ? "10px" : "0px")};
    -webkit-padding-inline-end: ${({ isCollapse }) => (isCollapse ? "10px" : "0px")};
    padding-inline-end: ${({ isCollapse }) => (isCollapse ? "10px" : "0px")};
  }

  * {
    display: ${({ isCollapse }) => isCollapse && "inline"};
    margin: 0;
    padding: 0;
  }

  div:nth-of-type(1) {
    display: contents;
  }

  @media (max-width: ${smallDesktopWidth}) {
    word-break: break-all;
  }
`);
