import React, { useState } from 'react'
import { Select, Tooltip } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { StyledDropDown } from './styled-components'
import {
  NOT_STARTED,
  statusTextColors,
  goalStatusOptions,
  interventionStatusOptions,
  IN_PROGRESS,
} from '../../../constants/common'
import { GOAL, INTERVENTION } from '../../../constants/form'
import { ucFirst, getDaysLeft, titleCase } from '../../utils'
import ConfirmModal from '../ConfirmModal'

const OptionLabel = ({ label, statusKey, isEnded, isDropDownOpen, type }) => {
  return (
    <Tooltip
      placement="top"
      title={
        isDropDownOpen && statusKey === IN_PROGRESS && isEnded
          ? `The status cannot be changed to In progress as the duration of ${ucFirst(
              titleCase(type)
            )} is over`
          : null
      }
    >
      <p
        style={{
          color: statusTextColors[label],
        }}
      >
        {ucFirst((label || '').replace('_', ' '))}
      </p>
    </Tooltip>
  )
}

const GIStatus = ({ status, GIData, updateGIData }) => {
  const { startDate, endDate } = GIData
  const type = GIData.goalCriteria ? GOAL : INTERVENTION
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [statusValue, setStatusValue] = useState(status)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)

  const statusOptions =
    type === GOAL ? goalStatusOptions : interventionStatusOptions

  const isEnded = getDaysLeft(startDate, endDate) <= 0

  const handleModalCancelClick = () => {
    setIsConfirmationModalOpen(false)
  }

  const handleModalConfirmClick = () => {
    setIsConfirmationModalOpen(false)
    updateGIData({
      formType: type,
      ...GIData,
      status: statusValue,
      isStatusUpdate: true,
    })
  }

  const handleStatusChange = (value) => {
    setStatusValue(value)
    setIsConfirmationModalOpen(true)
  }

  const handleDropDownVisibleChange = (value) => {
    setIsDropDownOpen(value)
  }

  return (
    <>
      <ConfirmModal
        visible={isConfirmationModalOpen}
        onOk={handleModalConfirmClick}
        onCancel={handleModalCancelClick}
        message="Are you sure you want to change the status?"
      />
      <EduIf condition={status === NOT_STARTED}>
        <EduThen>
          <OptionLabel label={status} />
        </EduThen>
        <EduElse>
          <StyledDropDown
            value={status}
            onChange={handleStatusChange}
            onDropdownVisibleChange={handleDropDownVisibleChange}
          >
            {statusOptions.map(({ key, label }) => (
              <Select.Option
                data-cy={key}
                key={key}
                value={key}
                disabled={key === IN_PROGRESS && isEnded}
              >
                <OptionLabel
                  label={label}
                  statusKey={key}
                  isEnded={isEnded}
                  isDropDownOpen={isDropDownOpen}
                  type={type}
                />
              </Select.Option>
            ))}
          </StyledDropDown>
        </EduElse>
      </EduIf>
    </>
  )
}

export default GIStatus
