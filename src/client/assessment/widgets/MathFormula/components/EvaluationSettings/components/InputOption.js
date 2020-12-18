import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel, TextInputStyled } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const validations = {
  tolerance: (value = '') => {
    if (!value) {
      return true
    }
    return /^\+?(0|[1-9]\d*)?%?$/.test(value)
  },
  isIn: (value = '') => {
    if (!value) {
      return true
    }
    return /^-?\+?(0|[1-9]\d*)?%?$/.test(value)
  },
  satisfies: (value = '') => {
    if (!value) {
      return true
    }
    return /^-?\+?(0|[1-9]\d*)?%?$/.test(value)
  },
}

const InputOption = ({ options, onChange, optionKey, inputType }) => {
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
      valid = validations[optionKey](e.target.value)
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
        <TextInputStyled
          size="large"
          width="50px"
          margin="0px 18px 0px 0px"
          padding="0px 4px"
          type={inputType}
          value={options[optionKey]}
          disabled={!isAllowed}
          onChange={onChangeInput}
        />
        <LabelWithHelper optionKey={optionKey} />
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
