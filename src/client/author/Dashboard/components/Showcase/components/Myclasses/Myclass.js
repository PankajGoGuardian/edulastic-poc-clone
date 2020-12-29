import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy } from 'lodash'
import qs from 'qs'

// components
import { Spin } from 'antd'
import { MainContentWrapper, withWindowSizes } from '@edulastic/common'
import { bannerActions } from '@edulastic/constants/const/bannerActions'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import Classes from './components/Classes/Classes'
import Launch from '../../../LaunchHangout/Launch'

// ducks
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import { fetchCleverClassListRequestAction } from '../../../../../ManageClass/ducks'
import { receiveTeacherDashboardAction } from '../../../../ducks'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { resetTestFiltersAction } from '../../../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../../../Playlist/ducks'

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
}) => {
  const [showBannerModal, setShowBannerModal] = useState(null)

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

  const premiumUser = user.features.premium

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
      hasNoInterestedFilters: true,
    })
    const filter = qs.stringify(entries)

    if (contentType === 'tests') {
      resetTestFilters()
    } else {
      resetPlaylistFilters()
    }
    history.push(`/author/${contentType}?${filter}`)
  }

  const handleFeatureClick = ({ config = {}, tags = [] }) => {
    const { filters, contentType } = config
    const content = contentType?.toLowerCase() || 'tests'
    if (tags.includes(PREMIUM_TAG)) {
      if (premiumUser) {
        handleContentRedirect(filters, content)
      } else {
        history.push(`/author/subscription`)
      }
    } else {
      handleContentRedirect(filters, content)
    }
  }

  const { BANNER, FEATURED } = groupBy(dashboardTiles, 'type')
  const bannerSlides = sortByOrder(BANNER || [])
  const featuredBundles = sortByOrder(FEATURED || [])

  const handleInAppRedirect = (data) => {
    const filter = qs.stringify(data.filters)
    history.push(`/author/${data.contentType}?${filter}`)
  }

  const handleExternalRedirect = (data) => {
    window.open(data.externalUrl, '_blank')
  }

  const bannerActionHandler = (filter = {}) => {
    // NOTE: Actions might need further refactor
    const { action, data } = filter
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

  const widthOfTilesWithMargin = 240 + 7 // 240 is width of tile and 7 is margin-right for each tile

  const GridCountInARow = Math.floor(
    (windowWidth - 130) / widthOfTilesWithMargin
  ) // here 130 is width of side-menu 70px and padding of container 60px

  const getClassCardModular = allActiveClasses.length % GridCountInARow
  const classEmptyBoxCount = getClassCardModular
    ? new Array(GridCountInARow - getClassCardModular).fill(1)
    : []

  const getFeatureCardModular = featuredBundles.length % GridCountInARow
  const featureEmptyBoxCount = getFeatureCardModular
    ? new Array(GridCountInARow - getFeatureCardModular).fill(1)
    : []

  return (
    <MainContentWrapper padding="30px">
      {!loading && allActiveClasses?.length === 0 && (
        <BannerSlider
          bannerSlides={bannerSlides}
          handleBannerModalClose={() => setShowBannerModal(null)}
          bannerActionHandler={bannerActionHandler}
          isBannerModalVisible={showBannerModal}
        />
      )}
      {!loading && (
        <Classes
          activeClasses={allActiveClasses}
          emptyBoxCount={classEmptyBoxCount}
        />
      )}
      <FeaturedContentBundle
        featuredBundles={featuredBundles}
        handleFeatureClick={handleFeatureClick}
        emptyBoxCount={featureEmptyBoxCount}
      />
      <Launch />
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
    }),
    {
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      resetTestFilters: resetTestFiltersAction,
      resetPlaylistFilters: clearPlaylistFiltersAction,
    }
  )
)(MyClasses)
