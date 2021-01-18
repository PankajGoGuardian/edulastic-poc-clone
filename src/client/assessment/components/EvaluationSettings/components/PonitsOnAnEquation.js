import React, { useState, useEffect } from 'react'
import {
  FlexContainer,
  CheckboxLabel,
  TextInputStyled,
  MathInput,
  FieldLabel,
} from '@edulastic/common'
import { HeadingLabel } from './InlineCheckOptions'
import LabelWithHelper from './LabelWithHelper'
import { validations } from './inputsValidations'

const PonitsOnAnEquation = ({ optionKey, options, onChange }) => {
  const [isAllowed, setIsAllowed] = useState(false)
  const [localLatex, setLocalLatex] = useState('')

  const onChangeCheckbox = (e) => {
    setIsAllowed(e.target.checked)
    if (!e.target.checked) {
      onChange('ponitsOnAnEquation', null)
    }
  }

  const onChangeInput = (e) => {
    let valid = true
    if (validations[optionKey]) {
      valid = validations[optionKey](e.target.value)
    }
    if (valid) {
      onChange('points', e.target.value)
    }
  }

  const onChangeMath = (latex) => {
    setLocalLatex(latex)
  }

  const handleBlurMath = () => {
    onChange('latex', localLatex)
  }

  useEffect(() => {
    if (options.points || options.latex) {
      setIsAllowed(true)
    }
    setLocalLatex(options.latex)
  }, [options])

  return (
    <FlexContainer flexDirection="column">
      <HeadingLabel>
        <LabelWithHelper optionKey={optionKey} />
      </HeadingLabel>
      <FlexContainer justifyContent="flex-start" alignItems="center">
        <FlexContainer alignItems="center">
          <CheckboxLabel
            onChange={onChangeCheckbox}
            checked={isAllowed}
            labelPadding="0px 6px 0px 12px"
          >
            <span>student needs to identify</span>
          </CheckboxLabel>
          <TextInputStyled
            size="large"
            width="50px"
            margin="0px 6px 0px 0px"
            padding="0px 4px"
            type="number"
            min={1}
            value={options.points}
            disabled={!isAllowed}
            onChange={onChangeInput}
          />
        </FlexContainer>
        <FlexContainer alignItems="center">
          <FieldLabel marginBottom="0px" mr="6px">
            unique points on an equation
          </FieldLabel>
          <MathInput
            value={localLatex}
            style={{ width: '90px', marginLeft: '14px' }}
            symbols={['basic']}
            onInput={onChangeMath}
            onBlur={handleBlurMath}
            hideKeypad={false}
            disabled={!isAllowed}
            showResponse={false}
          />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}

export default PonitsOnAnEquation
