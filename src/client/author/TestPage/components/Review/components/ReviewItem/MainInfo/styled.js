import styled, { css } from 'styled-components'
import { IconInfo } from '@edulastic/icons'
import { WithMathFormula, NumberInputStyled } from '@edulastic/common'
import { smallDesktopWidth } from '@edulastic/colors'

export const ScoreInputWrapper = styled.div`
  position: relative;
`

export const InfoIcon = styled(IconInfo)`
  cursor: pointer;
  position: absolute;
  top: -6px;
  right: 4px;
`

const Style = css`
  background: transparent !important;
  font-family: ${(props) => props.theme.defaultFontFamily} !important;
  font-size: ${(props) => props.theme.questionTextnormalFontSize} !important;
  color: ${(props) => props.theme.questionTextColor} !important;
  font-weight: normal !important;
  font-style: normal !important;
  text-decoration: none;
`

export const NumberInputStyledTestPage = styled(NumberInputStyled)`
  .ant-input-number-handler-wrap:hover
    ~ .ant-input-number-input-wrap
    > .ant-input-number-input {
    padding-right: 45%;
  }
`
export const Stimulus = WithMathFormula(styled.div`
  color: ${(props) => props.theme.questionTextColor};
  margin-top: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 15px;
  flex: 1;
  text-align: left;
  padding-top: 3px;

  & *:not(.edu) {
    ${Style}
  }

  p {
    margin-left: 0 !important;
    padding-inline-end: 10px;
  }

  * {
    display: inline;
    margin: 0;
    padding: 0;
  }

  div:nth-of-type(1) {
    display: contents;
  }

  img {
    display: block; /* it is required, images do not show up otherwise */
    max-width: 100%;
  }

  @media (max-width: ${smallDesktopWidth}) {
    word-break: break-all;
  }
`)
