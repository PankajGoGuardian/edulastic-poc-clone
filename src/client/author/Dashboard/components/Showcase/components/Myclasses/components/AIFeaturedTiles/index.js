import React from 'react'
import { Link } from 'react-router-dom'
import { FlexContainer } from '@edulastic/common'
import { TextWrapper } from '../../../../../styledComponents'
import { AIFeatureContentWrapper, Image } from './styled'

const AIFeaturedTiles = () => {
  return (
    <AIFeatureContentWrapper>
      <TextWrapper
        size="16px"
        fw="700"
        lh="22px"
        color="#000000"
        mt=".5rem"
        mb="1rem"
      >
        AI powered new features{' '}
      </TextWrapper>
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        <Link to="/author/tests/videoquiz">
          <Image
            alt="videoquiz"
            src="https://cdn.edulastic.com/webresources/dashboard/video-quiz.svg"
            width="240px"
          />
        </Link>
        <Link to="/author/tests/select?open=aiquiz">
          <Image
            alt="aiquiz"
            src="https://cdn.edulastic.com/webresources/dashboard/ai_quiz.svg"
            width="240px"
          />
        </Link>
      </FlexContainer>
    </AIFeatureContentWrapper>
  )
}
export default AIFeaturedTiles
