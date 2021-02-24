import React, { useState } from 'react'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  TextAreaInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

const SubsLicenseViewModal = ({
  isVisible,
  closeModal,
  extendTrialEndDate,
  currentLicense,
}) => {
  const { startDate, endDate, userId } = currentLicense
  const [fieldData, setFieldData] = useState({
    subStartDate: new Date(startDate).getTime(),
    subEndDate: new Date(endDate).getTime(),
    customerSuccessManager: '',
    opportunityId: '',
    notes: '',
  })

  const disabledEndDate = (current) => current && current < moment(startDate)

  const handleFieldChange = (fieldName) => (value) => {
    const updatedFieldData = { ...fieldData, [fieldName]: value }
    setFieldData(updatedFieldData)
  }

  const handleValidateFields = () => {
    extendTrialEndDate({
      ...fieldData,
      subType: 'TRIAL_PREMIUM',
      userIds: [userId],
    })
  }

  const footer = (
    <>
      <EduButton isGhost onClick={closeModal}>
        CANCEL
      </EduButton>
      <EduButton onClick={handleValidateFields}>APPLY</EduButton>
    </>
  )

  return (
    <CustomModalStyled
      visible={isVisible}
      title="View Subscription"
      onCancel={closeModal}
      footer={footer}
      centered
    >
      <StyledFieldRow>
        <Row gutter={20}>
          <Col span={12}>
            <FieldLabel>Start Date</FieldLabel>
            <DatePickerStyled
              style={{ width: '100%' }}
              placeholder="Set a start date"
              format="DD-MM-YYYY"
              showTime
              data-cy="subStartDate"
              disabled={startDate}
              value={
                (fieldData.subStartDate && moment(fieldData.subStartDate)) || ''
              }
              onChange={(date) =>
                handleFieldChange('subStartDate')(date?.valueOf() || '')
              }
            />
          </Col>
          <Col span={12}>
            <FieldLabel>End Date</FieldLabel>
            <DatePickerStyled
              style={{ width: '100%' }}
              placeholder="Set an end date"
              format="DD-MM-YYYY"
              showTime
              data-cy="subEndDate"
              disabledDate={disabledEndDate}
              value={
                (fieldData.subEndDate && moment(fieldData.subEndDate)) || ''
              }
              onChange={(date) =>
                handleFieldChange('subEndDate')(date?.valueOf() || '')
              }
            />
          </Col>
        </Row>
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>CS Manager</FieldLabel>
        <TextInputStyled
          placeholder="Type the CS Manager"
          value={fieldData.customerSuccessManager || ''}
          onChange={(e) =>
            handleFieldChange('customerSuccessManager')(e.target.value)
          }
        />
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Opportunity Id</FieldLabel>
        <TextInputStyled
          placeholder="Type the ID"
          value={fieldData.opportunityId || ''}
          onChange={(e) => handleFieldChange('opportunityId')(e.target.value)}
        />
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Notes</FieldLabel>
        <TextAreaInputStyled
          height="80px"
          placeholder="Type notes..."
          value={fieldData.notes || ''}
          onChange={(e) => handleFieldChange('notes')(e.target.value)}
        />
      </StyledFieldRow>
    </CustomModalStyled>
  )
}

export default SubsLicenseViewModal

const StyledFieldRow = styled.div`
  margin-bottom: 15px;
`
