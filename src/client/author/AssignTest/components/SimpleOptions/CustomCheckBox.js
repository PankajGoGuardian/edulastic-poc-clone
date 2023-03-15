import React from 'react'
import { capitalize } from 'lodash'
import { CheckboxLabel, Div, CheckBoxInput } from './styled'

const CustomCheckbox = ({
  onChange,
  checked,
  label,
  disabled,
  height,
  width,
  title,
}) => {
  const onClickHandler = () => {
    if (!disabled) {
      onChange()
    }
  }
  return (
    <CheckboxLabel
      data-cy="multi"
      disabled={disabled}
      title={capitalize(title)}
    >
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
