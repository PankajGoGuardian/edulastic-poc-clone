import React from 'react'
import { MathFormulaDisplay } from '@edulastic/common'

export default () => (
  <MathFormulaDisplay
    dangerouslySetInnerHTML={{
      __html: `<span class="input__math" data-latex="\\pi"></span>`,
    }}
  />
)
