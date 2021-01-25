import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, EmptyBox } from './styled'
import BundleWrapper from './BundleWrapper'

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
          <BundleWrapper
            key={bundle._id}
            handleFeatureClick={handleFeatureClick}
            bundle={bundle}
          />
        ))}
        {emptyBoxCount.map((index) => (
          <EmptyBox key={index} />
        ))}
      </FlexContainer>
    </FeatureContentWrapper>
  )
}
export default FeaturedContentBundle
