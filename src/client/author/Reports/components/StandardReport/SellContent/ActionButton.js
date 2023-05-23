import { EduButton } from '@edulastic/common'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { segmentApi } from '@edulastic/api'
import AuthorCompleteSignupButton from '../../../../../common/components/AuthorCompleteSignupButton'
import { slice, trialPeriodTextSelector } from '../../../../Subscription/ducks'
import TrialModal from '../../../../Dashboard/components/Showcase/components/Myclasses/components/TrialModal'

const ActionButton = ({
  isPremiumTrialUsed,
  products,
  premiumProductId,
  displayText,
  startTrialAction,
}) => {
  const [showTrial, setShowTrial] = useState(false)

  const upgradeNow = () => {
    segmentApi.genericEventTrack(`Insights: Upgrade now clicked`, {})
  }

  return (
    <>
      <TrialModal
        addOnProductIds={premiumProductId ? [premiumProductId] : []}
        isVisible={showTrial}
        toggleModal={() => setShowTrial(!showTrial)}
        isPremiumUser={false}
        isPremiumTrialUsed={isPremiumTrialUsed}
        setShowTrialSubsConfirmation={() => setShowTrial(false)}
        startPremiumTrial={startTrialAction}
        products={products}
        displayText={displayText}
      />
      <ActionContainer>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <SecondaryButton height="30px" isGhost onClick={handleClick}>
              TAKE FREE TRIAL
            </SecondaryButton>
          )}
          onClick={() => setShowTrial(true)}
        />{' '}
        <Link to="/author/subscription">
          <PrimaryButton height="30px" isGhost onClick={upgradeNow}>
            UPGRADE NOW
          </PrimaryButton>
        </Link>
      </ActionContainer>
    </>
  )
}

const ActionContainer = styled.div`
  text-align: right;

  button {
    display: inline;
  }
`
const SecondaryButton = styled(EduButton)`
  background: transparent !important;
  color: white !important;
  border-color: white !important;
`

const PrimaryButton = styled(EduButton)`
  border-color: white !important;
`

const enhance = connect(
  (state) => ({
    products: state.subscription?.products,
    isPremiumTrialUsed:
      state.subscription?.subscriptionData?.isPremiumTrialUsed,
    premiumProductId: state.subscription?.subscriptionData?.premiumProductId,
    displayText: trialPeriodTextSelector(state),
  }),
  {
    startTrialAction: slice.actions.startTrialAction,
    setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
  }
)

export default enhance(ActionButton)
