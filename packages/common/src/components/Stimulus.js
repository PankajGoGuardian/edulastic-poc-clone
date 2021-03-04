import styled, { withTheme } from 'styled-components'
import { desktopWidth } from '@edulastic/colors'
import { fonts } from '@edulastic/constants'

import { withMathFormula } from '../HOC/withMathFormula'

const Stimulus = withTheme(
  withMathFormula(styled.div`
    margin-bottom: 15px;
    img {
      max-height: unset !important;
    }
    word-break: break-word;
    font-size: ${(props) => props.fontSize};
    font-weight: ${fonts.previewFontWeight};
    user-select: ${(props) => (props.userSelect ? 'text !important' : 'none')};

    & * {
      user-select: ${(props) =>
        props.userSelect ? 'text !important' : 'none'};
      -webkit-touch-callout: none;
    }

    & *:not(a) {
      color: ${({ theme }) => theme.questionTextColor};
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
