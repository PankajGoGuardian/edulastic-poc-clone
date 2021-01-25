import React, { useState, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy } from 'lodash'
import qs from 'qs'
import moment from 'moment'

// components
import { Spin } from 'antd'
import { MainContentWrapper, withWindowSizes } from '@edulastic/common'
import { bannerActions } from '@edulastic/constants/const/bannerActions'
import { segmentApi } from '@edulastic/api'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import ItemBankTrialUsedModal from './components/FeaturedContentBundle/ItemBankTrialUsedModal'
import SubscriptionAddonModal from './components/SubscriptionAddonModal'
import Classes from './components/Classes/Classes'
import Launch from '../../../LaunchHangout/Launch'

// ducks
import { slice } from '../../../../../Subscription/ducks'
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import { fetchCleverClassListRequestAction } from '../../../../../ManageClass/ducks'
import { addPermissionRequestAction } from '../../../../../ContentCollections/ducks'
import { receiveTeacherDashboardAction } from '../../../../ducks'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { resetTestFiltersAction } from '../../../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../../../Playlist/ducks'
import { getCollectionsSelector } from '../../../../../src/selectors/user'
import ItemPurchaseModal from './components/ItemPurchaseModal'
import TrialModal from './components/TrialModal'
import UpgradeModal from '../../../../../Subscription/components/SubscriptionHeader/UpgradeModal'
import PaymentServiceModal from '../../../../../Subscription/components/PaymentServiceModal'
import PayWithPoModal from '../../../../../Subscription/components/SubscriptionHeader/PayWithPoModal'
import TrialConfirmationModal from './components/FeaturedContentBundle/TrialConfimationModal'

const PREMIUM_TAG = 'PREMIUM'

const sortByOrder = (prop) =>
  prop.sort((a, b) => a.config?.order - b.config?.order)

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000

const MyClasses = ({
  getTeacherDashboard,
  classData,
  loading,
  history,
  getDictCurriculums,
  receiveSearchCourse,
  districtId,
  fetchCleverClassList,
  user,
  showCleverSyncModal,
  dashboardTiles,
  windowWidth,
  resetTestFilters,
  resetPlaylistFilters,
  collections,
  addPermissionRequest,
  isPremiumTrialUsed,
  startTrialAction,
  usedTrialItemBankId,
  verificationPending,
  stripePaymentAction,
  showTrialSubsConfirmationAction,
  isSuccess,
  isConfirmationModalVisible,
  subscription: { subEndDate } = {},
  premiumProductId,
}) => {
  const [showBannerModal, setShowBannerModal] = useState(null)
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [productData, setProductData] = useState({})
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [paymentServiceModal, setPaymentServiceModal] = useState(false)
  const [payWithPoModal, setPayWithPoModal] = useState(false)
  const [showItemBankTrialUsedModal, setShowItemBankTrialUsedModal] = useState(
    false
  )
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )

  useEffect(() => {
    // fetch clever classes on modal display
    if (showCleverSyncModal) {
      fetchCleverClassList()
    }
  }, [showCleverSyncModal])

  useEffect(() => {
    getTeacherDashboard()
    getDictCurriculums()
    receiveSearchCourse({ districtId, active: 1 })
  }, [])

  const openPaymentServiceModal = () => {
    setPaymentServiceModal(true)
    segmentApi.trackTeacherClickOnUpgradeSubscription({ user })
  }

  const openPoServiceModal = () => {
    setPayWithPoModal(true)
  }

  const closePaymentServiceModal = () => setPaymentServiceModal(false)

  const isPremiumUser = user.features.premium

  const sortableClasses = classData
    .filter((d) => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate)
  const unSortableClasses = classData.filter(
    (d) => d.asgnStartDate === null || d.asgnStartDate === undefined
  )

  const allClasses = [...sortableClasses, ...unSortableClasses]
  const allActiveClasses = allClasses.filter(
    (c) => c.active === 1 && c.type === 'class'
  )

  const handleContentRedirect = (filters, contentType) => {
    const entries = filters.reduce((a, c) => ({ ...a, ...c }), {
      removeInterestedFilters: true,
    })
    const filter = qs.stringify(entries)

    if (contentType === 'tests') {
      resetTestFilters()
    } else {
      resetPlaylistFilters()
    }
    history.push(`/author/${contentType}?${filter}`)
  }

  const hasAccessToItemBank = (itemBankId) =>
    collections.some((collection) => collection._id === itemBankId)

  const handleBlockedClick = ({ subscriptionData }) => {
    const isItemBankUsed = usedTrialItemBankId === subscriptionData?.productId
    if (isItemBankUsed) {
      setShowItemBankTrialUsedModal(true)
    } else {
      setIsPurchaseModalVisible(true)
    }
    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankUsed: isItemBankUsed,
    })
  }

  const togglePurchaseModal = (value) => setIsPurchaseModalVisible(value)
  const toggleTrialModal = (value) => setIsTrialModalVisible(value)
  const handleCloseItemTrialModal = () => {
    setShowItemBankTrialUsedModal(false)
  }

  const handlePurchaseFlow = () => {
    setShowSubscriptionAddonModal(true)
    setIsPurchaseModalVisible(false)
    setShowItemBankTrialUsedModal(false)
  }

  const handleFeatureClick = ({ config = {}, tags = [], isBlocked }) => {
    const { filters, contentType } = config

    if (isBlocked) {
      handleBlockedClick(config)
      return
    }

    const content = contentType?.toLowerCase() || 'tests'
    if (tags.includes(PREMIUM_TAG)) {
      if (isPremiumUser) {
        handleContentRedirect(filters, content)
      } else {
        history.push(`/author/subscription`)
      }
    } else {
      handleContentRedirect(filters, content)
    }
  }

  const getFeatureBundles = (bundles) =>
    bundles.map((bundle) => {
      const { subscriptionData } = bundle.config
      if (!subscriptionData?.productId) {
        return bundle
      }

      const { imageUrl: imgUrl, premiumImageUrl } = bundle
      const isBlocked = !hasAccessToItemBank(subscriptionData.itemBankId)
      const imageUrl = isBlocked ? premiumImageUrl : imgUrl

      return {
        ...bundle,
        isBlocked,
        imageUrl,
      }
    })

  const { BANNER, FEATURED } = groupBy(dashboardTiles, 'type')
  const bannerSlides = sortByOrder(BANNER || [])
  const featuredBundles = sortByOrder(getFeatureBundles(FEATURED || []))

  const isEurekaMathActive = useMemo(
    () =>
      collections.some(
        (itemBank) =>
          itemBank.owner === 'Great Minds DATA' &&
          itemBank.name === 'Eureka Math'
      ),
    [collections]
  )

  let filteredBundles = featuredBundles

  if (isEurekaMathActive) {
    filteredBundles = featuredBundles.filter(
      (feature) => feature.description !== 'Engage NY'
    )
  }

  const handleInAppRedirect = (data) => {
    const filter = qs.stringify(data.filters)
    history.push(`/author/${data.contentType}?${filter}`)
  }

  const handleExternalRedirect = (data) => {
    window.open(data.externalUrl, '_blank')
  }

  const bannerActionHandler = (filter = {}, description) => {
    const { action, data } = filter
    segmentApi.trackUserClick({
      user,
      data: { event: `dashboard:banner-${description}:click` },
    })
    switch (+action) {
      case bannerActions.BANNER_DISPLAY_IN_MODAL:
        setShowBannerModal(data)
        break
      case bannerActions.BANNER_APP_REDIRECT:
        handleInAppRedirect(data)
        break
      case bannerActions.BANNER_EXTERNAL_REDIRECT:
        handleExternalRedirect(data)
        break
      default:
        break
    }
  }

  if (loading) {
    return <Spin style={{ marginTop: '80px' }} />
  }

  const widthOfTilesWithMargin = 240 + 2 // 240 is width of tile and 2 is margin-right for each tile

  const GridCountInARow = Math.floor(
    (windowWidth - 120) / widthOfTilesWithMargin
  ) // here 120 is width of side-menu 70px and padding of container 50px

  const getClassCardModular = allActiveClasses.length % GridCountInARow
  const classEmptyBoxCount = getClassCardModular
    ? new Array(GridCountInARow - getClassCardModular).fill(1)
    : []

  const getFeatureCardModular = filteredBundles.length % GridCountInARow
  const featureEmptyBoxCount = getFeatureCardModular
    ? new Array(GridCountInARow - getFeatureCardModular).fill(1)
    : []

  const isAboutToExpire = subEndDate
    ? Date.now() + ONE_MONTH > subEndDate
    : false

  const formatTrialEndDate = moment(subEndDate).format('DD MMM, YYYY')

  return (
    <MainContentWrapper padding="30px 25px">
      {!loading && allActiveClasses?.length === 0 && (
        <BannerSlider
          bannerSlides={bannerSlides}
          handleBannerModalClose={() => setShowBannerModal(null)}
          bannerActionHandler={bannerActionHandler}
          isBannerModalVisible={showBannerModal}
        />
      )}
      <Classes
        activeClasses={allActiveClasses}
        emptyBoxCount={classEmptyBoxCount}
      />
      <FeaturedContentBundle
        featuredBundles={filteredBundles}
        handleFeatureClick={handleFeatureClick}
        emptyBoxCount={featureEmptyBoxCount}
      />
      <Launch />
      <SubscriptionAddonModal
        isVisible={showSubscriptionAddonModal}
        handleCloseModal={setShowSubscriptionAddonModal}
        isPremiumUser={isPremiumUser}
        setShowUpgradeModal={setShowUpgradeModal}
      />
      <ItemBankTrialUsedModal
        title={productData.productName}
        isVisible={showItemBankTrialUsedModal}
        handleCloseModal={handleCloseItemTrialModal}
        handlePurchaseFlow={handlePurchaseFlow}
      />
      {isPurchaseModalVisible && (
        <ItemPurchaseModal
          title={productData.productName}
          description={productData.description}
          productId={productData.productId}
          hasTrial={productData.hasTrial}
          isVisible={isPurchaseModalVisible}
          toggleModal={togglePurchaseModal}
          toggleTrialModal={toggleTrialModal}
          isPremiumTrialUsed={isPremiumTrialUsed}
          isPremiumUser={isPremiumUser}
          handlePurchaseFlow={handlePurchaseFlow}
        />
      )}
      {isTrialModalVisible && (
        <TrialModal
          description={productData.description}
          productId={productData.productId}
          productName={productData.productName}
          userInfo={user}
          addItemBankPermission={addPermissionRequest}
          isVisible={isTrialModalVisible}
          toggleModal={toggleTrialModal}
          isPremiumUser={isPremiumUser}
          isPremiumTrialUsed={isPremiumTrialUsed}
          startPremiumTrial={startTrialAction}
          premiumProductId={premiumProductId}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
        />
      )}
      <UpgradeModal
        visible={showUpgradeModal}
        setShowModal={setShowUpgradeModal}
        openPaymentServiceModal={openPaymentServiceModal}
        openPoServiceModal={openPoServiceModal}
      />
      <PaymentServiceModal
        visible={paymentServiceModal && (isAboutToExpire || !isSuccess)}
        closeModal={closePaymentServiceModal}
        verificationPending={verificationPending}
        stripePaymentAction={stripePaymentAction}
        user={user}
        premiumProductId={premiumProductId}
        reason="Premium Upgrade"
      />
      <PayWithPoModal
        visible={payWithPoModal}
        setShowModal={setPayWithPoModal}
      />
      {formatTrialEndDate && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
          usedTrialItemBankId={usedTrialItemBankId}
          isPremiumUser={isPremiumUser}
          isPremiumTrialUsed={isPremiumTrialUsed}
          subEndDate={formatTrialEndDate}
        />
      )}
    </MainContentWrapper>
  )
}

export default compose(
  withWindowSizes,
  withRouter,
  connect(
    (state) => ({
      classData: state.dashboardTeacher.data,
      districtId: state.user.user?.orgData?.districtIds?.[0],
      loading: state.dashboardTeacher.loading,
      user: getUserDetails(state),
      showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
      collections: getCollectionsSelector(state),
      isPremiumTrialUsed:
        state?.subscription?.subscriptionData?.isPremiumTrialUsed,
      usedTrialItemBankId:
        state?.subscription?.subscriptionData?.usedTrialItemBankId,
      premiumProductId: state?.subscription?.subscriptionData?.premiumProductId,
      verificationPending: state?.subscription?.verificationPending,
      isSuccess: state?.subscription?.subscriptionData?.success,
      subscription: state?.subscription?.subscriptionData?.subscription,
      isConfirmationModalVisible:
        state?.subscription?.showTrialSubsConfirmation,
    }),
    {
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      resetTestFilters: resetTestFiltersAction,
      resetPlaylistFilters: clearPlaylistFiltersAction,
      addPermissionRequest: addPermissionRequestAction,
      startTrialAction: slice.actions.startTrialAction,
      stripePaymentAction: slice.actions.stripePaymentAction,
      showTrialSubsConfirmationAction:
        slice.actions.trialSubsConfirmationAction,
    }
  )
)(MyClasses)
