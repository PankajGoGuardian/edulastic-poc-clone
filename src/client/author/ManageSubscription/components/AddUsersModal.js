import React, { useState, useMemo } from 'react'
import { Spin } from 'antd'
import { debounce } from 'lodash'
import { userApi } from '@edulastic/api'
import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  SelectInputStyled,
} from '@edulastic/common'
import { CheckboxWrpper } from './styled'

const sanitizeSearchResult = (data = []) => data.map((x) => x?._source?.email)

const AddUsersModal = ({ isVisible, onCancel, addUsers, districtId }) => {
  const [fieldValue, setFieldValue] = useState([])
  const [checkboxValues, setCheckboxValues] = useState([])
  const [fetching, setFetching] = useState(false)
  const [usersList, setUsersList] = useState([])

  const handleOnChange = (value) => setFieldValue(value)
  const handleOnCheck = (value) => setCheckboxValues(value)

  const notFoundContent = useMemo(
    () => (fetching ? <Spin size="small" /> : null),
    [fetching]
  )

  const handleAddUsers = () => {
    if (fieldValue) {
      addUsers({ districtId, userDetails: fieldValue })
      onCancel()
    }
  }

  const fetchUsers = async (searchString) => {
    try {
      if (!searchString) return
      setFetching(true)
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
      setFetching(false)
      const users = sanitizeSearchResult(result)
      setUsersList(users)
    } catch (e) {
      setFetching(false)
      setUsersList([])
      console.warn(e)
    }
  }

  const handleUsersSearch = debounce(fetchUsers, 200)

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
          notFoundContent={notFoundContent}
          filterOption={false}
          onSearch={handleUsersSearch}
          value={fieldValue}
          onChange={handleOnChange}
          getPopupContainer={(e) => e.parentNode}
        >
          {usersList.map((emailId) => (
            <SelectInputStyled.Option key={emailId}>
              {emailId}
            </SelectInputStyled.Option>
          ))}
        </SelectInputStyled>
        <CheckboxWrpper>
          <CheckBoxGrp value={checkboxValues} onChange={handleOnCheck}>
            <CheckboxLabel
              data-cy="teacherPremiumCheckbox"
              value="teacherPremium"
            >
              Upgrade to Premium
            </CheckboxLabel>
            <CheckboxLabel
              data-cy="sparkMathPremiumCheckbox"
              value="sparkMathPremium"
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
