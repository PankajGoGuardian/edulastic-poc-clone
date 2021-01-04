import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel, TextInputStyled } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const AllowedVariablesPure = ({ allowedVariables, onChange }) => {
  const [allowAllowedVariables, setAllowAllowedVariables] = useState(false)

  useEffect(() => {
    if (allowedVariables) {
      setAllowAllowedVariables(true)
    }
  }, [allowedVariables])

  const onChangeHandler = (e) => {
    const { value } = e.target
    onChange('allowedVariables', (value.match(/[a-zA-Z],?/g) || []).join(''))
  }

  const onChangeCheckbox = (e) => {
    setAllowAllowedVariables(e.target.checked)
    if (!e.target.checked) {
      onChange('allowedVariables', null)
    }
  }

  const onBlurInput = (e) => {
    onChange(
      'allowedVariables',
      (e.target.value || '')
        .split(',')
        .filter((el) => !!el)
        .join()
    )
  }

  return (
    <AllowedVariablesWrapper>
      <CheckboxLabel
        data-cy="answer-allowed-variables"
        checked={allowAllowedVariables}
        onChange={onChangeCheckbox}
      />
      <TextInputStyled
        size="large"
        width="50px"
        margin="0px 18px 0px 16px"
        padding="0px 4px"
        data-cy="allowed-variables"
        value={allowedVariables}
        disabled={!allowAllowedVariables}
        onChange={onChangeHandler}
        onBlur={onBlurInput}
      />
      <LabelWithHelper optionKey="allowedVariables" />
    </AllowedVariablesWrapper>
  )
}

AllowedVariablesPure.propTypes = {
  allowedVariables: PropTypes.string,
  onChange: PropTypes.func,
}

AllowedVariablesPure.defaultProps = {
  allowedVariables: '',
  onChange: () => null,
}

export default AllowedVariablesPure

const AllowedVariablesWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
