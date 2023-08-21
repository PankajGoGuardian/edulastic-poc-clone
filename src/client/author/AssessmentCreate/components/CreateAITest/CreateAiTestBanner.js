import React from 'react'
import IconMagicWand from '@edulastic/icons/src/IconMagicWand'

import {
  CreateAiTestTitleWrapper,
  CreateAiTestWrapper,
  AiEduButton,
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
      <AiEduButton isGhost onClick={onCreateItems} fontWeight={700}>
        <IconMagicWand />
        Create Quick Test Using AI
      </AiEduButton>
    </CreateAiTestWrapper>
  )
}

export default AiTestBanner
