import React, { useState, useEffect, useMemo } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { subscriptions as constants, roleuser } from '@edulastic/constants'
import { groupBy } from 'lodash'
import loadable from '@loadable/component'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PurchaseFlowModals from '../../src/components/common/PurchaseModals'
import {
  getUserOrgId,
  getUserRole,
  getUserIdSelector,
} from '../../src/selectors/user'
import { getDashboardTilesSelector } from '../../Dashboard/ducks'
import {
  getSubscriptionSelector,
  getSuccessSelector,
  getProducts,
  getItemBankSubscriptions,
} from '../../Subscription/ducks'
import {
  addAndUpgradeUsersAction,
  fetchMultipleSubscriptionsAction,
  getBulkUsersData,
  getUpgradeSuccessModalVisible,
  getSubsLicensesSelector,
  getUsersSelector,
  setAddUserConfirmationModalVisibleAction,
  getLoadingStateSelector,
  bulkEditUsersPermissionAction,
} from '../ducks'
import AddUsersSection from './AddUsersSection'
import Header from './Header'
import LicenseCountSection from './LicenseCountSection'
import Userlist from './Userlist'
import { ContentWrapper, StyledSpin } from './styled'

const AddUsersModal = loadable(() => import('./AddUsersModal'))
const AddUsersConfirmationModal = loadable(() =>
  import('./AddUsersConfirmationModal')
)

const { PRODUCT_NAMES } = constants

const ManageSubscriptionContainer = ({
  subscription: { subEndDate, subType } = {},
  isSuccess,
  subsLicenses,
  users,
  userOrgId,
  userId,
  addAndUpgradeUsersSubscriptions,
  setAddUsersConfirmationModalVisible,
  showUpgradeUsersSuccessModal = false,
  userDataSource = [],
  dashboardTiles,
  products,
  itemBankSubscriptions = [],
  t,
  fetchMultipleSubscriptions,
  loading,
  bulkEditUsersPermission,
  licenseIds,
  userRole,
  isEdulasticAdminView,
}) => {
  const [showBuyMoreModal, setShowBuyMoreModal] = useState(false)
  const [showAddUsersModal, setShowAddUsersModal] = useState(false)
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [showMultiplePurchaseModal, setShowMultiplePurchaseModal] = useState(
    false
  )

  const [isBuyMoreModalOpened, setIsBuyMoreModalOpened] = useState('')

  const [productData, setProductData] = useState({})

  const { FEATURED } = groupBy(dashboardTiles, 'type')
  const featuredBundles = FEATURED || []

  const {
    sparkMathProductId,
    sparkMathLinkedProductId,
    teacherPremiumProductId,
  } = useMemo(() => {
    let _sparkMathProductId = null
    let _teacherPremiumProductId = null
    let _sparkMathLinkedProductId = null
    for (const { id, name, linkedProductId } of products) {
      if (name === PRODUCT_NAMES.TEACHER_PREMIUM) {
        _teacherPremiumProductId = id
      }
      if (name === PRODUCT_NAMES.SPARK_MATH) {
        _sparkMathProductId = id
        _sparkMathLinkedProductId = linkedProductId
      }
    }
    return {
      sparkMathProductId: _sparkMathProductId,
      teacherPremiumProductId: _teacherPremiumProductId,
      sparkMathLinkedProductId: _sparkMathLinkedProductId,
    }
  }, [products])

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

  useEffect(() => {
    fetchMultipleSubscriptions({ licenseIds })
  }, [])

  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const closeAddUsersModal = () => setShowAddUsersModal(false)
  const closeAddUsersConfirmationModal = () =>
    setAddUsersConfirmationModalVisible(false)

  const addAndUpgradeUsers = ({ userDetails, licenses }) =>
    addAndUpgradeUsersSubscriptions({
      addUsersPayload: {
        districtId: userOrgId,
        userDetails,
      },
      licenses,
    })

  const totalPaidProducts = itemBankSubscriptions.reduce(
    (a, c) => {
      if (c.isTrial) return a
      return a + 1
    },
    isPaidPremium ? 1 : 0
  )

  const hasAllPremiumProductAccess = totalPaidProducts === products.length

  if (loading) {
    return <StyledSpin />
  }

  return (
    <>
      {userRole !== roleuser.EDULASTIC_ADMIN && (
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
      )}

      <ContentWrapper isEdulasticAdminView={isEdulasticAdminView}>
        <LicenseCountSection
          subsLicenses={subsLicenses}
          setShowBuyMoreModal={setShowBuyMoreModal}
          setIsBuyMoreModalOpened={setIsBuyMoreModalOpened}
        />
        <AddUsersSection setShowAddUsersModal={setShowAddUsersModal} />
        <Userlist
          users={users}
          licenseIds={licenseIds}
          subsLicenses={subsLicenses}
          userId={userId}
          bulkEditUsersPermission={bulkEditUsersPermission}
          teacherPremiumProductId={teacherPremiumProductId}
          sparkMathProductId={sparkMathProductId}
        />
      </ContentWrapper>

      <PurchaseFlowModals
        licenseIds={licenseIds}
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        defaultSelectedProductIds={defaultSelectedProductIds}
        showMultiplePurchaseModal={showMultiplePurchaseModal}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        setProductData={setProductData}
        showBuyMoreModal={showBuyMoreModal}
        setShowBuyMoreModal={setShowBuyMoreModal}
        isBuyMoreModalOpened={isBuyMoreModalOpened}
        isEdulasticAdminView={isEdulasticAdminView}
      />
      {showAddUsersModal && (
        <AddUsersModal
          isVisible={showAddUsersModal}
          onCancel={closeAddUsersModal}
          districtId={userOrgId}
          addAndUpgradeUsers={addAndUpgradeUsers}
          subsLicenses={subsLicenses}
          teacherPremiumProductId={teacherPremiumProductId}
          sparkMathProductId={sparkMathProductId}
        />
      )}
      {showUpgradeUsersSuccessModal && (
        <AddUsersConfirmationModal
          t={t}
          userRole="teacher"
          isVisible={showUpgradeUsersSuccessModal}
          onCancel={closeAddUsersConfirmationModal}
          userDataSource={userDataSource}
          teacherPremiumProductId={teacherPremiumProductId}
          sparkMathProductId={sparkMathLinkedProductId}
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
      userId: getUserIdSelector(state),
      users: getUsersSelector(state),
      showUpgradeUsersSuccessModal: getUpgradeSuccessModalVisible(state),
      userDataSource: getBulkUsersData(state),
      products: getProducts(state),
      itemBankSubscriptions: getItemBankSubscriptions(state),
      dashboardTiles: getDashboardTilesSelector(state),
      userRole: getUserRole(state),
    }),
    {
      addAndUpgradeUsersSubscriptions: addAndUpgradeUsersAction,
      setAddUsersConfirmationModalVisible: setAddUserConfirmationModalVisibleAction,
      fetchMultipleSubscriptions: fetchMultipleSubscriptionsAction,
      bulkEditUsersPermission: bulkEditUsersPermissionAction,
    }
  )
)

export default enhance(ManageSubscriptionContainer)
