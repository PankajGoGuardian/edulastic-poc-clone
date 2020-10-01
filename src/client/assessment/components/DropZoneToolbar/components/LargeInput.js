import { FlexContainer, TextInputStyled, FieldLabel } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'

const LargeInput = ({ value, onChange, type, label, ...restProps }) => (
  <FlexContainer justifyContent="flex-start" alignItems="center">
    <TextInputStyled
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...restProps}
    />
    <FieldLabel ml="16px">{label}</FieldLabel>
  </FlexContainer>
)

LargeInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default LargeInput
