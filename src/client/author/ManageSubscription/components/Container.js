import { withNamespaces } from '@edulastic/localization'
import { groupBy } from 'lodash'
import React, { lazy, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PurchaseFlowModals from '../../src/components/common/PurchaseModals'
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
import AddUsersSection from './AddUsersSection'
import Header from './Header'
import LicenseCountSection from './LicenseCountSection'
import { ContentWrapper } from './styled'
import Userlist from './Userlist'

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
  dashboardTiles,
  products,
  itemBankSubscriptions = [],
  t,
}) => {
  const [showManageLicenseModal, setShowManageLicenseModal] = useState(false)
  const [showAddUsersModal, setShowAddUsersModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [showMultiplePurchaseModal, setShowMultiplePurchaseModal] = useState(
    false
  )
  const [productData, setProductData] = useState({})

  const { FEATURED } = groupBy(dashboardTiles, 'type')
  const featuredBundles = FEATURED || []

  const { id: sparkMathProductId } = useMemo(
    () => products.find((product) => product.name === 'Spark Math') || {},
    [products]
  )

  const currentItemBank =
    featuredBundles &&
    featuredBundles.find(
      (bundle) =>
        bundle?.config?.subscriptionData?.productId === sparkMathProductId
    )

  const settingProductData = () => {
    const { config = {} } = currentItemBank
    const { subscriptionData } = config

    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankId: subscriptionData.itemBankId,
    })
  }

  const defaultSelectedProductIds = productData.productId
    ? [productData.productId]
    : null

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

  const totalPaidProducts = itemBankSubscriptions.reduce(
    (a, c) => {
      if (c.isTrial) return a
      return a + 1
    },
    isPaidPremium ? 1 : 0
  )

  const hasAllPremiumProductAccess = totalPaidProducts === products.length

  return (
    <>
      <Header
        isSubscribed={isSubscribed}
        subType={subType}
        subEndDate={subEndDate}
        isPaidPremium={isPaidPremium}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        hasAllPremiumProductAccess={hasAllPremiumProductAccess}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        settingProductData={settingProductData}
      />
      <ContentWrapper>
        <LicenseCountSection
          subsLicenses={subsLicenses}
          setShowManageLicenseModal={setShowManageLicenseModal}
        />
        <AddUsersSection setShowAddUsersModal={setShowAddUsersModal} />
        <Userlist users={users} />
      </ContentWrapper>

      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        defaultSelectedProductIds={defaultSelectedProductIds}
        showMultiplePurchaseModal={showMultiplePurchaseModal}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        setProductData={setProductData}
      />
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
      products: state?.subscription?.products,
      dashboardTiles: state.dashboardTeacher.configurableTiles,
      itemBankSubscriptions:
        state?.subscription?.subscriptionData?.itemBankSubscriptions,
    }),
    {
      addUsers: addBulkUsersAdminAction,
      setAddUsersConfirmationModalVisible: setAddUserConfirmationModalVisibleAction,
    }
  )
)

export default enhance(ManageSubscriptionContainer)
