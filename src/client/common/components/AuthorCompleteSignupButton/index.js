import React, { useState, useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { roleuser, signUpState } from '@edulastic/constants'
import {
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
}) => {
  const { currentSignUpState: signupStatus } = user
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)
  const toggleSchoolModal = (value) => setIsSchoolModalVisible(value)

  const isSchoolSignupOnly = !!(
    orgSchools.length === 0 &&
    !!userOrgId &&
    roleuser.TEACHER === user.role
  )

  const handleCanel = (value) => {
    setShowCompleteSignupModal(false)
    setCallFunctionAfterSignup(() => null)
    toggleSchoolModal(value)
  }

  useEffect(() => {
    if (
      isSchoolModalVisible &&
      signupStatus === signUpState.DONE &&
      orgSchools.length > 0
    ) {
      toggleSchoolModal(false)
      onClick()
    }
  }, [signupStatus, orgSchools])

  useEffect(() => {
    setIsSchoolModalVisible(isOpenSignupModal)
  }, [isOpenSignupModal])

  const handleClick = () => {
    if (
      signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
      isSchoolSignupOnly
    ) {
      trackClick()
      toggleSchoolModal(true)
      return
    }

    return onClick()
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
  privateParams: PropTypes.object,
}

AuthorCompleteSignupButton.defaultProps = {
  onClick: () => null,
  trackClick: () => null,
  renderButton: () => null,
  setShowCompleteSignupModal: () => null,
  setCallFunctionAfterSignup: () => null,
  privateParams: {},
}

const enhance = compose(
  connect((state) => ({
    user: getUser(state),
    orgSchools: getOrgSchools(state),
    userOrgId: getUserOrgId(state),
  }))
)

export default enhance(AuthorCompleteSignupButton)
