import styled, { css } from "styled-components";
import { WithMathFormula } from "@edulastic/common";
import { smallDesktopWidth } from "@edulastic/colors";

const Style = css`
  background: transparent;
  font-family: ${props => props.theme.defaultFontFamily};
  font-size: ${props => props.theme.questionTextnormalFontSize};
  color: ${props => props.theme.titleColor};
  font-weight: normal;
  font-style: normal;
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
  ${Style}

  div:nth-of-type(1) {
    display: contents;
  }

  @media (max-width: ${smallDesktopWidth}) {
    word-break: break-all;
  }
`);
