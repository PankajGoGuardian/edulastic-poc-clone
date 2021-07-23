import React from 'react'
import styled from 'styled-components'
import { withMathFormula } from '../HOC/withMathFormula'

const CustomKeyLabel = ({ value }) => {
  if ((value || '').includes('\\')) {
    return (
      <CustomLabel
        dangerouslySetInnerHTML={{
          __html: `<span class="input__math" data-latex="${value}"></span>`,
        }}
      />
    )
  }
  return value
}

const CustomLabel = withMathFormula(styled.span`
  .input__math {
    min-width: auto;
    border: none;
    padding: 0px;
    font-size: 1rem;
    white-space: nowrap;
  }
`)

export default CustomKeyLabel
