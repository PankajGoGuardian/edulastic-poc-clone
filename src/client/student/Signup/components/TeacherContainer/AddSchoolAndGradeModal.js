import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { CustomModalStyled } from '@edulastic/common'
import JoinSchool from './JoinSchool'
import SubjectGradeForm from './SubjectGrade'
import {
  TitleHeader,
  TitleParagraph,
} from '../../../../author/Welcome/styled/styled'

const AddSchoolAndGradeModal = ({
  user,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
  isVisible,
  handleCancel,
  isSchoolSignupOnly = false,
  onMouseDown,
  onSuccessCallback = () => {},
  triggerSource = '',
  allowCanvas,
  hideJoinSchoolBanner,
  isCliUser = false,
}) => {
  const userInfo = get(user, 'user', {})
  const [schoolSelectedFromDropdown, setSchoolSelectedFromDropdown] = useState(
    false
  )
  const [isCompleteSignupInProgress, setIsCompleteSignupInProgress] = useState(
    false
  )

  const modalTitle = (
    <>
      <TitleHeader>Join your school</TitleHeader>
      <TitleParagraph>
        and provide your curriculum details, so we can provide relevant content
      </TitleParagraph>
    </>
  )

  return (
    <CustomModalStyled
      title={modalTitle}
      visible={isVisible}
      footer={null}
      closable={!isCompleteSignupInProgress && !isCliUser}
      maskClosable={false}
      width="850px"
      data-cy="signupSchoolSelectionTitle"
      onCancel={handleCancel}
      centered
      bgColor="#dbf2ec"
      padding="30px 60px"
      modalWidth="565px"
      borderRadius="20px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
    >
      <JoinSchool
        userInfo={userInfo}
        districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
        isSignupUsingDaURL={isSignupUsingDaURL}
        generalSettings={generalSettings}
        districtPolicy={districtPolicy}
        orgShortName={orgShortName}
        orgType={orgType}
        allowCanvas={allowCanvas}
        isModal
        isSchoolSignupOnly={isSchoolSignupOnly}
        triggerSource={triggerSource}
        setSchoolSelectedFromDropdown={setSchoolSelectedFromDropdown}
        hideJoinSchoolBanner={hideJoinSchoolBanner}
        isCompleteSignupInProgress={isCompleteSignupInProgress}
      />
      <SubjectGradeForm
        userInfo={userInfo}
        districtId={isSignupUsingDaURL ? generalSettings.orgId : false}
        onMouseDown={onMouseDown}
        onSuccessCallback={onSuccessCallback}
        isModal
        triggerSource={triggerSource}
        schoolSelectedFromDropdown={schoolSelectedFromDropdown}
        withJoinSchoolModal
        isCompleteSignupInProgress={isCompleteSignupInProgress}
        setIsCompleteSignupInProgress={setIsCompleteSignupInProgress}
        isSchoolSignupOnly={isSchoolSignupOnly}
      />
    </CustomModalStyled>
  )
}

AddSchoolAndGradeModal.propTypes = {
  user: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onSuccessCallback: PropTypes.func,
}

AddSchoolAndGradeModal.defaultProps = {
  onSuccessCallback: () => {},
}

const enhance = compose(
  connect((state) => ({
    user: state.user,
  }))
)

export default enhance(AddSchoolAndGradeModal)
