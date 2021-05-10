import React, { useState, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy, isEmpty, difference, map } from 'lodash'
import qs from 'qs'
import loadable from '@loadable/component'

// components
import { Spin } from 'antd'
import {
  MainContentWrapper,
  withWindowSizes,
  CustomModalStyled,
} from '@edulastic/common'
import { bannerActions } from '@edulastic/constants/const/bannerActions'
import { segmentApi } from '@edulastic/api'
import configurableTilesApi from '@edulastic/api/src/configurableTiles'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import ItemBankTrialUsedModal from './components/FeaturedContentBundle/ItemBankTrialUsedModal'
import Classes from './components/Classes/Classes'
import Launch from '../../../LaunchHangout/Launch'
import PurchaseFlowModals from '../../../../../src/components/common/PurchaseModals'
import SubjectGradeForm from '../../../../../../student/Signup/components/TeacherContainer/SubjectGrade'

// ducks
import { slice } from '../../../../../Subscription/ducks'
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import { fetchCleverClassListRequestAction } from '../../../../../ManageClass/ducks'
import { receiveTeacherDashboardAction } from '../../../../ducks'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { resetTestFiltersAction } from '../../../../../TestList/ducks'
import {
  clearPlaylistFiltersAction,
  getLastPlayListSelector,
} from '../../../../../Playlist/ducks'
import { getCollectionsSelector } from '../../../../../src/selectors/user'
import TestRecommendations from './components/TestRecommendations'

const ItemPurchaseModal = loadable(() =>
  import('./components/ItemPurchaseModal')
)
const TrialModal = loadable(() => import('./components/TrialModal'))

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
  subscription: { subType } = {},
  products,
  showHeaderTrialModal,
  setShowHeaderTrialModal,
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
  const [showTestCustomizerModal, setShowTestCustomizerModal] = useState(false)
  const [trialAddOnProductIds, setTrialAddOnProductIds] = useState([])
  const [recommendedTests, setRecommendedTests] = useState([])

  const [showTrialSubsConfirmation, setShowTrialSubsConfirmation] = useState(
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

  const saveRecommendedTests = (_data) => {
    if (!_data || !_data.length) {
      return
    }
    const data = _data.map((x) => {
      return { ...x._source, _id: x._id }
    })
    localStorage.setItem(
      `recommendedTest:${user?._id}:stored`,
      JSON.stringify(data)
    )
    setRecommendedTests(data)
  }

  const checkLocalRecommendedTests = () => {
    const recommendedTestsLocal = localStorage.getItem(
      `recommendedTest:${user?._id}:stored`
    )
    if (recommendedTestsLocal) {
      setRecommendedTests(JSON.parse(recommendedTestsLocal))
      if (user?.recommendedContentUpdated) {
        configurableTilesApi
          .fetchRecommendedTest()
          .then((res) => saveRecommendedTests(res))
      }
    } else {
      configurableTilesApi
        .fetchRecommendedTest()
        .then((res) => saveRecommendedTests(res))
    }
  }

  useEffect(() => {
    checkLocalRecommendedTests()
  }, [user?.recommendedContentUpdated])

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
    if (contentType === 'playlist') {
      history.push(`/author/playlists/${filters[0]?._id}#review`)
    } else {
      history.push(`/author/${contentType}?${filter}`)
    }
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

    let content = contentType?.toLowerCase() || 'tests_library'
    if (content === 'tests_library') {
      content = 'tests'
    } else if (content === 'playlists_library') {
      content = 'playlists'
    }
    if (content === 'playlists' && (!lastPlayList || !lastPlayList.value)) {
      setShowTrialSubsConfirmation(true)
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

    const content = data?.contentType?.toLowerCase() || 'tests_library'
    if (content === 'tests_library') {
      data.contentType = 'tests'
    } else if (content === 'playlists_library') {
      data.contentType = 'playlists'
    }
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
        userId={user?._id}
      />
      {recommendedTests?.length > 0 && (
        <TestRecommendations
          recommendations={recommendedTests}
          setShowTestCustomizerModal={setShowTestCustomizerModal}
          userId={user?._id}
          windowWidth={windowWidth}
          history={history}
        />
      )}
      <FeaturedContentBundle
        featuredBundles={filteredBundles}
        handleFeatureClick={handleFeatureClick}
        emptyBoxCount={featureEmptyBoxCount}
      />
      <Launch />
      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        isConfirmationModalVisible={showTrialSubsConfirmation}
        setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        defaultSelectedProductIds={defaultSelectedProductIds}
        setProductData={setProductData}
        trialAddOnProductIds={trialAddOnProductIds}
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
          setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
          startPremiumTrial={startTrialAction}
          products={products}
          setShowHeaderTrialModal={setShowHeaderTrialModal}
          setTrialAddOnProductIds={setTrialAddOnProductIds}
        />
      )}
      {showTestCustomizerModal && (
        <CustomModalStyled
          title="What do you teach?"
          visible={showTestCustomizerModal}
          footer={null}
          width="900px"
          onCancel={() => setShowTestCustomizerModal(false)}
          centered
        >
          <SubjectGradeForm
            userInfo={user}
            districtId={false}
            isTestRecommendationCustomizer
            isModal
            setShowTestCustomizerModal={setShowTestCustomizerModal}
          />
        </CustomModalStyled>
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
      products: state.subscription?.products,
      showHeaderTrialModal: state.subscription?.showHeaderTrialModal,
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
      setShowHeaderTrialModal: slice.actions.setShowHeaderTrialModal,
    }
  )
)(MyClasses)
