import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, EmptyBox, UnlockButton } from './styled'
import Bundle from './Bundle'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton/index'

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
      <TextWrapper fw="bold" size="16px" color={title} mt=".5rem" mb="1rem">
        Pre-built Tests you can use{' '}
      </TextWrapper>
      {!isSignupCompleted ? (
        <>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <UnlockButton
                height="28px"
                isGhost
                data-cy="unlockPreBuiltTests"
                onClick={handleClick}
              >
                UNLOCK
              </UnlockButton>
            )}
          />
          <p>
            Provide your Interested Grade and Subject to unlock ready-made tests
            you can quickly use
          </p>
        </>
      ) : (
        <FlexContainer justifyContent="flex-start" flexWrap="wrap">
          {filteredfeaturedBundles.map((bundle) => (
            <Bundle handleClick={handleFeatureClick} bundle={bundle} />
          ))}
          {emptyBoxCount.map((index) => (
            <EmptyBox key={index} />
          ))}
        </FlexContainer>
      )}
    </FeatureContentWrapper>
  )
}
export default FeaturedContentBundle
