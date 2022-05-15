import React from 'react'

// components
import { FlexContainer } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../../../styledComponents'
import { FeatureContentWrapper, EmptyBox, UnlockButton } from './styled'
import Bundle from './Bundle'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton/index'

const FeaturedContentBundle = ({
  featuredBundles = [],
  handleFeatureClick,
  emptyBoxCount,
  totalAssignmentCount,
  isSignupCompleted,
  isSingaporeMath,
  isCpm,
  boughtItemBankIds,
}) => {
  const showFreebundles = !(isSignupCompleted && totalAssignmentCount >= 3)

  const getFreeBundles =
    featuredBundles?.filter((x) => !x?.config?.subscriptionData) || []

  const getNotAvailedPremiumBundles =
    featuredBundles?.filter(
      (x) =>
        x?.config?.subscriptionData &&
        !boughtItemBankIds.includes(x?.config?.subscriptionData?.itemBankId)
    ) || []

  const getAvailedBundles =
    featuredBundles?.filter((x) =>
      boughtItemBankIds.includes(x?.config?.subscriptionData?.itemBankId)
    ) || []

  let defaultBundles = []

  if (isSingaporeMath || isCpm) {
    defaultBundles = [
      ...getNotAvailedPremiumBundles.filter(
        (x) => x?.config[isSingaporeMath ? 'isSingaporeMath' : 'isCPM']
      ),
    ]
  }

  const filteredfeaturedBundles =
    (showFreebundles
      ? [...getFreeBundles, ...getAvailedBundles, ...defaultBundles]
      : [
          ...getFreeBundles,
          ...getNotAvailedPremiumBundles,
          ...getAvailedBundles,
        ]) || []

  return (
    <FeatureContentWrapper>
      <TextWrapper fw="bold" size="16px" color={title} mt=".5rem" mb="1rem">
        Pre-built Test Collections{' '}
      </TextWrapper>
      {!isSignupCompleted ? (
        <>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <UnlockButton
                height="28px"
                isGhost
                data-cy="unlockPreBuiltTests"
                data-testid="unlockPreBuiltTests"
                onClick={handleClick}
              >
                UNLOCK
              </UnlockButton>
            )}
            triggerSource="Unlock Button Click"
          />
          <p>
            Provide your Interested Grade and Subject to unlock ready-made tests
            you can quickly use
          </p>
        </>
      ) : (
        <FlexContainer justifyContent="flex-start" flexWrap="wrap">
          {filteredfeaturedBundles?.map((bundle, i) => (
            <Bundle key={i} handleClick={handleFeatureClick} bundle={bundle} />
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
