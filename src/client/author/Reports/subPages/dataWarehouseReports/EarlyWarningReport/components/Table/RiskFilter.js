import React, { useState } from 'react'
import { Icon, Popover } from 'antd'
import { IconFilter } from '@edulastic/icons'
import CheckBoxDropdown from '../../../../../common/components/CheckBoxDropdown'
import { riskCheckBoxDropdownOptions, tableFilterTypes } from '../../utils'
import { StyledEduButton } from '../../../common/components/styledComponents'
import CheckBoxLabel from './CheckBoxLabel'

const RiskFilter = ({ tableFilters, setTableFilters }) => {
  const [showPopover, setShowPopover] = useState(false)

  const handlePopoverChange = (newOpen) => {
    setShowPopover(newOpen)
  }
  const handleCheckBoxChange = (selections) => {
    setTableFilters({
      ...tableFilters,
      [tableFilterTypes.RISK]: selections,
      [tableFilterTypes.PAGE]: 1,
    })
    setShowPopover(false)
  }

  return (
    <Popover
      content={
        <CheckBoxDropdown
          Label={CheckBoxLabel}
          data={riskCheckBoxDropdownOptions}
          handleChange={handleCheckBoxChange}
          defaultValues={tableFilters[tableFilterTypes.RISK]}
        />
      }
      trigger="click"
      placement="bottom"
      visible={showPopover}
      onVisibleChange={handlePopoverChange}
    >
      <StyledEduButton isGhost>
        <IconFilter />
        Filter Risk
        <Icon type={showPopover ? 'up' : 'down'} />
      </StyledEduButton>
    </Popover>
  )
}

export default RiskFilter
