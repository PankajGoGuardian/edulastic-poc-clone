import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CheckboxLabel, TextInputStyled } from '@edulastic/common'
import LabelWithHelper from './LabelWithHelper'

const AllowedUnits = ({ options, onChange }) => {
  const [allowedUnits, setAllowedUnits] = useState(false)

  useEffect(() => {
    if (options.allowedUnits) {
      setAllowedUnits(true)
    }
  }, [options.allowedUnits])

  const onChangeCheckbox = (e) => {
    setAllowedUnits(e.target.checked)
    if (!e.target.checked) {
      onChange('allowedUnits', null)
    }
  }

  const onChangeInput = (e) => onChange('allowedUnits', e.target.value)

  return (
    <InputOptionWrapper>
      <CheckboxLabel
        data-cy="answer-allowed-units"
        checked={allowedUnits}
        labelPadding="0px 16px"
        onChange={onChangeCheckbox}
      />
      <TextInputStyled
        data-cy="answer-allowed-units"
        size="large"
        width="50px"
        margin="0px 18px 0px 16px"
        padding="0px 4px"
        value={options.allowedUnits}
        disabled={!allowedUnits}
        readOnly={!allowedUnits}
        onChange={onChangeInput}
      />
      <LabelWithHelper optionKey="allowedUnits" />
    </InputOptionWrapper>
  )
}

AllowedUnits.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

AllowedUnits.defaultProps = {}

export default AllowedUnits

const InputOptionWrapper = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`
