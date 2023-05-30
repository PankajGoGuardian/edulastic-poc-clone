import { Checkbox, Tooltip } from 'antd'
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
        const shouldCheckboxBeDisabled =
          defaultValues.length === 1 && defaultValues.includes(d.level)
        const tooltipText = shouldCheckboxBeDisabled
          ? 'Please select at least one risk band.'
          : ''
        return (
          <Tooltip title={tooltipText}>
            <StyledCheckBox
              key={d.level}
              value={d.level}
              disabled={shouldCheckboxBeDisabled}
            >
              <Label value={d} />
            </StyledCheckBox>
          </Tooltip>
        )
      })}
    </Checkbox.Group>
  )
}

export default CheckBoxDropdown
