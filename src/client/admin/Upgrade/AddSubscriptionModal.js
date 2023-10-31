import { userApi } from '@edulastic/api'
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
import { debounce, isNumber, omitBy } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SUBSCRIPTION_DEFINITION_TYPES } from '../Data'

const sanitizeSearchResult = (data = []) => data.map((x) => x?._source?.email)

const AddSubscriptionModal = ({
  isVisible,
  closeModal,
  isFetchingOrganization,
  districtList,
  addSubscription,
  products,
  handleSelectDistrict,
  handleSearch,
  setFieldData,
  fieldData,
  editLicense,
  currentLicense,
  licenseId,
  licenseOwnerId,
  totalTpLicenseCount,
  isEdited,
  setIsEdited,
}) => {
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [startDate, setStartDate] = useState(moment())

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
    if (editLicense) setIsEdited(true)
    setFieldData((prev) => ({
      ...prev,
      [fieldName]: isNumber(value) ? Math.round(value) : value,
    }))
  }

  useEffect(() => {
    if (!editLicense)
      products.forEach((x) => {
        const initialFieldValue = 0
        handleFieldChange(x.type)(initialFieldValue)
      })
  }, [products, editLicense])

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

  const handleValidateFields = () => {
    const {
      managerEmail = [],
      subStartDate,
      subEndDate,
      customerSuccessManager,
      opportunityId,
      notes,
      districtId,
    } = fieldData
    if (subStartDate >= subEndDate) {
      return notification({
        type: 'warn',
        msg: `StartDate cannot be greater or equal to EndDate!`,
      })
    }
    if (!managerEmail.length) {
      return notification({
        type: 'warn',
        msg: `Atleast one bookkeeper's email is required!`,
      })
    }
    const _products = products.reduce(
      (a, c) => ({
        ...a,
        [c._id]: fieldData[c.type] ? fieldData[c.type] : undefined,
      }),
      {}
    )

    const requiredFields = [
      'subStartDate',
      'subEndDate',
      'customerSuccessManager',
      'notes',
    ]

    for (const field of requiredFields) {
      if (!fieldData[field]) {
        return notification({
          type: 'warn',
          msg: `${field} is required!`,
        })
      }
    }

    const data = {
      products: _products,
      userEmailIds: managerEmail,
      subStartDate,
      subEndDate,
      customerSuccessManager,
      opportunityId,
      notes,
      districtId,
      editLicense,
      licenseOwnerId,
      licenseId,
    }

    const payload = omitBy(data, (x) => !x)
    addSubscription(payload)
    closeModal()
  }

  const handleKeyPress = (e) => {
    const specialCharRegex = new RegExp('[0-9\b\t]+') // allow numbers, backspace and tab
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode)
    if (!specialCharRegex.test(pressedKey)) {
      return e.preventDefault()
    }
    return pressedKey
  }

  const sortProducts = (product1, product2) => product1.order - product2.order

  const footer = (
    <>
      <EduButton data-cy="cancelButton" isGhost onClick={closeModal}>
        CANCEL
      </EduButton>
      <EduButton
        data-cy="applyButton"
        onClick={handleValidateFields}
        disabled={editLicense && !isEdited}
      >
        APPLY
      </EduButton>
    </>
  )

  return (
    <CustomModalStyled
      visible={isVisible}
      title={editLicense ? 'Edit License' : 'Add Subscription'}
      onCancel={closeModal}
      footer={footer}
      centered
    >
      <StyledFieldRow>
        <FieldLabel>Organization</FieldLabel>
        <SelectInputStyled
          data-cy="searchOrganisation"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          style={{ width: '100%' }}
          placeholder="Search for an organization"
          filterOption={false}
          showSearch
          disabled={editLicense}
          notFoundContent={
            isFetchingOrganization ? <Spin size="small" /> : null
          }
          value={editLicense ? fieldData.districtName : fieldData.districtId}
          onSearch={(d) => handleSearch(d, 'DISTRICT', 50)}
          onFocus={() =>
            !fieldData.districtName && handleSearch('', 'DISTRICT', 50)
          }
          onChange={handleSelectDistrict}
        >
          {(isFetchingOrganization ? [] : districtList)
            ?.sort((a, b) => {
              const _aName = (a.name || '').toLowerCase()
              const _bName = (b.name || '').toLowerCase()
              return _aName.localeCompare(_bName)
            })
            .map(({ _id, name }) => (
              <SelectInputStyled.Option
                key={_id}
                value={_id}
                name={name}
                data-cy={name}
              >
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
            <SelectInputStyled.Option key={emailId} data-cy={emailId}>
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
          {products.sort(sortProducts).map((product) => (
            <Col span={12} key={product._id} style={{ marginBottom: '15px' }}>
              <FieldLabel>{product.name}</FieldLabel>
              <NumberInputStyled
                type="number"
                style={{ width: '100%' }}
                placeholder={`${product.name.toLowerCase()} license`}
                value={fieldData[product.type]}
                min={editLicense ? currentLicense.usedCount || 1 : 0}
                max={
                  product.type === SUBSCRIPTION_DEFINITION_TYPES.PREMIUM
                    ? Infinity
                    : editLicense
                    ? totalTpLicenseCount
                    : fieldData.PREMIUM
                }
                onChange={(value) => handleFieldChange(product.type)(value)}
                data-cy={product.type}
                onKeyDown={handleKeyPress}
              />
            </Col>
          ))}
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
          data-cy="csManagerInput"
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
          data-cy="oppurtunityIdInput"
          placeholder="Type the ID"
          value={fieldData.opportunityId || ''}
          onChange={(e) => handleFieldChange('opportunityId')(e.target.value)}
        />
      </StyledFieldRow>
      <StyledFieldRow>
        <FieldLabel>Notes</FieldLabel>
        <TextAreaInputStyled
          dat-cy="notesInput"
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
