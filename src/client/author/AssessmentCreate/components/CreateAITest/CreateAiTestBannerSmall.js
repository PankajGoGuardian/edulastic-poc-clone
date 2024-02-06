import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import i18 from '@edulastic/localization'
import React from 'react'

import { EduIf, FlexContainer } from '@edulastic/common'

import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  AiEduButton,
  CreateAiTestBannerWrapper,
  CreateAiTestBannerTitleWrapper,
} from './styled'
import AddOnTag from '../common/AddOnTag'

import { isVideoQuizAndAIEnabledSelector } from '../../../src/selectors/user'

const AiTestBannerSmall = ({
  onCreateItems,
  isVideoQuizAndAIEnabled,
  bannerText,
}) => {
  return (
    <CreateAiTestBannerWrapper
      mt="1rem"
      justifyContent="space-between"
      alignItems="center"
      data-cy="aiTest"
    >
      <IconMagicWand fill="#1766ce" />
      <CreateAiTestBannerTitleWrapper>
        {bannerText ||
          'Need more content? Create a quick test using AI-powered items'}
      </CreateAiTestBannerTitleWrapper>
      <FlexContainer alignItems="center" justifyContent="space-between">
        <EduIf condition={!isVideoQuizAndAIEnabled}>
          <AddOnTag message={i18.t('author:aiSuite.addOnText')} />
        </EduIf>
        <AiEduButton
          aiStyle
          onClick={onCreateItems}
          fontWeight={700}
          data-cy="getStartedButton"
        >
          Get Started
        </AiEduButton>
      </FlexContainer>
    </CreateAiTestBannerWrapper>
  )
}

const enhance = compose(
  connect((state) => ({
    isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
  }))
)

export default enhance(AiTestBannerSmall)
