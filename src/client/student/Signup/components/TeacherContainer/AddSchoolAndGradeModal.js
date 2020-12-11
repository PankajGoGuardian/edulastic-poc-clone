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
  title,
}) => {
  const userInfo = get(user, 'user', {})

  return (
    <CustomModalStyled
      width="700px"
      title={title}
      visible={isVisible}
      footer={null}
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
        />
      ) : (
        <SubjectGradeForm
          userInfo={userInfo}
          districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
        />
      )}
    </CustomModalStyled>
  )
}

AddSchoolAndGradeModal.propTypes = {
  user: PropTypes.object.isRequired,
}

AddSchoolAndGradeModal.defaultProps = {}

const enhance = compose(
  connect((state) => ({
    user: state.user,
  }))
)

export default enhance(AddSchoolAndGradeModal)
