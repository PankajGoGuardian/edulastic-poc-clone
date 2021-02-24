import React, { useState } from 'react'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  notification,
  SelectInputStyled,
  TextAreaInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

const permissionLevelOptions = [
  { label: 'District', value: 'DISTRICT' },
  { label: 'School', value: 'SCHOOL' },
  { label: 'User', value: 'USER' },
]

const AddSubscriptionModal = ({ isVisible, closeModal }) => {
  const [startDate, setStartDate] = useState(moment())
  const [fieldData, setFieldData] = useState({
    organization: '',
    permissionLevel: '',
    managerEmail: '',
    subStartDate: new Date().getTime(),
    subEndDate: '',
    csManager: '',
    opportunityId: '',
    notes: '',
    premiumLicense: '',
    sparkMathLicense: '',
  })

  const disabledStartDate = (current) =>
    current && current < moment().subtract(1, 'day')
  const disabledEndDate = (current) => current && current < moment(startDate)

  const handleFieldChange = (fieldName) => (value) => {
    if (fieldName === 'subStartDate') {
      setStartDate(value)
      if (fieldData?.subEndDate && value >= fieldData?.subEndDate) {
        return notification({
          messageKey: 'startDateShouldBeLessThanTheEndDate',
        })
      }
    }
    const updatedFieldData = { ...fieldData, [fieldName]: value }
    setFieldData(updatedFieldData)
  }

  const handleValidateFields = () => {
    console.log('fieldData', fieldData)
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
      title="Add Subscription"
      onCancel={closeModal}
      footer={footer}
      centered
    >
      <StyledFieldRow>
        <FieldLabel>Organization</FieldLabel>
        <SelectInputStyled
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          style={{ width: '100%' }}
          placeholder="Search for an organization"
          value={fieldData.organization}
          filterOption={false}
          onChange={(value) => handleFieldChange('organization')(value)}
        >
          <SelectInputStyled.Option key={1} value={1}>
            org1
          </SelectInputStyled.Option>
        </SelectInputStyled>
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Permission Level</FieldLabel>
        <SelectInputStyled
          style={{ width: '100%' }}
          placeholder="Select a permission"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          value={fieldData.permissionLevel}
          onChange={(value) => handleFieldChange('permissionLevel')(value)}
        >
          {permissionLevelOptions.map((option) => (
            <SelectInputStyled.Option value={option.value}>
              {option.label}
            </SelectInputStyled.Option>
          ))}
        </SelectInputStyled>
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Manager Email</FieldLabel>
        <TextInputStyled
          placeholder="Type the Manager Email"
          value={fieldData.managerEmail || ''}
          onChange={(e) => handleFieldChange('managerEmail')(e.target.value)}
        />
      </StyledFieldRow>
      <StyledFieldRow>
        <Row gutter={20}>
          <Col span={24}>
            <h3>Products</h3>
          </Col>
          <Col span={12}>
            <FieldLabel>Premium</FieldLabel>
            <SelectInputStyled
              style={{ width: '100%' }}
              placeholder="premium license"
              value={fieldData.premiumLicense}
              onChange={(value) => handleFieldChange('premiumLicense')(value)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <SelectInputStyled.Option value="1">1</SelectInputStyled.Option>
            </SelectInputStyled>
          </Col>
          <Col span={12}>
            <FieldLabel>SparkMath</FieldLabel>
            <SelectInputStyled
              style={{ width: '100%' }}
              placeholder="sparkMath license"
              value={fieldData.sparkMathLicense}
              onChange={(value) => handleFieldChange('sparkMathLicense')(value)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <SelectInputStyled.Option value="1">1</SelectInputStyled.Option>
            </SelectInputStyled>
          </Col>
        </Row>
      </StyledFieldRow>
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
              disabledDate={disabledStartDate}
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
          value={fieldData.csManager || ''}
          onChange={(e) => handleFieldChange('csManager')(e.target.value)}
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

export default AddSubscriptionModal

const StyledFieldRow = styled.div`
  margin-bottom: 15px;
`
