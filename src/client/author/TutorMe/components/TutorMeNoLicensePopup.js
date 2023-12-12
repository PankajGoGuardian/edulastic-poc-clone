import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'

import { withNamespaces } from '@edulastic/localization'
import { IconTutorMeNoLicense } from '@edulastic/icons'
import { black } from '@edulastic/colors'
import { openTutorMeBusinessPage } from '../helper'
import {
  TutorMeNoLicensePopupCloseButton,
  TutorMeNoLicensePopupDescription,
  TutorMeNoLicensePopupTitle,
} from './styled'

const TutorMeNoLicensePopup = ({ t, open, closePopup }) => {
  return (
    <CustomModalStyled
      centered
      visible={open}
      onCancel={closePopup}
      modalWidth="450px"
      padding="20px 10px"
      bodyPadding="0px"
      footer={null}
      destroyOnClose
      closable={false}
    >
      <FlexContainer width="475px" alignItems="flex-start">
        <TutorMeNoLicensePopupCloseButton onClick={closePopup}>
          x
        </TutorMeNoLicensePopupCloseButton>
        <IconTutorMeNoLicense height="135px" width="135px" />
        <FlexContainer
          flexDirection="column"
          width="250px"
          padding="15px 0 0 6px"
        >
          <TutorMeNoLicensePopupTitle
            data-cy="tutorme-no-license-popup-title"
            textColor={black}
          >
            Advance Student
            <br />
            Mastery with Tutoring
          </TutorMeNoLicensePopupTitle>
          <TutorMeNoLicensePopupDescription data-cy="tutorme-no-license-popup-description">
            {t('common.assignTutoringDisabled')}
          </TutorMeNoLicensePopupDescription>
          <FlexContainer
            padding="15px 0 15px 0"
            width="100%"
            justifyContent="right"
          >
            <EduButton data-cy="learnMore" onClick={openTutorMeBusinessPage}>
              LEARN MORE
            </EduButton>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </CustomModalStyled>
  )
}

export default withNamespaces('classBoard')(TutorMeNoLicensePopup)
