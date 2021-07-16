import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { signUpState } from '@edulastic/constants'
import { getOrgSchools, getUser } from '../../../author/src/selectors/user'

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
}) => {
  const { currentSignUpState: signupStatus } = user
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)
  const toggleSchoolModal = (value) => setIsSchoolModalVisible(value)

  const handleCanel = (value) => {
    setShowCompleteSignupModal(false)
    setCallFunctionAfterSignup(() => null)
    toggleSchoolModal(value)
  }

  useEffect(() => {
    if (isSchoolModalVisible && signupStatus === signUpState.DONE) {
      toggleSchoolModal(false)
      onClick()
    }
  }, [signupStatus])

  useEffect(() => {
    setIsSchoolModalVisible(isOpenSignupModal)
  }, [isOpenSignupModal])

  const handleClick = () => {
    if (
      signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
      orgSchools.length === 0
    ) {
      trackClick()
      toggleSchoolModal(true)
      return
    }

    return onClick()
  }

  return (
    <>
      {renderButton(handleClick)}
      {isSchoolModalVisible && (
        <TeacherSignup
          isModal
          handleCancel={() => handleCanel(false)}
          isVisible={isSchoolModalVisible}
          isSchoolSignupOnly={orgSchools.length === 0}
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
}

AuthorCompleteSignupButton.defaultProps = {
  onClick: () => null,
  trackClick: () => null,
  renderButton: () => null,
  setShowCompleteSignupModal: () => null,
  setCallFunctionAfterSignup: () => null,
}

const enhance = compose(
  connect((state) => ({
    user: getUser(state),
    orgSchools: getOrgSchools(state),
  }))
)

export default enhance(AuthorCompleteSignupButton)
