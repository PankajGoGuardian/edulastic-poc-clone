import React, { useState, useMemo } from 'react'
import { Spin } from 'antd'
import { debounce, keyBy } from 'lodash'
import { userApi } from '@edulastic/api'
import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
} from '@edulastic/common'
import { CheckboxWrpper } from './styled'

const sanitizeSearchResult = (users = [], existingUsersInList = []) => {
  const result = []
  const existingUsersInListByEmail = keyBy(existingUsersInList)
  for (const user of users) {
    const { email } = user?._source || {}
    if (email) {
      if (!existingUsersInListByEmail[email]) {
        result.push(email)
      }
    }
  }
  return result
}

const loaderStyles = { height: '30px' }

const AddUsersModal = ({
  isVisible,
  onCancel,
  addAndUpgradeUsers,
  districtId,
  subsLicenses,
  teacherPremiumProductId,
  sparkMathProductId,
  users,
}) => {
  const [fieldValue, setFieldValue] = useState([])
  const [checkboxValues, setCheckboxValues] = useState([])
  const [usersList, setUsersList] = useState([])
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)

  const handleOnChange = (value) => setFieldValue(value)
  const handleAddUsers = () => {
    if (fieldValue.length) {
      addAndUpgradeUsers({
        userDetails: fieldValue.map((value) => value.trim()),
        licenses: checkboxValues,
      })
      onCancel()
    }
  }

  const {
    premiumLicenseId,
    sparkMathLicenseId,
    isSparkCheckboxDisbled,
  } = useMemo(() => {
    let _premiumLicenseId = ''
    let _sparkMathLicenseId = ''
    let _isPremiumCheckboxChecked = ''
    let _sparkAvailableCount = ''
    for (const {
      productId,
      linkedProductId,
      licenseId,
      totalCount,
      usedCount,
    } of subsLicenses) {
      if (productId === teacherPremiumProductId) {
        _premiumLicenseId = licenseId
        _isPremiumCheckboxChecked = checkboxValues.includes(licenseId)
      }
      if ([linkedProductId, productId].includes(sparkMathProductId)) {
        _sparkMathLicenseId = licenseId
      }
      _sparkAvailableCount = totalCount - usedCount
    }
    const _isSparkCheckboxDisbled =
      _isPremiumCheckboxChecked && _sparkAvailableCount
    return {
      premiumLicenseId: _premiumLicenseId,
      sparkMathLicenseId: _sparkMathLicenseId,
      isSparkCheckboxDisbled: _isSparkCheckboxDisbled,
    }
  }, [
    subsLicenses,
    teacherPremiumProductId,
    sparkMathProductId,
    checkboxValues,
  ])

  const handleOnCheck = (value) => {
    const list = value.includes(premiumLicenseId) ? value : []
    setCheckboxValues(list)
  }

  const fetchUsers = async (searchString) => {
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
        status: 1,
      }
      const { result } = await userApi.fetchUsers(searchData)
      const addedUsersEmails = users.map((x) => x.email)
      const _users = sanitizeSearchResult(result, addedUsersEmails)
      setUsersList(_users)
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

  return (
    <CustomModalStyled
      visible={isVisible}
      title="Add User(s)"
      onCancel={onCancel}
      centered
      modalWidth="520px"
      footer={[
        <>
          <EduButton
            isGhost
            height="40px"
            width="200px"
            data-cy="closeAddUsersModalBtn"
            onClick={onCancel}
          >
            NO, CANCEL
          </EduButton>
          <EduButton
            height="40px"
            width="200px"
            data-cy="yesAddUsersModalBtn"
            onClick={handleAddUsers}
            disabled={!fieldValue.length}
          >
            YES, ADD User(s)
          </EduButton>
        </>,
      ]}
    >
      <div>
        <p className="label">Invite for premium access</p>
        <SelectInputStyled
          data-cy="addUsersInputField"
          placeholder="Email IDs (separated by comma)"
          mode="tags"
          size="large"
          notFoundContent={null}
          filterOption={false}
          onSearch={handleUsersSearch}
          value={fieldValue}
          onChange={handleOnChange}
          getPopupContainer={(e) => e.parentNode}
        >
          {isFetchingUsers ? (
            <SelectInputStyled.Option key="loader" style={loaderStyles}>
              <Spin />
            </SelectInputStyled.Option>
          ) : (
            usersList.map((emailId) => (
              <SelectInputStyled.Option key={emailId}>
                {emailId}
              </SelectInputStyled.Option>
            ))
          )}
        </SelectInputStyled>
        <CheckboxWrpper>
          <CheckBoxGrp value={checkboxValues} onChange={handleOnCheck}>
            <CheckboxLabel
              data-cy="teacherPremiumCheckbox"
              value={premiumLicenseId}
              disabled={!premiumLicenseId.length}
            >
              Upgrade to Premium
            </CheckboxLabel>
            <CheckboxLabel
              data-cy="sparkMathPremiumCheckbox"
              value={sparkMathLicenseId}
              disabled={!isSparkCheckboxDisbled}
            >
              Access Spark Math
            </CheckboxLabel>
          </CheckBoxGrp>
        </CheckboxWrpper>
      </div>
    </CustomModalStyled>
  )
}

export default AddUsersModal
