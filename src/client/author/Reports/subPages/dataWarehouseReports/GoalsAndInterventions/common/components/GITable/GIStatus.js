import React, { useState } from 'react'
import { Select } from 'antd'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { StyledDropDown } from './styled-components'
import './index.scss'
import {
  statusTextColors,
  goalStatusOptions,
  interventionStatusOptions,
  IN_PROGRESS,
} from '../../../constants/common'
import { GOAL, INTERVENTION } from '../../../constants/form'
import { ucFirst, titleCase } from '../../utils'
import ConfirmModal from '../ConfirmModal'

const OptionLabel = ({ label }) => {
  return (
    <span
      style={{
        color: statusTextColors[label],
      }}
    >
      {ucFirst((label || '').replace('_', ' '))}
    </span>
  )
}

const GIStatus = ({ status, GIData, updateGIData }) => {
  const type = GIData.goalCriteria ? GOAL : INTERVENTION
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [selectedStatusValue, setSelectedStatusValue] = useState({
    key: status,
    label: ucFirst((status || '').replace('_', ' ')),
  })
  const [toUpdateStatusValue, setToUpdateStatusValue] = useState({
    key: status,
    label: ucFirst((status || '').replace('_', ' ')),
  })

  const { key: updateStatuskey } = toUpdateStatusValue
  const { key: selectedStatusKey } = selectedStatusValue
  const statusOptions =
    type === GOAL ? goalStatusOptions : interventionStatusOptions

  const handleModalCancelClick = () => {
    setIsConfirmationModalOpen(false)
  }

  const handleModalConfirmClick = () => {
    setIsConfirmationModalOpen(false)
    const {
      key: toUpdateStatusKey,
      label: toUpdateStatusLabel,
    } = toUpdateStatusValue
    setSelectedStatusValue({
      toUpdateStatusKey,
      label: ucFirst((toUpdateStatusLabel || '').replace('_', ' ')),
    })

    updateGIData({
      formType: type,
      ...GIData,
      status: toUpdateStatusKey,
      isStatusUpdate: true,
    })
  }

  const handleStatusChange = (value) => {
    const { key, label } = value
    setToUpdateStatusValue({
      key,
      label: ucFirst((label || '').replace('_', ' ')),
    })
    setIsConfirmationModalOpen(true)
  }

  return (
    <>
      <ConfirmModal
        visible={isConfirmationModalOpen}
        onOk={handleModalConfirmClick}
        onCancel={handleModalCancelClick}
        message={
          <>
            Are you sure you want to change the status to{' '}
            {<OptionLabel label={updateStatuskey} />}?
            <br />
            You will not be able to edit this {ucFirst(titleCase(type))}{' '}
            further!
          </>
        }
      />
      <EduIf condition={selectedStatusKey === IN_PROGRESS}>
        <EduThen>
          <StyledDropDown
            value={selectedStatusValue}
            onChange={handleStatusChange}
            optionLabelProp="label"
            labelInValue
          >
            {statusOptions.map(({ key, label }) => {
              return (
                <Select.Option
                  data-cy={key}
                  key={key}
                  value={key}
                  label={label}
                >
                  <OptionLabel label={label} />
                </Select.Option>
              )
            })}
          </StyledDropDown>
        </EduThen>
        <EduElse>
          <OptionLabel label={status} />
        </EduElse>
      </EduIf>
    </>
  )
}

export default GIStatus
