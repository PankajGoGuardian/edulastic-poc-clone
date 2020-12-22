import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy } from 'lodash'
import qs from 'qs'

// components
import { Spin } from 'antd'
import { MainContentWrapper } from '@edulastic/common'
import { bannerActions } from '@edulastic/constants/const/bannerActions'
import BannerSlider from './components/BannerSlider/BannerSlider'
import FeaturedContentBundle from './components/FeaturedContentBundle/FeaturedContentBundle'
import Classes from './components/Classes/Classes'

import CreateClassPage from './components/CreateClassPage/createClassPage'
import Launch from '../../../LaunchHangout/Launch'
import ClassSelectModal from '../../../../../ManageClass/components/ClassListContainer/ClassSelectModal'
import CanvasClassSelectModal from '../../../../../ManageClass/components/ClassListContainer/CanvasClassSelectModal'

// ducks
import { getDictCurriculumsAction } from '../../../../../src/actions/dictionaries'
import { receiveSearchCourseAction } from '../../../../../Courses/ducks'
import {
  fetchClassListAction,
  fetchCleverClassListRequestAction,
  syncClassesWithCleverAction,
  getCleverClassListSelector,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  setShowCleverSyncModalAction,
} from '../../../../../ManageClass/ducks'
import { receiveTeacherDashboardAction } from '../../../../ducks'
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getCanvasAllowedInstitutionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getCleverLibraryUserSelector,
} from '../../../../../src/selectors/user'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { getFormattedCurriculumsSelector } from '../../../../../src/selectors/dictionaries'
import { clearTestFiltersAction } from '../../../../../TestList/ducks'
import { clearPlaylistFiltersAction } from '../../../../../Playlist/ducks'

const PREMIUM_TAG = 'PREMIUM'
const FREE_TAG = 'FREE'

const sortByOrder = (prop) =>
  prop.sort((a, b) => a.config?.order - b.config?.order)

const MyClasses = ({
  getTeacherDashboard,
  classData,
  loading,
  fetchClassList,
  history,
  isUserGoogleLoggedIn,
  getDictCurriculums,
  receiveSearchCourse,
  districtId,
  googleAllowedInstitutions,
  canvasAllowedInstitutions,
  courseList,
  loadingCleverClassList,
  cleverClassList,
  getStandardsListBySubject,
  fetchCleverClassList,
  syncCleverClassList,
  defaultGrades = [],
  defaultSubjects = [],
  isCleverUser,
  institutionIds,
  canvasCourseList,
  canvasSectionList,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  user,
  showCleverSyncModal,
  setShowCleverSyncModal,
  teacherData,
  dashboardTiles,
  clearTestFilters,
  clearPlaylistFilters,
}) => {
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false)
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

  const handleContentRedirect = (filters, isPlaylist) => {
    const entries = filters.reduce((a, c) => ({ ...a, ...c }), {})
    const filter = qs.stringify(entries)
    const contentType = isPlaylist ? 'playlists' : 'tests'
    if (isPlaylist) {
      clearPlaylistFilters()
    } else {
      clearTestFilters()
    }
    history.push(`/author/${contentType}?${filter}`)
  }

  const handleFeatureClick = ({ config = {}, tags = [] }) => {
    const { filters, isPlaylist } = config
    if (tags.includes(PREMIUM_TAG)) {
      if (premiumUser) {
        handleContentRedirect(filters, isPlaylist)
      } else {
        history.push(`/author/subscription`)
      }
    } else {
      handleContentRedirect(filters, isPlaylist)
    }
  }

  const { BANNER, TEST_BUNDLE } = groupBy(dashboardTiles, 'type')

  // TODO: remove this once done with demo and required data is available
  const filterContentByPremium = (content) =>
    content.filter((x) => x.tags.includes(premiumUser ? PREMIUM_TAG : FREE_TAG))

  const bannerSlides = sortByOrder(filterContentByPremium(BANNER || []))
  const testBundles = sortByOrder(filterContentByPremium(TEST_BUNDLE || []))

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

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  const closeCleverSyncModal = () => setShowCleverSyncModal(false)
  const closeCanvasSyncModal = () => setShowCanvasSyncModal(false)
  const hasNoActiveClassFallback =
    !loading &&
    allActiveClasses.length === 0 &&
    (googleAllowedInstitutions.length > 0 ||
      isCleverUser ||
      canvasAllowedInstitutions.length > 0)

  if (loading) {
    return <Spin style={{ marginTop: '80px' }} />
  }

  return (
    <MainContentWrapper padding="30px">
      <ClassSelectModal
        type="clever"
        visible={showCleverSyncModal}
        onSubmit={syncCleverClassList}
        onCancel={closeCleverSyncModal}
        loading={loadingCleverClassList}
        classListToSync={cleverClassList}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        refreshPage="dashboard"
        existingGroups={allClasses}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
      />
      <CanvasClassSelectModal
        visible={showCanvasSyncModal}
        onCancel={closeCanvasSyncModal}
        user={user}
        getCanvasCourseListRequest={getCanvasCourseListRequest}
        getCanvasSectionListRequest={getCanvasSectionListRequest}
        canvasCourseList={canvasCourseList}
        canvasSectionList={canvasSectionList}
        institutionId={institutionIds[0]}
      />
      {!loading && allActiveClasses?.length === 0 && (
        <BannerSlider
          bannerSlides={bannerSlides}
          handleBannerModalClose={() => setShowBannerModal(null)}
          bannerActionHandler={bannerActionHandler}
          isBannerModalVisible={showBannerModal}
        />
      )}
      {hasNoActiveClassFallback && (
        <CreateClassPage
          fetchClassList={fetchClassList}
          history={history}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={googleAllowedInstitutions.length > 0}
          canvasAllowedInstitutions={canvasAllowedInstitutions}
          enableCleverSync={isCleverUser}
          setShowCleverSyncModal={setShowCleverSyncModal}
          handleCanvasBulkSync={() => setShowCanvasSyncModal(true)}
          user={user}
          isClassLink={isClassLink}
        />
      )}
      {!loading && <Classes activeClasses={allActiveClasses} />}
      <FeaturedContentBundle
        testBundles={testBundles}
        handleFeatureClick={handleFeatureClick}
      />
      <Launch />
    </MainContentWrapper>
  )
}

export default compose(
  withRouter,
  connect(
    (state) => ({
      classData: state.dashboardTeacher.data,
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn'),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(
        state
      ),
      canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      districtId: state.user.user?.orgData?.districtIds?.[0],
      loading: state.dashboardTeacher.loading,
      user: getUserDetails(state),
      institutionIds: get(state, 'user.user.institutionIds', []),
      canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
      canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
      courseList: get(state, 'coursesReducer.searchResult'),
      isCleverUser: getCleverLibraryUserSelector(state),
      loadingCleverClassList: get(state, 'manageClass.loadingCleverClassList'),
      cleverClassList: getCleverClassListSelector(state),
      getStandardsListBySubject: (subject) =>
        getFormattedCurriculumsSelector(state, { subject }),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state),
      showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
      teacherData: get(state, 'dashboardTeacher.data', []),
    }),
    {
      fetchClassList: fetchClassListAction,
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      syncCleverClassList: syncClassesWithCleverAction,
      getCanvasCourseListRequest: getCanvasCourseListRequestAction,
      getCanvasSectionListRequest: getCanvasSectionListRequestAction,
      setShowCleverSyncModal: setShowCleverSyncModalAction,
      clearTestFilters: clearTestFiltersAction,
      clearPlaylistFilters: clearPlaylistFiltersAction,
    }
  )
)(MyClasses)
