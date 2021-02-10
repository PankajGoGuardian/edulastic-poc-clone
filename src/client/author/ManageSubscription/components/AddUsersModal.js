import React, { useState } from 'react'
import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  TextAreaInputStyled,
} from '@edulastic/common'
import { CheckboxWrpper } from './styled'

const AddUsersModal = ({ isVisible, onCancel, addUsers, districtId }) => {
  const [fieldValue, setFieldValue] = useState('')
  const [checkboxValues, setCheckboxValues] = useState([])

  const handleOnChange = (ele) => setFieldValue(ele.target.value)
  const handleOnCheck = (value) => setCheckboxValues(value)

  const handleAddUsers = () => {
    if (fieldValue) {
      const userDetails = fieldValue.replace(/\s/g, '').split(/,|\n/)
      addUsers({ districtId, userDetails })
      onCancel()
    }
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
            disabled={fieldValue === ''}
          >
            YES, ADD User(s)
          </EduButton>
        </>,
      ]}
    >
      <div>
        <p className="label">Invite for premium access</p>
        <TextAreaInputStyled
          value={fieldValue}
          onChange={handleOnChange}
          placeholder="Email IDs (separated by comma)"
          data-cy="addUsersInputField"
          height="110px"
        />
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
