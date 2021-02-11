import React, { useState, useEffect } from 'react'
import { withNamespaces } from '@edulastic/localization'
import loadable from '@loadable/component'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUserOrgId } from '../../src/selectors/user'
import {
  getSubscriptionSelector,
  getSuccessSelector,
} from '../../Subscription/ducks'
import {
  addBulkUsersAdminAction,
  fetchMultipleSubscriptionsAction,
  getBulkUsersData,
  getConfirmationModalVisible,
  getSubsLicensesSelector,
  getUsersSelector,
  setAddUserConfirmationModalVisibleAction,
  getLoadingStateSelector,
} from '../ducks'
import Header from './Header'
import AddUsersSection from './AddUsersSection'
import LicenseCountSection from './LicenseCountSection'
import Userlist from './Userlist'
import { ContentWrapper, StyledSpin } from './styled'

const AddUsersModal = loadable(() => import('./AddUsersModal'))
const ManageLicensesModal = loadable(() => import('./ManageLicensesModal'))
const AddUsersConfirmationModal = loadable(() =>
  import('./AddUsersConfirmationModal')
)

const ManageSubscriptionContainer = ({
  subscription: { subEndDate, subType } = {},
  isSuccess,
  subsLicenses,
  users,
  userOrgId,
  addUsers,
  setAddUsersConfirmationModalVisible,
  showAddUserConfirmationModal = false,
  userDataSource = [],
  t,
  fetchMultipleSubscriptions,
  loading,
}) => {
  const [showManageLicenseModal, setShowManageLicenseModal] = useState(false)
  const [showAddUsersModal, setShowAddUsersModal] = useState(false)

  useEffect(() => {
    fetchMultipleSubscriptions()
  }, [])

  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const closeManageLicenseModal = () => setShowManageLicenseModal(false)
  const closeAddUsersModal = () => setShowAddUsersModal(false)
  const closeAddUsersConfirmationModal = () =>
    setAddUsersConfirmationModalVisible(false)

  const sendInvite = (obj) => {
    const o = {
      addReq: obj,
    }
    addUsers(o)
  }

  if (loading) {
    return <StyledSpin />
  }

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
        <AddUsersSection setShowAddUsersModal={setShowAddUsersModal} />
        <Userlist users={users} />
      </ContentWrapper>
      {showManageLicenseModal && (
        <ManageLicensesModal
          isVisible={showManageLicenseModal}
          onCancel={closeManageLicenseModal}
        />
      )}
      {showAddUsersModal && (
        <AddUsersModal
          isVisible={showAddUsersModal}
          onCancel={closeAddUsersModal}
          districtId={userOrgId}
          addUsers={sendInvite}
        />
      )}
      {showAddUserConfirmationModal && (
        <AddUsersConfirmationModal
          isVisible={showAddUserConfirmationModal}
          onCancel={closeAddUsersConfirmationModal}
          userDataSource={userDataSource}
          userRole="teacher"
          t={t}
        />
      )}
    </>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      loading: getLoadingStateSelector(state),
      subscription: getSubscriptionSelector(state),
      isSuccess: getSuccessSelector(state),
      subsLicenses: getSubsLicensesSelector(state),
      userOrgId: getUserOrgId(state),
      users: getUsersSelector(state),
      showAddUserConfirmationModal: getConfirmationModalVisible(state),
      userDataSource: getBulkUsersData(state),
    }),
    {
      addUsers: addBulkUsersAdminAction,
      setAddUsersConfirmationModalVisible: setAddUserConfirmationModalVisibleAction,
      fetchMultipleSubscriptions: fetchMultipleSubscriptionsAction,
    }
  )
)

export default enhance(ManageSubscriptionContainer)
