import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { CustomModalStyled } from '@edulastic/common'
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
}) => {
  const userInfo = get(user, 'user', {})

  return (
    <CustomModalStyled
      title="Complete the signup process to proceed"
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
}

const enhance = compose(
  connect((state) => ({
    user: state.user,
  }))
)

export default enhance(AddSchoolAndGradeModal)
