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
import notification from '@edulastic/common/src/components/Notification'
import { segmentApi } from '@edulastic/api'
import configurableTilesApi from '@edulastic/api/src/configurableTiles'
import { signUpState } from '@edulastic/constants'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import ItemBankTrialUsedModal from './components/FeaturedContentBundle/ItemBankTrialUsedModal'
import Classes from './components/Classes/Classes'
import Launch from '../../../LaunchHangout/Launch'
import PurchaseFlowModals from '../../../../../src/components/common/PurchaseModals'
import { productsMetaData } from '../../../../../src/components/common/PurchaseModals/ProductsMetaData'
import SubjectGradeForm from '../../../../../../student/Signup/components/TeacherContainer/SubjectGrade'

// ducks
import {
  slice,
  trialPeriodTextSelector,
} from '../../../../../Subscription/ducks'
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import { fetchCleverClassListRequestAction } from '../../../../../ManageClass/ducks'
import { receiveTeacherDashboardAction } from '../../../../ducks'
import {
  getUserDetails,
  isDemoPlaygroundUser,
  setUserAction,
} from '../../../../../../student/Login/ducks'
import { resetTestFiltersAction } from '../../../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../../../Playlist/ducks'
import {
  getCollectionsSelector,
  getInterestedSubjectsSelector,
  getUserOrgId,
} from '../../../../../src/selectors/user'
import TestRecommendations from './components/TestRecommendations'
import ClassBanner from './components/ClassBanner'
import AIFeaturedTiles from './components/AIFeaturedTiles'

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
  setUser,
  isDemoPlayground = false,
  interestedSubjects,
  totalAssignmentCount,
  displayText,
}) => {
  const [showBannerModal, setShowBannerModal] = useState(null)
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false)
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false)
  const [productData, setProductData] = useState({})
  const [clickedBundleId, setClickedBundleId] = useState(null)
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

  const { currentSignUpState } = user
  const isSignupCompleted = currentSignUpState === signUpState.DONE

  const saveRecommendedTests = (_data) => {
    const data = _data.map((x) => {
      return { ...x._source, _id: x._id }
    })
    if (user?.recommendedContentUpdated) {
      const isContentUpdatedAutomatically = JSON.parse(
        localStorage.getItem(
          `recommendedTest:${user?._id}:isContentUpdatedAutomatically`
        )
      )
      if (!isContentUpdatedAutomatically) {
        if (data?.length > 0) {
          notification({
            msg: 'Recommended content is updated.',
            type: 'success',
          })
        } else {
          notification({
            msg:
              'No recommended content found currently. We will show them when available.',
            type: 'info',
          })
        }
      }
      localStorage.setItem(
        `recommendedTest:${user?._id}:isContentUpdatedAutomatically`,
        false
      )
      const temp = user
      temp.recommendedContentUpdated = false
      setUser(temp)
    } else {
      localStorage.setItem(
        `recommendedTest:${user?._id}:isContentUpdatedAutomatically`,
        false
      )
    }
    if (!_data || !_data.length) {
      return
    }
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
        setTimeout(() => {
          configurableTilesApi
            .fetchRecommendedTest()
            .then((res) => saveRecommendedTests(res))
        }, 6000)
      }
    } else {
      configurableTilesApi
        .fetchRecommendedTest()
        .then((res) => saveRecommendedTests(res))
    }
  }

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
  const atleastOneClassPresent = allActiveClasses.length > 0
  useEffect(() => {
    if (totalAssignmentCount >= 5) {
      checkLocalRecommendedTests()
    }
  }, [user?.recommendedContentUpdated, totalAssignmentCount])

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
      usedTrialItemBankIds.includes(subscriptionData.itemBankId) ||
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
      blockInAppPurchase: subscriptionData.blockInAppPurchase,
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

  const handleFeatureClick = ({
    config = {},
    tags = [],
    isBlocked,
    ...rest
  }) => {
    const { filters, contentType, subscriptionData } = config
    segmentApi.genericEventTrack('FeaturedBundleClick', {
      ...rest,
      config,
      tags,
    })

    /**
     *  User purchased bank from different premium district
     *  and trying to access it in a free district
     */
    if (
      !isPremiumUser &&
      hasAccessToItemBank(config.subscriptionData?.itemBankId)
    ) {
      setShowItemBankTrialUsedModal(true)
      setProductData({
        productId: config?.subscriptionData?.productId,
        productName: config?.subscriptionData?.productName,
        description: config?.subscriptionData?.description,
        hasTrial: config?.subscriptionData?.hasTrial,
        itemBankId: config?.subscriptionData?.itemBankId,
        blockInAppPurchase: config?.subscriptionData?.blockInAppPurchase,
      })
      return
    }

    if (isBlocked) {
      handleBlockedClick(config)
      return
    }

    if (user?.orgData?.defaultGrades?.length > 0) {
      if (filters[0]?.grades?.length > 0) {
        const commonGrades = user?.orgData?.defaultGrades.filter((value) =>
          filters[0]?.grades?.includes(value)
        )
        if (filters[0]) {
          filters[0].grades = commonGrades
        }
      } else {
        filters[0].grades = user?.orgData?.defaultGrades
      }
    } else if (filters[0]) {
      filters[0].grades = []
    }

    if (user?.orgData?.defaultSubjects?.length > 0) {
      if (filters[0]?.subject?.length > 0) {
        const commonSub = user?.orgData?.defaultSubjects.filter((value) =>
          filters[0]?.subject?.includes(value)
        )
        if (filters[0]) {
          filters[0].subject = commonSub
        }
      } else {
        filters[0].subject = user?.orgData?.defaultSubjects
      }
    } else if (filters[0]) {
      filters[0].subject = []
    }

    let content = contentType?.toLowerCase() || 'tests_library'
    if (content === 'tests_library') {
      content = 'tests'
    } else if (content === 'playlists_library') {
      content = 'playlists'
    }
    if (filters?.[0]?.collections?.[0] || subscriptionData?.itemBankId) {
      setClickedBundleId(
        filters?.[0]?.collections?.[0] || subscriptionData?.itemBankId
      )
    }
    if (content === 'playlists') {
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
      const { subscriptionData } = bundle?.config
      if (
        !subscriptionData?.productId &&
        !subscriptionData?.blockInAppPurchase
      ) {
        return bundle
      }

      const { imageUrl: imgUrl, premiumImageUrl, trialImageUrl } = bundle
      const isBlocked = !hasAccessToItemBank(subscriptionData?.itemBankId)
      let isTrialExpired = false
      if (usedTrialItemBankIds.includes(subscriptionData?.itemBankId)) {
        isTrialExpired =
          itemBankSubscriptions.length > 0
            ? itemBankSubscriptions.filter(
                (x) => subscriptionData?.itemBankId === x.itemBankId
              ).length === 0
            : true
      }

      const imageUrl =
        isBlocked && !isTrialExpired && premiumImageUrl
          ? trialImageUrl
          : isTrialExpired
          ? premiumImageUrl
          : imgUrl

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

  const isSingaporeMath =
    user?.referrer?.includes('singapore') ||
    user?.utm_source?.toLowerCase()?.includes('singapore') ||
    collections.some((itemBank) =>
      itemBank?.owner?.toLowerCase().includes('singapore')
    )

  const isCpm =
    user?.utm_source?.toLowerCase()?.includes('cpm') ||
    user?.referrer?.toLowerCase()?.includes('cpm')

  const isEureka =
    user?.referrer?.toLowerCase()?.includes('eureka') ||
    user?.utm_source?.toLowerCase()?.includes('eureka')

  let filteredBundles = featuredBundles

  if (isEurekaMathActive || isEureka) {
    filteredBundles = filteredBundles.filter(
      (feature) =>
        feature.description !== 'Engage NY' &&
        !(
          feature?.config?.excludedPublishers?.includes('Eureka') ||
          feature?.config?.excludedPublishers?.includes('eureka')
        )
    )
    bannerSlides = bannerSlides.filter(
      (banner) =>
        !(
          banner?.config?.excludedPublishers?.includes('Eureka') ||
          banner?.config?.excludedPublishers?.includes('eureka')
        )
    )
  }

  if (isCliUser) {
    filteredBundles = filteredBundles.filter(
      (feature) => !feature?.config?.subscriptionData?.itemBankId
    )
    bannerSlides = bannerSlides.filter(
      (banner) => !banner.description?.toLowerCase()?.includes('spark')
    )
  }

  if (isSingaporeMath) {
    if (
      user?.orgData?.defaultGrades?.length > 0 &&
      user?.orgData?.defaultSubjects?.length > 0
    ) {
      filteredBundles = filteredBundles.filter(
        (feature) =>
          !(
            feature?.description?.toLowerCase()?.includes('engage ny') &&
            feature?.description?.toLowerCase()?.includes('math')
          ) &&
          !feature?.description?.toLowerCase()?.includes('sparkmath') &&
          !feature?.description?.toLowerCase()?.includes('spark math') &&
          !(
            feature?.config?.excludedPublishers?.includes('SingaporeMath') ||
            feature?.config?.excludedPublishers?.includes('Singapore Math')
          )
      )
    } else {
      filteredBundles = filteredBundles.filter(
        (feature) => feature?.config?.isSingaporeMath
      )
    }
  } else {
    filteredBundles = filteredBundles.filter(
      (feature) => !feature?.config?.isSingaporeMath
    )
  }

  if (isCpm) {
    if (
      user?.orgData?.defaultGrades?.length > 0 &&
      user?.orgData?.defaultSubjects?.length > 0
    ) {
      filteredBundles = filteredBundles.filter(
        (feature) =>
          !feature?.description?.toLowerCase()?.includes('sparkmath') &&
          !feature?.description?.toLowerCase()?.includes('spark math') &&
          !(
            feature?.config?.excludedPublishers?.includes('CPM') ||
            feature?.config?.excludedPublishers?.includes('cpm')
          )
      )
    } else {
      filteredBundles = filteredBundles.filter(
        (feature) => feature?.config?.isCPM
      )
    }
  } else {
    filteredBundles = filteredBundles.filter(
      (feature) => !feature?.config?.isCPM
    )
  }

  const handleInAppRedirect = (filters) => {
    if (user?.orgData?.defaultGrades?.length > 0) {
      if (filters?.grades?.length > 0) {
        const commonGrades = user?.orgData?.defaultGrades.filter((value) =>
          filters?.grades?.includes(value)
        )
        if (filters) {
          filters.grades = commonGrades
        }
      } else {
        filters.grades = user?.orgData?.defaultGrades
      }
    } else if (filters) {
      filters.grades = []
    }

    if (user?.orgData?.defaultSubjects?.length > 0) {
      if (filters?.subject?.length > 0) {
        const commonSub = user?.orgData?.defaultSubjects.filter((value) =>
          filters?.subject?.includes(value)
        )
        if (filters) {
          filters.subject = commonSub
        }
      } else {
        filters.subject = user?.orgData?.defaultSubjects
      }
    } else if (filters) {
      filters.subject = []
    }
    const filter = qs.stringify(filters)
    history.push(`/author/${filters?.data?.contentType}?${filter}`)
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
    if (!isEmpty(tile?.config)) {
      handleFeatureClick(tile)
    }
  }

  const bannerActionHandler = (filter = {}) => {
    const { action, data = {} } = filter
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
        handleInAppRedirect(filter)
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

    const subjects = interestedSubjects.map((x) => x.toUpperCase())

    const getProductsKeysByInterestedSubject = Object.entries(
      productsMetaData
    ).reduce((a, [_key, _value]) => {
      if (subjects.includes(_value.filters)) {
        return a.concat(_key)
      }
      return a
    }, [])

    const allAvailableItemProductIds = map(
      products.filter(
        (product) =>
          allAvailableTrialItemBankIds.includes(product.linkedProductId) &&
          getProductsKeysByInterestedSubject.includes(product.name)
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

  const widthOfTilesWithMargin = 240 + 8 // 240 is width of tile and 8 is margin-right for each tile

  const GridCountInARow = Math.floor(
    (windowWidth - 120) / widthOfTilesWithMargin
  ) // here 120 is width of side-menu 70px and padding of container 50px

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

  const showBannerSlide = !loading && totalAssignmentCount < 2
  const showRecommendedTests =
    totalAssignmentCount >= 5 && recommendedTests?.length > 0

  const hasAssignment = totalAssignmentCount >= 1

  const hideGetStartedHeader = classData.length >= 1

  const boughtItemBankIds = itemBankSubscriptions.map((x) => x.itemBankId) || []

  return (
    <MainContentWrapper padding="15px 25px">
      {atleastOneClassPresent ? (
        <Classes
          showBannerSlide={showBannerSlide}
          activeClasses={allActiveClasses}
          userId={user?._id}
          classData={classData}
          history={history}
          hasAssignment={hasAssignment}
          hideGetStartedHeader={hideGetStartedHeader}
        />
      ) : (
        <ClassBanner />
      )}
      {isPremiumUser && <AIFeaturedTiles />}
      {showBannerSlide && (
        <BannerSlider
          bannerSlides={bannerSlides}
          handleBannerModalClose={() => setShowBannerModal(null)}
          bannerActionHandler={bannerActionHandler}
          isBannerModalVisible={showBannerModal}
          setShowBannerModal={setShowBannerModal}
          handleSparkClick={handleSparkClick}
          accessibleItembankProductIds={accessibleItembankProductIds}
          windowWidth={windowWidth}
          history={history}
        />
      )}
      {showRecommendedTests && (
        <TestRecommendations
          recommendations={recommendedTests}
          setShowTestCustomizerModal={setShowTestCustomizerModal}
          userId={user?._id}
          windowWidth={windowWidth}
          history={history}
          isDemoPlaygroundUser={isDemoPlayground}
        />
      )}
      {!isCliUser && (
        <FeaturedContentBundle
          featuredBundles={filteredBundles}
          handleFeatureClick={handleFeatureClick}
          emptyBoxCount={featureEmptyBoxCount}
          isSignupCompleted={isSignupCompleted}
          totalAssignmentCount={totalAssignmentCount}
          isSingaporeMath={isSingaporeMath}
          isCpm={isCpm}
          boughtItemBankIds={boughtItemBankIds}
        />
      )}
      <Launch />
      <PurchaseFlowModals
        showSubscriptionAddonModal={showSubscriptionAddonModal}
        setShowSubscriptionAddonModal={setShowSubscriptionAddonModal}
        isConfirmationModalVisible={showTrialSubsConfirmation}
        setShowTrialSubsConfirmation={setShowTrialSubsConfirmation}
        defaultSelectedProductIds={defaultSelectedProductIds}
        setProductData={setProductData}
        trialAddOnProductIds={trialAddOnProductIds}
        clickedBundleId={clickedBundleId}
        setClickedBundleId={setClickedBundleId}
        isCpm={isCpm}
        interestedSubjects={interestedSubjects}
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
          hasTrial={productData.hasTrial}
          blockInAppPurchase={productData.blockInAppPurchase}
          hideTitle={isSingaporeMath && productData.blockInAppPurchase}
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
          displayText={displayText}
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
      totalAssignmentCount: state.dashboardTeacher?.allAssignmentCount,
      districtId: getUserOrgId(state),
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
      isDemoPlayground: isDemoPlaygroundUser(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      displayText: trialPeriodTextSelector(state),
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
      setUser: setUserAction,
    }
  )
)(MyClasses)
