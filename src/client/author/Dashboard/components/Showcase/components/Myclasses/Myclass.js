import React, { useState, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy, isEmpty, difference, map } from 'lodash'
import qs from 'qs'
import loadable from '@loadable/component'

// components
import { Spin } from 'antd'
import { MainContentWrapper, withWindowSizes } from '@edulastic/common'
import { bannerActions } from '@edulastic/constants/const/bannerActions'
import { segmentApi } from '@edulastic/api'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import ItemBankTrialUsedModal from './components/FeaturedContentBundle/ItemBankTrialUsedModal'
import Classes from './components/Classes/Classes'
import Launch from '../../../LaunchHangout/Launch'
import PurchaseFlowModals from '../../../../../src/components/common/PurchaseModals'

// ducks
import { slice } from '../../../../../Subscription/ducks'
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import { fetchCleverClassListRequestAction } from '../../../../../ManageClass/ducks'
import {
  receiveTeacherDashboardAction,
  fetchPlaylistsAction,
} from '../../../../ducks'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { resetTestFiltersAction } from '../../../../../TestList/ducks'
import {
  clearPlaylistFiltersAction,
  getLastPlayListSelector,
} from '../../../../../Playlist/ducks'
import { getCollectionsSelector } from '../../../../../src/selectors/user'

const ItemPurchaseModal = loadable(() =>
  import('./components/ItemPurchaseModal')
)
const TrialModal = loadable(() => import('./components/TrialModal'))
const TrialConfirmationModal = loadable(() =>
  import('./components/FeaturedContentBundle/TrialConfimationModal')
)

const PREMIUM_TAG = 'PREMIUM'

const sortByOrder = (prop) =>
  prop.sort((a, b) => a.config?.order - b.config?.order)

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
  isPremiumTrialUsed,
  itemBankSubscriptions = [],
  startTrialAction,
  usedTrialItemBankIds = [],
  showTrialSubsConfirmationAction,
  showTrialConfirmationMessage,
  isConfirmationModalVisible,
  subscription: { subType } = {},
  products,
  showHeaderTrialModal,
  setShowHeaderTrialModal,
  fetchPlaylists,
  playlists,
  lastPlayList,
}) => {
  const [showBannerModal, setShowBannerModal] = useState(null)
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [productData, setProductData] = useState({})
  const [showItemBankTrialUsedModal, setShowItemBankTrialUsedModal] = useState(
    false
  )
  const [showSubscriptionAddonModal, setShowSubscriptionAddonModal] = useState(
    false
  )
  const [trialAddOnProductIds, setTrialAddOnProductIds] = useState([])

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

  const isPremiumUser = user?.features?.premium

  /**
   *  a user is paid premium user if
   *  - subType exists and
   *  - premium is not through trial ie, only - (enterprise, premium, partial_premium) and
   *  - is partial premium user & premium is true
   *
   * TODO: refactor and define this at the top level
   */
  const isPaidPremium = !(
    !subType ||
    subType === 'TRIAL_PREMIUM' ||
    (subType === 'partial_premium' && !isPremiumUser)
  )

  const isCliUser = user.openIdProvider === 'CLI'

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
    if (
      usedTrialItemBankIds.includes(subscriptionData.productId) ||
      (isPremiumTrialUsed && !isPremiumUser)
    ) {
      setShowItemBankTrialUsedModal(true)
    } else {
      setIsPurchaseModalVisible(true)
    }
    setProductData({
      productId: subscriptionData.productId,
      productName: subscriptionData.productName,
      description: subscriptionData.description,
      hasTrial: subscriptionData.hasTrial,
      itemBankId: subscriptionData.itemBankId,
    })
  }

  const togglePurchaseModal = (value) => setIsPurchaseModalVisible(value)
  const toggleTrialModal = (value) => setIsTrialModalVisible(value)
  const handleCloseItemTrialModal = () => setShowItemBankTrialUsedModal(false)

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

    if (content === 'playlists' && (!lastPlayList || !lastPlayList.value)) {
      showTrialSubsConfirmationAction(true)
      return
    }
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
  let bannerSlides = sortByOrder(BANNER || [])
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
    filteredBundles = filteredBundles.filter(
      (feature) => feature.description !== 'Engage NY'
    )
  }

  if (isCliUser) {
    filteredBundles = filteredBundles.filter(
      (feature) => !feature?.config?.subscriptionData?.itemBankId
    )
    bannerSlides = bannerSlides.filter(
      (banner) => !banner.description?.toLowerCase?.()?.includes('spark')
    )
  }

  const handleInAppRedirect = (data) => {
    const filter = qs.stringify(data.filters)
    history.push(`/author/${data.contentType}?${filter}`)
  }

  const handleExternalRedirect = (data) => {
    window.open(data.externalUrl, '_blank')
  }

  const getTileByProductId = (productId) => {
    if (productId) {
      return (
        featuredBundles &&
        featuredBundles.find(
          (bundle) => bundle?.config?.subscriptionData?.productId === productId
        )
      )
    }

    return {}
  }

  const handleSparkClick = (id) => {
    const tile = getTileByProductId(id)
    if (!isEmpty(tile.config)) {
      handleFeatureClick(tile)
    }
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

  const { productItemBankIds = [] } = useMemo(() => {
    if (products) {
      const itemBankProducts = products.filter(({ type }) => type !== 'PREMIUM')
      return {
        productItemBankIds: itemBankProducts.map(
          ({ linkedProductId }) => linkedProductId
        ),
      }
    }
    return {}
  }, [products])

  const accessibleItembankProductIds = useMemo(() => {
    const collectionIds = collections.map((collection) => collection._id)

    return products.reduce((a, c) => {
      if (collectionIds.includes(c?.linkedProductId)) {
        return a.concat(c.id)
      }
      return a
    }, [])
  }, [products, collections])

  const paidItemBankIds = useMemo(() => {
    if (!itemBankSubscriptions) {
      return []
    }

    return itemBankSubscriptions
      .filter(
        (subscription) =>
          // only include the itembanks which are sold as products
          !subscription.isTrial &&
          productItemBankIds.includes(subscription.itemBankId)
      )
      .map((subscription) => subscription.itemBankId)
  }, [itemBankSubscriptions])

  const productsToShowInTrialModal = useMemo(() => {
    if (!showHeaderTrialModal || isTrialModalVisible) {
      return [productData.productId]
    }

    // if the product has paid subscription or the trial is used then its not available for trial.
    const allAvailableTrialItemBankIds = difference(productItemBankIds, [
      ...paidItemBankIds,
      ...usedTrialItemBankIds,
    ])

    const allAvailableItemProductIds = map(
      products.filter((product) =>
        allAvailableTrialItemBankIds.includes(product.linkedProductId)
      ),
      'id'
    )

    return allAvailableItemProductIds
  }, [
    itemBankSubscriptions,
    products,
    showHeaderTrialModal,
    isTrialModalVisible,
  ])

  if (loading) {
    return <Spin style={{ marginTop: '80px' }} />
  }

  const handleGoToCollectionClick = (productId) => {
    const featuredBundle =
      featuredBundles &&
      featuredBundles.find(
        (bundle) => bundle?.config?.subscriptionData?.productId === productId
      )
    handleFeatureClick(featuredBundle)
    showTrialSubsConfirmationAction(false)
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

  const isTrialItemBank =
    itemBankSubscriptions &&
    itemBankSubscriptions?.length > 0 &&
    itemBankSubscriptions?.filter((x) => {
      return x.itemBankId === productData?.itemBankId && x.isTrial
    })?.length > 0

  const showTrialButton =
    (!isPremiumTrialUsed || !isPaidPremium) && !isTrialItemBank

  const isCurrentItemBankUsed = usedTrialItemBankIds.includes(
    productData?.itemBankId
  )

  const defaultSelectedProductIds = productData.productId
    ? [productData.productId]
    : []

  return (
    <MainContentWrapper padding="30px 25px">
      {!loading && allActiveClasses?.length === 0 && (
        <BannerSlider
          bannerSlides={bannerSlides}
          handleBannerModalClose={() => setShowBannerModal(null)}
          bannerActionHandler={bannerActionHandler}
          isBannerModalVisible={showBannerModal}
          handleSparkClick={handleSparkClick}
          accessibleItembankProductIds={accessibleItembankProductIds}
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
      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        defaultSelectedProductIds={defaultSelectedProductIds}
        setProductData={setProductData}
      />
      {showItemBankTrialUsedModal && (
        <ItemBankTrialUsedModal
          title={productData.productName}
          isVisible={showItemBankTrialUsedModal}
          handleCloseModal={handleCloseItemTrialModal}
          handlePurchaseFlow={handlePurchaseFlow}
          isCurrentItemBankUsed={isCurrentItemBankUsed}
        />
      )}
      {isPurchaseModalVisible && (
        <ItemPurchaseModal
          title={productData.productName}
          description={productData.description}
          productId={productData.productId}
          isVisible={isPurchaseModalVisible}
          toggleModal={togglePurchaseModal}
          toggleTrialModal={toggleTrialModal}
          handlePurchaseFlow={handlePurchaseFlow}
          showTrialButton={showTrialButton}
          isPremiumUser={isPremiumUser}
        />
      )}
      {(isTrialModalVisible || showHeaderTrialModal) && (
        <TrialModal
          addOnProductIds={productsToShowInTrialModal}
          isVisible={isTrialModalVisible || showHeaderTrialModal}
          toggleModal={toggleTrialModal}
          isPremiumUser={isPremiumUser}
          isPremiumTrialUsed={isPremiumTrialUsed}
          startPremiumTrial={startTrialAction}
          products={products}
          setShowHeaderTrialModal={setShowHeaderTrialModal}
          setTrialAddOnProductIds={setTrialAddOnProductIds}
        />
      )}
      {isConfirmationModalVisible && (
        <TrialConfirmationModal
          visible={isConfirmationModalVisible}
          showTrialSubsConfirmationAction={showTrialSubsConfirmationAction}
          showTrialConfirmationMessage={showTrialConfirmationMessage}
          trialAddOnProductIds={trialAddOnProductIds}
          collections={collections}
          products={products}
          handleGoToCollectionClick={handleGoToCollectionClick}
          history={history}
          fetchPlaylists={fetchPlaylists}
          playlists={playlists}
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
        state.subscription?.subscriptionData?.isPremiumTrialUsed,
      itemBankSubscriptions:
        state.subscription?.subscriptionData?.itemBankSubscriptions,
      usedTrialItemBankIds:
        state.subscription?.subscriptionData?.usedTrialItemBankIds,
      subscription: state.subscription?.subscriptionData?.subscription,
      isConfirmationModalVisible: state.subscription?.showTrialSubsConfirmation,
      showTrialConfirmationMessage:
        state.subscription?.showTrialConfirmationMessage,
      products: state.subscription?.products,
      showHeaderTrialModal: state.subscription?.showHeaderTrialModal,
      playlists: state.dashboardTeacher.playlists,
      lastPlayList: getLastPlayListSelector(state),
    }),
    {
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      resetTestFilters: resetTestFiltersAction,
      resetPlaylistFilters: clearPlaylistFiltersAction,
      startTrialAction: slice.actions.startTrialAction,
      showTrialSubsConfirmationAction:
        slice.actions.trialSubsConfirmationAction,
      setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
      fetchPlaylists: fetchPlaylistsAction,
    }
  )
)(MyClasses)
