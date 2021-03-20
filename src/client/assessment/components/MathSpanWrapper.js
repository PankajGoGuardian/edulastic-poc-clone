import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WithMathFormula } from '@edulastic/common'

const MathSpanWrapper = ({ latex }) => {
  const template = `<span><span class="input__math" data-latex="${latex}"></span></span>`
  return <MathSpan dangerouslySetInnerHTML={{ __html: template }} />
}

MathSpanWrapper.propTypes = {
  latex: PropTypes.string.isRequired,
}

export default MathSpanWrapper

const MathSpan = WithMathFormula(styled.span`
  position: relative;

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
    padding-top: 15px;
    padding-bottom: 15px;
  }

  & .input__math[contenteditable='false'] * {
    color: #ffff00;
  }
`)
