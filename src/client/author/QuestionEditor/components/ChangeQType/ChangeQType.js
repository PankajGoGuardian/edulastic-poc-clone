import React from 'react'
import { IconCaretDown } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import {
  StyledPopoverContainer,
  StyledDropdownContainer,
  StyledPopoverContentContainer,
} from './styled'
import SelectQTypeOption from './SelectQTypeOption'

const ChangeQType = ({
  children,
  onQuestionTypeSelect,
  handlePopupVisibilityChange,
  isQuestionTypeChangePopupVisible,
}) => {
  return (
    <Tooltip title="Click to change question type" placement="right">
      <StyledPopoverContainer
        placement="bottomLeft"
        trigger="click"
        visible={isQuestionTypeChangePopupVisible}
        onVisibleChange={(value) => {
          handlePopupVisibilityChange(value)
        }}
        content={
          <StyledPopoverContentContainer>
            <SelectQTypeOption onQuestionTypeSelect={onQuestionTypeSelect} />
          </StyledPopoverContentContainer>
        }
      >
        {children}
        <StyledDropdownContainer>
          <IconCaretDown height="12px" width="12px" color={themeColor} />
        </StyledDropdownContainer>
      </StyledPopoverContainer>
    </Tooltip>
  )
}

export default ChangeQType
