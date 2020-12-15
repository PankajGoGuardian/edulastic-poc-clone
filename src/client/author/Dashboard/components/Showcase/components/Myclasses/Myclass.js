import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy, debounce } from 'lodash'
import qs from 'qs'

// components
import { Spin } from 'antd'
import { FlexContainer, MainContentWrapper } from '@edulastic/common'
import { title, white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import bannerActions from '@edulastic/constants/const/bannerActions'
import { TextWrapper } from '../../../styledComponents'
import {
  CardContainer,
  FeatureContentWrapper,
  BundleContainer,
  Bottom,
  ScrollbarContainer,
  Slides,
  PrevButton,
  NextButton,
  SliderContainer,
} from './styled'

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
import Card from './components/Card'

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
}) => {
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false)

  const scrollBarRef = useRef(null)

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
  const ClassCards = allActiveClasses.map((item) => (
    <CardContainer key={item._id}>
      <Card data={item} />
    </CardContainer>
  ))

  const handleFeatureClick = (prop) => {
    const entries = prop.reduce((a, c) => ({ ...a, ...c }), {})
    const filter = qs.stringify(entries)
    history.push(`/author/tests?${filter}`)
  }

  const { BANNER, TEST_BUNDLE } = groupBy(dashboardTiles, 'type')
  const bannerSlides = BANNER || []
  const testBundle = TEST_BUNDLE || []

  const bannerActionHandler = (actionConstant) => {
    switch (actionConstant) {
      case bannerActions.BANNER_GET_STARTED:
        // TODO: Implement action handlers once data is populated in DB
        break
      default:
        break
    }
  }

  const FeatureContentCards = testBundle.map((bundle) => (
    <BundleContainer
      onClick={() => handleFeatureClick(bundle.config.filters || [])}
      bgImage={bundle.imageUrl}
      key={bundle._id}
    >
      <Bottom>{bundle.description && <div> {bundle.description} </div>}</Bottom>
    </BundleContainer>
  ))

  const bannerLength = bannerSlides.length

  const Banner = bannerSlides.map((slide, index) => (
    <Slides
      className={bannerLength === index + 1 ? 'last' : ''}
      bgImage={slide.imageUrl}
      key={slide._id}
      onClick={() => bannerActionHandler(slide.config.filters?.[0]?.action)}
    />
  ))

  const handleScroll = debounce((isScrollLeft) => {
    const scrollContainer = scrollBarRef.current._container
    const { scrollLeft, clientWidth } = scrollContainer
    const delta = isScrollLeft
      ? scrollLeft + clientWidth
      : scrollLeft - scrollLeft
    scrollContainer.scrollTo({
      left: delta,
      behavior: 'smooth',
    })
  }, 300)

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  const bannerScrollLeft = () => handleScroll(true)
  const bannerScrollRight = () => handleScroll(false)
  const closeCleverSyncModal = () => setShowCleverSyncModal(false)
  const closeCanvasSyncModal = () => setShowCanvasSyncModal(false)

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
      <SliderContainer>
        <PrevButton className="prev" onClick={bannerScrollRight}>
          <IconChevronLeft color={white} width="32px" height="32px" />
        </PrevButton>
        <NextButton className="next" onClick={bannerScrollLeft}>
          <IconChevronLeft color={white} width="32px" height="32px" />
        </NextButton>
        <ScrollbarContainer>
          <PerfectScrollbar
            ref={scrollBarRef}
            option={{
              suppressScrollY: true,
              useBothWheelAxes: true,
            }}
          >
            {Banner}
          </PerfectScrollbar>
        </ScrollbarContainer>
      </SliderContainer>
      <TextWrapper
        fw="bold"
        size="16px"
        color={title}
        style={{ marginBottom: '1rem' }}
      >
        My Classes
      </TextWrapper>
      {loading ? (
        <Spin style={{ marginTop: '80px' }} />
      ) : allActiveClasses.length == 0 ? (
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
      ) : (
        <div>{ClassCards}</div>
      )}
      <FeatureContentWrapper>
        <TextWrapper
          fw="bold"
          size="16px"
          color={title}
          style={{ marginBottom: '1rem' }}
        >
          Featured Content Bundles
        </TextWrapper>
        <FlexContainer justifyContent="flex-start" flexWrap="wrap">
          {FeatureContentCards}
        </FlexContainer>
      </FeatureContentWrapper>
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
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
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
    }
  )
)(MyClasses)
