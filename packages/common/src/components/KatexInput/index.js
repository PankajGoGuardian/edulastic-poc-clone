import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextInputStyled, FieldLabel, FlexContainer } from '@edulastic/common'
import { IconQuestionCircle } from '@edulastic/icons'
import { withMathFormula } from '../../HOC/withMathFormula'
import { getMathHtml } from '../../utils/mathUtils'

const KatexInput = ({ value, onInput }) => {
  const [katexHtml, setKatexHtml] = useState('')
  const [latex, setLatex] = useState('')

  useEffect(() => {
    setLatex(value)
    setKatexHtml(getMathHtml(value))
  }, [])

  useEffect(() => {
    if (value !== latex) {
      setLatex(value)
    }
  }, [value])

  const onChange = (pLatex) => {
    setLatex(pLatex)
    setKatexHtml(getMathHtml(pLatex))
    onInput(pLatex)
  }

  return (
    <KatexInputWrapper>
      <TextInputStyled
        value={latex}
        margin="0px 15px"
        width="calc(100% - 30px)"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter math expressions in latex. See the examples for additional help."
      />
      <LatextPreviewTitle justifyContent="space-between">
        <FieldLabel>Preview</FieldLabel>
        <HelpLabel>
          <IconQuestionCircle />
          Latex help
        </HelpLabel>
      </LatextPreviewTitle>
      <LatexPreview dangerouslySetInnerHTML={{ __html: katexHtml }} />
      {!value && (
        <PreviewPlaceHolder>Math preview will be shown here</PreviewPlaceHolder>
      )}
    </KatexInputWrapper>
  )
}

KatexInput.propTypes = {
  value: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
}

KatexInput.defaultProps = {}

export default withMathFormula(KatexInput)

const KatexInputWrapper = styled.div`
  min-width: 520px;
  min-height: 350px;
  position: relative;
`

const LatextPreviewTitle = styled(FlexContainer)`
  margin-top: 15px;
  border-top: 1px solid #e8e8e8;
  padding: 12px 15px 0px;
`

const HelpLabel = styled(FieldLabel)`
  color: #1ab395;
  display: flex;
  align-items: center;
  & svg {
    fill: #1ab395;
    margin-right: 8px;
    &:hover {
      fill: #1ab395;
    }
  }
`

const LatexPreview = styled.div`
  padding: 15px;
  .katex-display {
    text-align: left !important;
  }

  .katex-display .katex {
    text-align: left !important;
  }
`

const PreviewPlaceHolder = styled(FieldLabel)`
  color: #8b939e;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -60%);
`
