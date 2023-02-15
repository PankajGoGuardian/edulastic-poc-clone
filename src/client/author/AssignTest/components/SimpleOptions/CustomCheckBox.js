import React from 'react'
import { CheckboxLabel, Div, CheckBoxInput } from './styled'

const CustomCheckbox = ({
  onChange,
  checked,
  label,
  disabled,
  height,
  width,
}) => {
  const onClickHandler = () => {
    if (!disabled) {
      onChange()
    }
  }
  return (
    <CheckboxLabel data-cy="multi" disabled={disabled}>
      <CheckBoxInput
        type="checkbox"
        onClick={onClickHandler}
        checked={checked}
      />
      {label && (
        <Div height={height} width={width}>
          <span>{label}</span>
        </Div>
      )}
    </CheckboxLabel>
  )
}

export default CustomCheckbox
