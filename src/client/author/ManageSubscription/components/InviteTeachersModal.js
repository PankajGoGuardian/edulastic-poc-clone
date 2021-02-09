import React, { useState } from 'react'
import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  EduButton,
  TextAreaInputStyled,
} from '@edulastic/common'
import { ModalBody, CheckboxWrpper } from './styled'

const InviteTeachersModal = ({
  isVisible,
  onCancel,
  addTeachers,
  districtId,
}) => {
  const [fieldValue, setFieldValue] = useState('')
  const [checkboxValues, setCheckboxValues] = useState([])

  const handleOnChange = (ele) => setFieldValue(ele.value)
  const handleOnCheck = (value) => setCheckboxValues(value)

  const handleInviteTeachers = () => {
    if (fieldValue && fieldValue !== '') {
      const userDetails = fieldValue.replace(/\s/g, '').split(/,|\n/)
      addTeachers({ districtId, userDetails })
      onCancel()
    }
  }

  return (
    <CustomModalStyled
      visible={isVisible}
      title="Add Teachers"
      onCancel={onCancel}
      centered
      modalWidth="520px"
      footer={[
        <>
          <EduButton
            isGhost
            height="40px"
            width="200px"
            data-cy="closeInviteTeachersModalBtn"
            onClick={onCancel}
          >
            NO, CANCEL
          </EduButton>
          <EduButton
            height="40px"
            width="200px"
            data-cy="yesInviteTeachersModalBtn"
            onClick={handleInviteTeachers}
            disabled={fieldValue === ''}
          >
            YES, ADD TEACHERS
          </EduButton>
        </>,
      ]}
    >
      <ModalBody>
        <p className="label">Invite for premium access</p>
        <TextAreaInputStyled
          value={fieldValue}
          onChange={(e) => handleOnChange(e.target)}
          placeholder="Email IDs (separated by comma)"
          data-cy="inviteTeacherInputField"
          height="110px"
        />
        <CheckboxWrpper>
          <CheckBoxGrp
            value={checkboxValues}
            onChange={(value) => handleOnCheck(value)}
          >
            <CheckboxLabel value="teacherPremium">
              Upgrade to Premium
            </CheckboxLabel>
            <CheckboxLabel value="sparkMathPremium">
              Access Spark Math
            </CheckboxLabel>
          </CheckBoxGrp>
        </CheckboxWrpper>
      </ModalBody>
    </CustomModalStyled>
  )
}

export default InviteTeachersModal
