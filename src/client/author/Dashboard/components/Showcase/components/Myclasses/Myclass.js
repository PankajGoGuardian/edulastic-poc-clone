import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, groupBy } from 'lodash'
import qs from 'qs'

// components
import { Spin } from 'antd'
import { FlexContainer, MainContentWrapper } from '@edulastic/common'
import { title, white } from '@edulastic/colors'
import { IconChevronLeft } from '@edulastic/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
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
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(true)

  let scrollBarRef

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

  const FeatureContentCards = (TEST_BUNDLE || []).map((bundle) => (
    <BundleContainer
      onClick={() => handleFeatureClick(bundle.config.filters || [])}
      bgImage={bundle.imageUrl}
      key={bundle._id}
    >
      <Bottom>{bundle.description && <div> {bundle.description} </div>}</Bottom>
    </BundleContainer>
  ))

  const bannerLength = (BANNER || []).length

  const Banner = (BANNER || []).map((slide, index) => (
    <>
      <Slides bgImage={slide.imageUrl} key={slide._id} />
      <Slides bgImage={slide.imageUrl} key={slide._id} />
      <Slides
        className={bannerLength === index + 1 ? 'last' : ''}
        bgImage={slide.imageUrl}
        key={slide._id}
      />
    </>
  ))

  const handleScroll = (scrollOffset) => {
    scrollBarRef._container.scrollLeft += scrollOffset
    const { x } = scrollBarRef._ps.reach
    if (scrollBarRef._container.scrollLeft === 0) {
      setShowRightArrow(false)
    } else if (x === 'end') {
      setShowLeftArrow(false)
    } else {
      setShowRightArrow(true)
      setShowLeftArrow(true)
    }
  }

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  return (
    <MainContentWrapper padding="30px">
      <ClassSelectModal
        type="clever"
        visible={showCleverSyncModal}
        onSubmit={syncCleverClassList}
        onCancel={() => setShowCleverSyncModal(false)}
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
        onCancel={() => setShowCanvasSyncModal(false)}
        user={user}
        getCanvasCourseListRequest={getCanvasCourseListRequest}
        getCanvasSectionListRequest={getCanvasSectionListRequest}
        canvasCourseList={canvasCourseList}
        canvasSectionList={canvasSectionList}
        institutionId={institutionIds[0]}
      />
      <SliderContainer>
        {showRightArrow && (
          <PrevButton className="prev" onClick={() => handleScroll(-200)}>
            <IconChevronLeft color={white} width="32px" height="32px" />
          </PrevButton>
        )}
        {showLeftArrow && (
          <NextButton className="next" onClick={() => handleScroll(200)}>
            <IconChevronLeft color={white} width="32px" height="32px" />
          </NextButton>
        )}
        <ScrollbarContainer>
          <PerfectScrollbar
            ref={(ref) => {
              scrollBarRef = ref
            }}
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
