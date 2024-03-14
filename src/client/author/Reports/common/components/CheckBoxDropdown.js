import { Checkbox } from 'antd'
import React from 'react'
import { StyledCheckBox } from '../styled'

const CheckBoxDropdown = ({
  data = [],
  Label,
  handleChange,
  defaultValues,
}) => {
  return (
    <Checkbox.Group onChange={handleChange} defaultValue={defaultValues}>
      {data.map((checkBoxItem) => {
        return (
          <StyledCheckBox key={checkBoxItem.label} value={checkBoxItem.label}>
            <Label value={checkBoxItem} />
          </StyledCheckBox>
        )
      })}
    </Checkbox.Group>
  )
}

export default CheckBoxDropdown
