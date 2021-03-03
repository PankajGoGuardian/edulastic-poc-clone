import React, { useState } from 'react'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  notification,
  NumberInputStyled,
  SelectInputStyled,
  TextAreaInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Row, Spin } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import { debounce } from 'lodash'
import { userApi } from '@edulastic/api'

const sanitizeSearchResult = (data = []) => data.map((x) => x?._source?.email)

const AddSubscriptionModal = ({
  isVisible,
  closeModal,
  isFetchingOrganization,
  districtList,
  searchRequest,
}) => {
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [startDate, setStartDate] = useState(moment())
  const [fieldData, setFieldData] = useState({
    districtId: '',
    districtName: '',
    orgType: 'user',
    managerEmail: [],
    subStartDate: moment().valueOf(),
    subEndDate: moment().add(1, 'years').valueOf(),
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
    const updatedFieldData = {
      ...fieldData,
      [fieldName]:
        fieldName === 'premiumLicense' || fieldName === 'sparkMathLicense'
          ? Math.floor(value)
          : value,
    }
    setFieldData(updatedFieldData)
  }

  const fetchUsers = async (searchString) => {
    const { districtId } = fieldData
    try {
      if (!searchString) return
      const searchData = {
        districtId,
        search: {
          email: [{ type: 'cont', value: searchString }],
        },
        limit: 25,
        page: 1,
        role: 'teacher',
      }
      const { result } = await userApi.fetchUsers(searchData)
      const users = sanitizeSearchResult(result)
      setUsersList(users)
    } catch (e) {
      setUsersList([])
      console.warn(e)
    } finally {
      setIsFetchingUsers(false)
    }
  }

  const handleUsersFetch = debounce(fetchUsers, 800)

  const handleUsersSearch = (searchString) => {
    setIsFetchingUsers(true)
    handleUsersFetch(searchString)
  }

  const handleSelectDistrict = (value, option) => {
    const { value: districtId, name: districtName } = option.props

    // resetting all the org fields as we are changing the organization(district)
    setFieldData({
      ...fieldData,
      districtId,
      districtName,
      managerEmail: [],
    })
  }

  const handleSearch = (searchString, searchType, size) => {
    if (!fieldData.districtId && searchType !== 'DISTRICT')
      return notification({ messageKey: 'pleaseSelectDistrict' })
    const data = {
      orgType: searchType,
      searchString,
    }
    if (size) {
      data.size = size
    }
    if (searchType !== 'DISTRICT') data.districtId = fieldData.districtId
    searchRequest(data)
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
          filterOption={false}
          showSearch
          notFoundContent={
            isFetchingOrganization ? <Spin size="small" /> : null
          }
          value={fieldData.districtId}
          onSearch={(d) => handleSearch(d, 'DISTRICT', 50)}
          onFocus={() =>
            !fieldData.districtName && handleSearch('', 'DISTRICT', 50)
          }
          onChange={handleSelectDistrict}
        >
          {(isFetchingOrganization ? [] : districtList)
            .sort((a, b) => {
              const _aName = (a.name || '').toLowerCase()
              const _bName = (b.name || '').toLowerCase()
              return _aName.localeCompare(_bName)
            })
            .map(({ _id, name }) => (
              <SelectInputStyled.Option key={_id} value={_id} name={name}>
                {name}
              </SelectInputStyled.Option>
            ))}
        </SelectInputStyled>
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Manager Email (Bookkeeper)</FieldLabel>
        <SelectInputStyled
          data-cy="managerEmailInputField"
          placeholder="Enter the Manager Email IDs"
          mode="multiple"
          filterOption={false}
          onSearch={handleUsersSearch}
          value={fieldData.managerEmail || []}
          onChange={(value) => handleFieldChange('managerEmail')(value)}
          getPopupContainer={(e) => e.parentNode}
          disabled={!fieldData.districtId}
          notFoundContent={isFetchingUsers ? <Spin size="small" /> : null}
        >
          {usersList.map((emailId) => (
            <SelectInputStyled.Option key={emailId}>
              {emailId}
            </SelectInputStyled.Option>
          ))}
        </SelectInputStyled>
      </StyledFieldRow>
      <StyledFieldRow>
        <Row gutter={20}>
          <Col span={24}>
            <h3>Products</h3>
          </Col>
          <Col span={12}>
            <FieldLabel>Premium</FieldLabel>
            <NumberInputStyled
              type="number"
              style={{ width: '100%' }}
              placeholder="premium license"
              value={fieldData.premiumLicense}
              min={0}
              onChange={(value) => handleFieldChange('premiumLicense')(value)}
            />
          </Col>
          <Col span={12}>
            <FieldLabel>SparkMath</FieldLabel>
            <NumberInputStyled
              type="number"
              style={{ width: '100%' }}
              placeholder="sparkMath license"
              value={fieldData.sparkMathLicense}
              min={0}
              onChange={(value) => handleFieldChange('sparkMathLicense')(value)}
            />
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
  .ant-select-dropdown-menu-item-disabled {
    padding: 15px 0px;
  }
`
