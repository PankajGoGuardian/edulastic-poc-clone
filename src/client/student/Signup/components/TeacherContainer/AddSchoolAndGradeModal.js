import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { CustomModalStyled } from '@edulastic/common'
import { signUpState } from '@edulastic/constants'
import JoinSchool from './JoinSchool'
import SubjectGradeForm from './SubjectGrade'

const AddSchoolAndGradeModal = ({
  user,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
  isVisible,
  handleCancel,
  onCompleteSignup,
}) => {
  const userInfo = get(user, 'user', {})

  useEffect(() => {
    if (user.signupStatus === signUpState.DONE) {
      onCompleteSignup()
    }
  }, [user.signupStatus])

  return (
    <CustomModalStyled
      visible={isVisible}
      footer={null}
      width="900px"
      onCancel={handleCancel}
      centered
    >
      {userInfo.districtIds && userInfo.districtIds.length === 0 ? (
        <JoinSchool
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
          isSignupUsingDaURL={isSignupUsingDaURL}
          generalSettings={generalSettings}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
          allowCanvas={false}
          hasMinHeight={false}
        />
      ) : (
        <SubjectGradeForm
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
          hasMinHeight={false}
        />
      )}
    </CustomModalStyled>
  )
}

AddSchoolAndGradeModal.propTypes = {
  user: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onCompleteSignup: PropTypes.func.isRequired,
}

const enhance = compose(
  connect((state) => ({
    user: state.user,
  }))
)

export default enhance(AddSchoolAndGradeModal)
