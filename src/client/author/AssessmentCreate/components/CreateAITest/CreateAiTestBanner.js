import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import i18 from '@edulastic/localization'
import React from 'react'

import { Tooltip } from 'antd'
import {
  AiEduButton,
  CreateAiTestTitleWrapper,
  CreateAiTestWrapper,
} from './styled'

const AiTestBanner = ({ onCreateItems }) => {
  return (
    <CreateAiTestWrapper
      mt="1rem"
      padding="2rem"
      justifyContent="space-between"
      alignItems="center"
      width="calc(100% - 2.5rem)"
    >
      <CreateAiTestTitleWrapper>
        Generate AI-powered test items with a single click!
      </CreateAiTestTitleWrapper>
      <Tooltip title={`${i18.t('author:rubric.infoText')}`}>
        <AiEduButton isGhost onClick={onCreateItems} fontWeight={700}>
          <IconMagicWand />
          Create Quick Test Using AI
        </AiEduButton>
      </Tooltip>
    </CreateAiTestWrapper>
  )
}

export default AiTestBanner
