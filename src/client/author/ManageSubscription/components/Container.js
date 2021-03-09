import React, { useState, useEffect, useMemo } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { subscriptions as constants, roleuser } from '@edulastic/constants'
import loadable from '@loadable/component'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PurchaseFlowModals from '../../src/components/common/PurchaseModals'
import {
  getUserOrgId,
  getUserRole,
  getUserIdSelector,
  getUserFeatures,
  getOrgDataSelector,
} from '../../src/selectors/user'
import {
  getSubscriptionSelector,
  getSuccessSelector,
  getProducts,
  getItemBankSubscriptions,
  getIsSubscriptionExpired,
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
  getColumnsSelector,
  updateSaveButtonState,
  getSaveButtonState,
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
const ONE_MONTH = 30 * 24 * 60 * 60 * 1000
const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

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
  products,
  itemBankSubscriptions = [],
  t,
  fetchMultipleSubscriptions,
  loading,
  bulkEditUsersPermission,
  licenseIds,
  districtId,
  userRole,
  isEdulasticAdminView,
  isSubscriptionExpired,
  columns,
  userFeature,
  licenseOwnerId,
  orgData,
  saveButtonState,
  setSaveButtonState,
}) => {
  const [showBuyMoreModal, setShowBuyMoreModal] = useState(false)
  const [selectedLicenseId, setSelectedLicenseId] = useState(false)
  const [showAddUsersModal, setShowAddUsersModal] = useState(false)
  const [dataSource, setDataSource] = useState(users)
  const [searchValue, setSearchValue] = useState()
  const [currentItemId, setCurrentItemId] = useState()
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [showMultiplePurchaseModal, setShowMultiplePurchaseModal] = useState(
    false
  )

  useEffect(() => setDataSource(users), [users])

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

  const defaultSelectedProductIds = []

  useEffect(() => {
    fetchMultipleSubscriptions({ licenseOwnerId })
  }, [])

  const isSubscribed =
    subType === 'premium' ||
    subType === 'enterprise' ||
    isSuccess ||
    subType === 'TRIAL_PREMIUM'

  const isPaidPremium = !(!subType || subType === 'TRIAL_PREMIUM')

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate && Date.now() < subEndDate + TEN_DAYS
    : false

  const showRenewalOptions =
    ((isPaidPremium && isAboutToExpire) ||
      (!isPaidPremium && isSubscriptionExpired)) &&
    !['enterprise', 'partial_premium'].includes(subType)

  const closeAddUsersModal = () => setShowAddUsersModal(false)
  const closeAddUsersConfirmationModal = () =>
    setAddUsersConfirmationModalVisible(false)

  const addAndUpgradeUsers = ({ userDetails, licenses }) =>
    addAndUpgradeUsersSubscriptions({
      addUsersPayload: {
        districtId: userOrgId || districtId,
        userDetails,
      },
      licenses,
      licenseOwnerId,
    })

  const totalPaidProducts = useMemo(
    () =>
      itemBankSubscriptions.reduce(
        (a, c) => {
          if (c.isTrial) return a
          return a + 1
        },
        isPaidPremium ? 1 : 0
      ),
    [itemBankSubscriptions, isPaidPremium]
  )

  const handleTableSearch = (e) => {
    const currValue = e.target.value
    setSearchValue(currValue)
    if (!currValue) {
      setDataSource(users)
      return
    }
    const filteredData = users.filter(
      (entry) =>
        entry?.username?.includes(currValue) ||
        entry?.email?.includes(currValue)
    )
    setDataSource(filteredData)
  }

  const hasAllPremiumProductAccess = totalPaidProducts === products.length

  const isPremiumUser = userFeature?.premium

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
          showRenewalOptions={showRenewalOptions}
          isPremiumUser={isPremiumUser}
          userRole={userRole}
          orgData={orgData}
        />
      )}

      <ContentWrapper isEdulasticAdminView={isEdulasticAdminView}>
        <LicenseCountSection
          subsLicenses={subsLicenses}
          setShowBuyMoreModal={setShowBuyMoreModal}
          setCurrentItemId={setCurrentItemId}
          isEdulasticAdminView={isEdulasticAdminView}
          setSelectedLicenseId={setSelectedLicenseId}
        />
        <AddUsersSection
          setShowAddUsersModal={setShowAddUsersModal}
          handleTableSearch={handleTableSearch}
          searchValue={searchValue}
        />
        <Userlist
          users={dataSource}
          subsLicenses={subsLicenses}
          currentUserId={userId}
          bulkEditUsersPermission={bulkEditUsersPermission}
          dynamicColumns={columns}
          licenseOwnerId={licenseOwnerId}
          subType={subType}
          isEdulasticAdminView={isEdulasticAdminView}
          saveButtonState={saveButtonState}
          setSaveButtonState={setSaveButtonState}
        />
      </ContentWrapper>

      <PurchaseFlowModals
        licenseIds={licenseIds}
        licenseOwnerId={licenseOwnerId}
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        defaultSelectedProductIds={defaultSelectedProductIds}
        showMultiplePurchaseModal={showMultiplePurchaseModal}
        setShowMultiplePurchaseModal={setShowMultiplePurchaseModal}
        setProductData={() => {}}
        showBuyMoreModal={showBuyMoreModal}
        setShowBuyMoreModal={setShowBuyMoreModal}
        isEdulasticAdminView={isEdulasticAdminView}
        showRenewalOptions={showRenewalOptions}
        currentItemId={currentItemId}
        selectedLicenseId={selectedLicenseId}
        setSelectedLicenseId={setSelectedLicenseId}
      />
      {showAddUsersModal && (
        <AddUsersModal
          users={dataSource}
          isVisible={showAddUsersModal}
          onCancel={closeAddUsersModal}
          districtId={userOrgId || districtId}
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
      userRole: getUserRole(state),
      isSubscriptionExpired: getIsSubscriptionExpired(state),
      columns: getColumnsSelector(state),
      userFeature: getUserFeatures(state),
      orgData: getOrgDataSelector(state),
      saveButtonState: getSaveButtonState(state),
    }),
    {
      addAndUpgradeUsersSubscriptions: addAndUpgradeUsersAction,
      setAddUsersConfirmationModalVisible: setAddUserConfirmationModalVisibleAction,
      fetchMultipleSubscriptions: fetchMultipleSubscriptionsAction,
      bulkEditUsersPermission: bulkEditUsersPermissionAction,
      setSaveButtonState: updateSaveButtonState,
    }
  )
)

export default enhance(ManageSubscriptionContainer)
