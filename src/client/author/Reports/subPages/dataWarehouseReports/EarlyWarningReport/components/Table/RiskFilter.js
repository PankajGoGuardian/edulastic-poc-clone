import React, { useState } from 'react'
import { Icon, Popover } from 'antd'
import { IconFilter } from '@edulastic/icons'
import { EduButton } from '@edulastic/common'
import CheckBoxDropdown from '../../../../../common/components/CheckBoxDropdown'
import { riskCheckBoxDropdownOptions, tableFilterTypes } from '../../utils'
import { StyledEduButton } from '../../../common/components/styledComponents'
import CheckBoxLabel from './CheckBoxLabel'

const RiskFilter = ({ tableFilters, setTableFilters }) => {
  const [showPopover, setShowPopover] = useState(false)
  const [selected, setSelected] = useState(tableFilters[tableFilterTypes.RISK])
  const [isApplyDisabled, setIsApplyDisabled] = useState(false)

  const handlePopoverChange = (newOpen) => {
    setShowPopover(newOpen)
  }
  const handleCheckBoxChange = (selections) => {
    if (!selections.length) {
      setIsApplyDisabled(true)
    } else setIsApplyDisabled(false)
    setSelected(selections)
  }

  const handleClick = () => {
    setTableFilters({
      ...tableFilters,
      [tableFilterTypes.RISK]: selected,
      [tableFilterTypes.PAGE]: 1,
    })
    setShowPopover(false)
  }

  const applyButtonTitle = isApplyDisabled
    ? 'Please select at least one risk band.'
    : ''

  return (
    <Popover
      content={
        <>
          <CheckBoxDropdown
            Label={CheckBoxLabel}
            data={riskCheckBoxDropdownOptions}
            handleChange={handleCheckBoxChange}
            defaultValues={tableFilters[tableFilterTypes.RISK]}
          />
          <EduButton
            width="60px"
            height="27px"
            onClick={handleClick}
            disabled={isApplyDisabled}
            title={applyButtonTitle}
          >
            APPLY
          </EduButton>
        </>
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
