import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, BundleContainer, Bottom } from './styled'

const FeaturedContentBundle = ({ testBundles, handleFeatureClick }) => {
  if (testBundles.length === 0) {
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
        {testBundles.map((bundle) => (
          <BundleContainer
            onClick={() => handleFeatureClick(bundle.config.filters || [])}
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
