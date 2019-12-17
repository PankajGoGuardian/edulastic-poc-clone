import styled, { css } from "styled-components";
import { WithMathFormula } from "@edulastic/common";
import { smallDesktopWidth } from "@edulastic/colors";

const Style = css`
  background: transparent !important;
  font-family: ${props => props.theme.defaultFontFamily} !important;
  font-size: ${props => props.theme.questionTextnormalFontSize} !important;
  color: ${props => props.theme.titleColor} !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none;
`;

export const Stimulus = WithMathFormula(styled.div`
  color: #444444;
  margin-top: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 15px;
  height: ${({ isCollapse }) => isCollapse && "25px"};
  ${Style}
  span,
  p,
  em,
  u,
  b,
  strong {
    ${Style}
  }
  p {
    margin-left: 0 !important;
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
