import styled, { withTheme } from 'styled-components'
import { desktopWidth } from '@edulastic/colors'
import { fonts } from '@edulastic/constants'

import { withMathFormula } from '../HOC/withMathFormula'

const Stimulus = withTheme(
  withMathFormula(styled.div`
    line-height: 1;
    word-break: break-word;
    font-weight: ${fonts.previewFontWeight};
    user-select: ${(props) => (props.userSelect ? 'text !important' : 'none')};

    img {
      max-height: unset !important;
    }

    & * {
      user-select: ${(props) =>
        props.userSelect ? 'text !important' : 'none'};
      -webkit-touch-callout: none;
    }

    & *:not(a) {
      color: #ffff00;
    }

    & .input__math[contenteditable='false'] {
      background-color: #464646;
      opacity: 0.6;
      background-image: linear-gradient(135deg, #000000 25%, transparent 25%),
        linear-gradient(225deg, #000000 25%, transparent 25%),
        linear-gradient(45deg, #000000 25%, transparent 25%),
        linear-gradient(315deg, #000000 25%, #464646 25%);
      background-position: 20px 0, 20px 0, 0 0, 0 0;
      background-size: 20px 20px;
      background-repeat: repeat;
      padding: 5px;
    }

    & .input__math,
    & .katex-display,
    & .katex,
    & .input__math * {
      user-select: none !important;
      pointer-events: none !important;
      -webkit-touch-callout: none !important;
    }

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }

    /**
  * @see https://snapwiz.atlassian.net/browse/EV-11832
  * some math content clipped off, so we need to add space at top
  */
    & p {
      margin: 0;
      padding-top: 2px;
    }

    &.migrated-question {
      img {
        /**
        * @see https://snapwiz.atlassian.net/browse/EV-13239
        * some migrated questions has images that contains text for title.
        */
        max-width: unset !important;
      }
    }

    /**
   * @see https://snapwiz.atlassian.net/browse/EV-22888
   * words breaking into single character each line
   */
    & table {
      word-break: normal;
    }
  `)
)

export default Stimulus
