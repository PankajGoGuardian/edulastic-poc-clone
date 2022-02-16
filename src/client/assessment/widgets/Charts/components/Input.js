import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextInputStyled } from '../../../styled/InputStyles'

export const CustomInput = ({
  type,
  value: propsValue,
  index,
  handleChange,
}) => {
  const [currentValue, setCurrentValue] = useState(null)

  useEffect(() => {
    if (propsValue !== currentValue) setCurrentValue(propsValue)
  }, [propsValue])

  const handleBlur = () => {
    handleChange(index)('value', currentValue)
  }

  return (
    <TextInputStyled
      type={type}
      height="32px"
      value={currentValue}
      onChange={(e) => setCurrentValue(+e.target.value)}
      onBlur={handleBlur}
      disabled={false}
    />
  )
}

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  handleChange: PropTypes.func.isRequired,
}
