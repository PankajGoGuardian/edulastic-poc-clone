import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { signUpState } from '@edulastic/constants'
import { getUser } from '../../../author/src/selectors/user'

const TeacherSignup = loadable(
  () => import('../../../student/Signup/components/TeacherContainer/Container'),
  {
    fallback: <Spin />,
  }
)

const AuthorCompleteSignupButton = ({ user, renderButton, onClick }) => {
  const { currentSignUpState: signupStatus } = user
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)
  const toggleSchoolModal = (value) => setIsSchoolModalVisible(value)

  useEffect(() => {
    if (isSchoolModalVisible && signupStatus === signUpState.DONE) {
      toggleSchoolModal(false)
      onClick()
    }
  }, [signupStatus])

  const handleClick = () => {
    if (signupStatus === signUpState.DONE) {
      onClick()
    } else {
      toggleSchoolModal(true)
    }
  }

  return (
    <>
      {renderButton(handleClick)}
      {isSchoolModalVisible && (
        <TeacherSignup
          isModal
          handleCancel={() => toggleSchoolModal(false)}
          isVisible={isSchoolModalVisible}
        />
      )}
    </>
  )
}

AuthorCompleteSignupButton.propTypes = {
  user: PropTypes.object.isRequired,
  onClick: PropTypes.string.isRequired,
  renderButton: PropTypes.func.isRequired,
}

const enhance = compose(
  connect((state) => ({
    user: getUser(state),
  }))
)

export default enhance(AuthorCompleteSignupButton)
