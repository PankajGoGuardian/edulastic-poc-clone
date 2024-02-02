import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import i18 from '@edulastic/localization'
import React from 'react'

import { Tooltip } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'

import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  AiEduButton,
  CreateAiTestTitleWrapper,
  CreateAiTestWrapper,
} from './styled'
import AddOnTag from '../common/AddOnTag'

import { isVideoQuizAndAIEnabledSelector } from '../../../src/selectors/user'

const AiTestBanner = ({
  onCreateItems,
  isVideoQuizAndAIEnabled,
  isAIQuizFromManualAssessments = false,
}) => {
  return (
    <CreateAiTestWrapper
      mt="1rem"
      padding="2rem"
      justifyContent="space-between"
      alignItems="center"
      width="calc(100% - 2.5rem)"
      data-cy="aiTest"
      style={{
        ...(isAIQuizFromManualAssessments
          ? { background: 'linear-gradient(225deg,#3e4d9f 0%,#ff730b 100%)' }
          : {}),
      }}
    >
      <CreateAiTestTitleWrapper data-cy="aiTestTitle">
        {isAIQuizFromManualAssessments
          ? 'Generate AI-powered test items through Google forms, PDF, Video with a single click!'
          : 'Generate AI-powered test items with a single click!'}
      </CreateAiTestTitleWrapper>
      <FlexContainer justifyContent="space-between" alignItems="center">
        <EduIf condition={!isVideoQuizAndAIEnabled}>
          <AddOnTag message={i18.t('author:aiSuite.addOnText')} />
        </EduIf>

        <Tooltip title={`${i18.t('author:rubric.infoText')}`}>
          <AiEduButton
            isGhost
            onClick={onCreateItems}
            fontWeight={700}
            data-cy="aiCreateTestButton"
          >
            <IconMagicWand />
            Create A Quick Test Using AI
          </AiEduButton>
        </Tooltip>
      </FlexContainer>
    </CreateAiTestWrapper>
  )
}

const enhance = compose(
  connect((state) => ({
    isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
  }))
)

export default enhance(AiTestBanner)
