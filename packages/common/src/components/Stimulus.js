import styled, { withTheme } from 'styled-components'
import { desktopWidth } from '@edulastic/colors'
import { fonts } from '@edulastic/constants'

import { withMathFormula } from '../HOC/withMathFormula'

const Stimulus = withTheme(
  withMathFormula(styled.div`
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
      // @see EV-34179 | strong, em tag need to inherit color (if text color selected from froala) of parent tag
      strong,
      em {
        color: inherit !important;
      }
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
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-35090
       * table cell shows all content in one line
       */
      @media print {
        & td {
          white-space: normal;
        }
      }
    }
  `)
)

export default Stimulus
