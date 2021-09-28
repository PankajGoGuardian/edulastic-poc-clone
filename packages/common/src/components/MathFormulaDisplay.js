import styled, { withTheme } from 'styled-components'
import { desktopWidth } from '@edulastic/colors'
import { fonts } from '@edulastic/constants'

import { withMathFormula } from '../HOC/withMathFormula'

const MathFormulaDisplay = withTheme(
  withMathFormula(styled.div.attrs({
    className: 'math-formula-display',
  })`
    width: ${(props) => !props.centerContent && '100%'};
    overflow-wrap: ${(props) => props.centerContent && 'initial'};
    font-size: ${(props) => props.fontSize || props.theme.fontSize};
    font-weight: ${fonts.previewFontWeight};
    padding-left: ${(props) => props.paddingLeft && '50px'};
    text-align: ${(props) => props.align};

    & * {
      display: inline;
    }

    table {
      display: table;
    }

    table thead {
      display: table-header-group;
    }

    table tbody {
      display: table-row-group;
    }

    table tr {
      display: table-row;
    }

    table td,
    th {
      display: table-cell;
    }

    p {
      -moz-padding-inline-end: 10px;
      -webkit-padding-inline-end: 10px;
      padding-inline-end: 10px;
      display: block;
    }

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  `)
)

export default MathFormulaDisplay
