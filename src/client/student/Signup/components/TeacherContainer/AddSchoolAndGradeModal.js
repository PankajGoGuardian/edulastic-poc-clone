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
      title={
        userInfo.districtIds && userInfo.districtIds.length === 0
          ? 'Where do you teach?'
          : 'What do you teach?'
      }
      visible={isVisible}
      footer={null}
      width="900px"
      data-cy="signupSchoolSelectionTitle"
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
          isModal
        />
      ) : (
        <SubjectGradeForm
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
          isModal
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
