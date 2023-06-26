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
      {data.map((d) => {
        return (
          <StyledCheckBox key={d.level} value={d.level}>
            <Label value={d} />
          </StyledCheckBox>
        )
      })}
    </Checkbox.Group>
  )
}

export default CheckBoxDropdown
