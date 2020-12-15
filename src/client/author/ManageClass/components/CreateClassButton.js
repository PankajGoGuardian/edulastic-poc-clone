import React, { useState, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Spin } from 'antd'
import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import { EduButton } from '@edulastic/common'
import { signUpState } from '@edulastic/constants'
import { IconPlusCircle } from '@edulastic/icons'
import { getUser } from '../../src/selectors/user'

const TeacherSignup = loadable(
  () => import('../../../student/Signup/components/TeacherContainer/Container'),
  {
    fallback: <Spin />,
  }
)

const CreateClassButton = ({
  user,
  style,
  redirectRoute,
  title,
  hasIcon,
  history,
}) => {
  const { currentSignUpState: signupStatus } = user
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)

  const onCreateClassClick = () => {
    if (signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL) {
      setIsSchoolModalVisible(true)
    }
  }

  const toggleSchoolModal = (value) => setIsSchoolModalVisible(value)
  const onCompleteSignup = () => history.push(redirectRoute)

  const CreateClassWrapper =
    signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ? Fragment : Link
  const createClassLinkProps =
    signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL
      ? {}
      : { to: redirectRoute }

  return (
    <>
      <CreateClassWrapper {...createClassLinkProps}>
        <EduButton
          isBlue
          style={style}
          data-cy="createNewClass"
          onClick={onCreateClassClick}
        >
          {hasIcon && (
            <>
              <IconPlusCircle width={16} height={16} />{' '}
            </>
          )}

          {title || 'CREATE NEW CLASS'}
        </EduButton>
      </CreateClassWrapper>
      {isSchoolModalVisible && (
        <TeacherSignup
          isModal
          handleCancel={() => toggleSchoolModal(false)}
          isVisible={isSchoolModalVisible}
          onCompleteSignup={onCompleteSignup}
        />
      )}
    </>
  )
}

CreateClassButton.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  redirectRoute: PropTypes.string.isRequired,
  hasIcon: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
}

CreateClassButton.defaultProps = {
  style: {},
  title: '',
  hasIcon: true,
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    user: getUser(state),
  }))
)
export default enhance(CreateClassButton)
