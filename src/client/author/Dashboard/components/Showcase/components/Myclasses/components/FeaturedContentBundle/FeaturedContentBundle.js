import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import {
  FeatureContentWrapper,
  BundleContainer,
  Bottom,
  EmptyBox,
} from './styled'

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
          <BundleContainer
            onClick={() => handleFeatureClick(bundle || {})}
            bgImage={bundle.imageUrl}
            key={bundle._id}
            data-cy={bundle.description}
          >
            <Bottom>
              {bundle.description && <div> {bundle.description} </div>}
            </Bottom>
          </BundleContainer>
        ))}
        {emptyBoxCount.map((index) => (
          <EmptyBox key={index} />
        ))}
      </FlexContainer>
    </FeatureContentWrapper>
  )
}
export default FeaturedContentBundle
