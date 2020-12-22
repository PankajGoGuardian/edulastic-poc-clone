import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, BundleContainer, Bottom } from './styled'

const FeaturedContentBundle = ({ featuredBundles, handleFeatureClick }) => {
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
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        {featuredBundles.map((bundle) => (
          <BundleContainer
            onClick={() => handleFeatureClick(bundle || {})}
            bgImage={bundle.imageUrl}
            key={bundle._id}
          >
            <Bottom>
              {bundle.description && <div> {bundle.description} </div>}
            </Bottom>
          </BundleContainer>
        ))}
      </FlexContainer>
    </FeatureContentWrapper>
  )
}
export default FeaturedContentBundle
