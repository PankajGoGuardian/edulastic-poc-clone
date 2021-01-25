import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel, TextInputStyled, FieldLabel } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'
import { validations } from './inputsValidations'

const InputOption = ({ options, onChange, optionKey, isGraph }) => {
  const [isAllowed, setIsAllowed] = useState(false)

  const onChangeCheckbox = (e) => {
    setIsAllowed(e.target.checked)
    if (!e.target.checked) {
      onChange(optionKey, null)
    }
  }

  const onChangeInput = (e) => {
    let valid = true
    if (validations[optionKey]) {
      valid = validations[optionKey](e.target.value, isGraph)
    }
    if (valid) {
      onChange(optionKey, e.target.value)
    }
  }

  useEffect(() => {
    if (options[optionKey]) {
      setIsAllowed(true)
    }
  }, [options[optionKey]])

  return (
    <InputOptionWrapper>
      <CheckboxLabel
        data-cy={`"answer-${optionKey}`}
        checked={isAllowed}
        labelPadding="0px 16px"
        onChange={onChangeCheckbox}
      >
        {optionKey === 'significantDecimalPlaces' && (
          <FieldLabel display="inline-block" mr="18px">
            must be rounded to
          </FieldLabel>
        )}
        <TextInputStyled
          size="large"
          width="50px"
          margin="0px 18px 0px 0px"
          padding="0px 4px"
          value={options[optionKey]}
          disabled={!isAllowed}
          onChange={onChangeInput}
        />
        <LabelWithHelper optionKey={optionKey} isGraph={isGraph} />
      </CheckboxLabel>
    </InputOptionWrapper>
  )
}

InputOption.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

InputOption.defaultProps = {}

export default InputOption

const InputOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
