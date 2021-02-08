import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  getSubscriptionSelector,
  getSuccessSelector,
} from '../../Subscription/ducks'
import { getSubsLicenses } from '../ducks'
import Header from './Header'
import LicenseCountSection from './LicenseCountSection'
import ManageLicensesModal from './ManageLicensesModal'
import { ContentWrapper } from './styled'

const ManageSubscriptionContainer = ({
  subscription: { subEndDate, subType } = {},
  isSuccess,
  subsLicenses,
}) => {
  const [showManageLicenseModal, setShowManageLicenseModal] = useState(false)
  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const closeManageLicenseModal = () => setShowManageLicenseModal(false)

  return (
    <>
      <Header
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
      />
      <ContentWrapper>
        <LicenseCountSection
          subsLicenses={subsLicenses}
          setShowManageLicenseModal={setShowManageLicenseModal}
        />
      </ContentWrapper>
      <ManageLicensesModal
        isVisible={showManageLicenseModal}
        onCancel={closeManageLicenseModal}
      />
    </>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      subscription: getSubscriptionSelector(state),
      isSuccess: getSuccessSelector(state),
      subsLicenses: getSubsLicenses(state),
    }),
    null
  )
)

export default enhance(ManageSubscriptionContainer)
