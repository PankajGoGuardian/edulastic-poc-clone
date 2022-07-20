import React, { useState, useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { roleuser, signUpState } from '@edulastic/constants'
import {
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getOrgSchools,
  getUser,
  getUserOrgId,
} from '../../../author/src/selectors/user'

const TeacherSignup = loadable(
  () => import('../../../student/Signup/components/TeacherContainer/Container'),
  {
    fallback: <Spin />,
  }
)

const AuthorCompleteSignupButton = ({
  userInfo,
  user = {},
  renderButton,
  onClick,
  trackClick,
  isOpenSignupModal = false,
  setShowCompleteSignupModal,
  setCallFunctionAfterSignup,
  orgSchools = [],
  userOrgId,
  privateParams,
  subType,
  interestedSubjects = [],
  interestedGrades = [],
  onMouseDown = () => {},
  onSuccessCallback,
  triggerSource = '',
}) => {
  const { currentSignUpState: signupStatus, orgData = {} } = user
  const { classList = [] } = orgData
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)
  const [didSchoolModalOpen, setDidSchoolModalOpen] = useState(false)
  const toggleSchoolModal = (value) => setIsSchoolModalVisible(value)

  const isCanvasUserSchoolNotSelected =
    (userInfo.signupStatus === signUpState.SCHOOL_NOT_SELECTED ||
      userInfo.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL) &&
    user?.openIdProvider === 'canvas'

  const isSchoolSignupOnly = !!(
    orgSchools.length === 0 &&
    !!userOrgId &&
    roleuser.TEACHER === user.role &&
    !isCanvasUserSchoolNotSelected
  )

  const handleCanel = (value) => {
    setShowCompleteSignupModal(false)
    setCallFunctionAfterSignup(() => null)
    toggleSchoolModal(value)
    setDidSchoolModalOpen(value)
  }

  useEffect(() => {
    if (
      isSchoolModalVisible &&
      signupStatus === signUpState.DONE &&
      orgSchools.length > 0
    ) {
      toggleSchoolModal(false)
      onClick(subType)
    }
  }, [signupStatus, orgSchools])

  useEffect(() => {
    setIsSchoolModalVisible(isOpenSignupModal)
  }, [isOpenSignupModal])

  const handleClick = () => {
    const hasNoPreferences =
      roleuser.TEACHER === user.role &&
      interestedSubjects.length === 0 &&
      interestedGrades.length === 0 &&
      classList.length === 0
    if (
      signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
      hasNoPreferences ||
      isSchoolSignupOnly ||
      isCanvasUserSchoolNotSelected
    ) {
      if (user.districtIds && user.districtIds.length === 0) {
        setDidSchoolModalOpen(true)
      }
      trackClick()
      toggleSchoolModal(true)
      return
    }

    return onClick(subType)
  }
  const _privateParams = useMemo(() =>
    signupStatus !== signUpState.ACCESS_WITHOUT_SCHOOL ? privateParams : {}
  )

  return (
    <>
      {renderButton(handleClick, _privateParams)}
      {isSchoolModalVisible && (
        <TeacherSignup
          isModal
          handleCancel={() => handleCanel(false)}
          isVisible={isSchoolModalVisible}
          isSchoolSignupOnly={isSchoolSignupOnly}
          onMouseDown={onMouseDown}
          onSuccessCallback={onSuccessCallback}
          triggerSource={triggerSource}
          didSchoolModalOpen={didSchoolModalOpen}
          allowCanvas={isCanvasUserSchoolNotSelected}
        />
      )}
    </>
  )
}

AuthorCompleteSignupButton.propTypes = {
  user: PropTypes.object.isRequired,
  renderButton: PropTypes.func,
  onClick: PropTypes.func,
  trackClick: PropTypes.func,
  setShowCompleteSignupModal: PropTypes.func,
  setCallFunctionAfterSignup: PropTypes.func,
  onSuccessCallback: PropTypes.func,
  privateParams: PropTypes.object,
}

AuthorCompleteSignupButton.defaultProps = {
  onClick: () => null,
  trackClick: () => null,
  renderButton: () => null,
  setShowCompleteSignupModal: () => null,
  setCallFunctionAfterSignup: () => null,
  onSuccessCallback: () => null,
  privateParams: {},
}

const enhance = compose(
  connect((state) => ({
    userInfo: state.user,
    user: getUser(state),
    orgSchools: getOrgSchools(state),
    userOrgId: getUserOrgId(state),
    interestedSubjects: getInterestedSubjectsSelector(state),
    interestedGrades: getInterestedGradesSelector(state),
  }))
)

export default enhance(AuthorCompleteSignupButton)
