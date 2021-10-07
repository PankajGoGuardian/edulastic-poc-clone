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
  testLists,
  isSignupCompleted,
}) => {
  if (!featuredBundles.length) {
    return null
  }

  const showFreebundles = !(isSignupCompleted && testLists?.length >= 3)

  const getFreeBundles = featuredBundles.filter(
    (x) => !x.config.subscriptionData
  )

  const getPremiumBundles = featuredBundles.filter(
    (x) => x.config.subscriptionData
  )

  const filteredfeaturedBundles =
    (showFreebundles
      ? getFreeBundles
      : [...getFreeBundles, ...getPremiumBundles]) || []

  return (
    <FeatureContentWrapper>
      <TextWrapper
        fw="bold"
        size="16px"
        color={title}
        style={{ marginBottom: '1rem' }}
      >
        Pre-built Tests you can use
      </TextWrapper>
      <FlexContainer justifyContent="flex-start" flexWrap="wrap">
        {filteredfeaturedBundles.map((bundle) => (
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
