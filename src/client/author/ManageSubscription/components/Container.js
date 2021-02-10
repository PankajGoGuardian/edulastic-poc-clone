import { withNamespaces } from '@edulastic/localization'
import React, { lazy, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { getUserOrgId } from '../../src/selectors/user'
import {
  getSubscriptionSelector,
  getSuccessSelector,
} from '../../Subscription/ducks'
import {
  addBulkUsersAdminAction,
  getBulkUsersData,
  getConfirmationModalVisible,
  getSubsLicensesSelector,
  getUsersSelector,
  setAddUserConfirmationModalVisibleAction,
} from '../ducks'
import Header from './Header'
import AddUsersSection from './AddUsersSection'
import LicenseCountSection from './LicenseCountSection'
import Userlist from './Userlist'
import { ContentWrapper } from './styled'

const AddUsersModal = lazy(() => import('./AddUsersModal'))
const ManageLicensesModal = lazy(() => import('./ManageLicensesModal'))
const AddUsersConfirmationModal = lazy(() =>
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
}) => {
  const [showManageLicenseModal, setShowManageLicenseModal] = useState(false)
  const [showAddUsersModal, setShowAddUsersModal] = useState(false)
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
    }
  )
)

export default enhance(ManageSubscriptionContainer)
