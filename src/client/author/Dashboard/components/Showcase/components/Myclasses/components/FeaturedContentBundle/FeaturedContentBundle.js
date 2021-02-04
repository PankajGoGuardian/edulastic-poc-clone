import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, EmptyBox } from './styled'
import Bundle from './Bundle'

const FeaturedContentBundle = ({
  featuredBundles,
  handleFeatureClick,
  emptyBoxCount,
}) => {
  if (!featuredBundles.length) {
    return null
  }

  return (
    <FeatureContentWrapper>
      <TextWrapper
        fw="bold"
        size="16px"
        color={title}
        style={{ marginBottom: '1rem' }}
      >
        Featured Content Bundles
      </TextWrapper>
      <FlexContainer justifyContent="space-between" flexWrap="wrap">
        {featuredBundles.map((bundle) => (
          <Bundle handleClick={handleFeatureClick} bundle={bundle} />
        ))}
        {emptyBoxCount.map((index) => (
          <EmptyBox key={index} />
        ))}
      </FlexContainer>
    </FeatureContentWrapper>
  )
}
export default FeaturedContentBundle
