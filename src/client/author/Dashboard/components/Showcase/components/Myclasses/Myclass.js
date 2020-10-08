import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, pick } from 'lodash'

// components
import { Col, Row, Spin } from 'antd'
import { MainContentWrapper } from '@edulastic/common'
import { title } from '@edulastic/colors'
import { TextWrapper } from '../../../styledComponents'
import { CardBox } from './styled'
import CardImage from './components/CardImage/cardImage'
import CardTextContent from './components/CardTextContent/cardTextContent'
import CreateClassPage from './components/CreateClassPage/createClassPage'
import Launch from '../../../LaunchHangout/Launch'
import ClassSelectModal from '../../../../../ManageClass/components/ClassListContainer/ClassSelectModal'
import ShowSyncDetailsModal from '../../../../../ManageClass/components/ClassListContainer/ShowSyncDetailsModal'
import CanvasClassSelectModal from '../../../../../ManageClass/components/ClassListContainer/CanvasClassSelectModal'
// static data

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
  logInAtlasUserAction,
  getSchoologyCourseListAction,
  cancelAtlasSyncAction,
  syncAtlasClassesAction,
  setShowSchoologySyncResponseAction,
} from '../../../../../ManageClass/ducks'
import { receiveTeacherDashboardAction } from '../../../../duck'
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getCanvasAllowedInstitutionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getCleverLibraryUserSelector,
  getSchoologyAllowedInstitutionPoliciesSelector,
} from '../../../../../src/selectors/user'
import { getUserDetails } from '../../../../../../student/Login/ducks'
import { getFormattedCurriculumsSelector } from '../../../../../src/selectors/dictionaries'

const Card = ({ data }) => (
  <CardBox data-cy={data.name}>
    <Row>
      <CardImage data={data} />
    </Row>
    <Row>
      <CardTextContent data={data} />
    </Row>
  </CardBox>
)

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
  schoologyAllowedInstitutions,
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
  logInAtlasUser,
  showAtlasSyncModal,
  getSchoologyCourseList,
  atlasInfo,
  cancelAtlasSync,
  loadingSchoologyClassList,
  schoologyClassList,
  syncAtlasClasses,
  schoologySyncResponse,
  showSchoologySyncResponse,
  setShowSchoologySyncResponse,
}) => {
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false)

  useEffect(() => {
    // fetch clever classes on modal display
    if (showCleverSyncModal) {
      fetchCleverClassList()
    }
  }, [showCleverSyncModal])

  useEffect(() => {
    if (atlasInfo && atlasInfo.code) {
      const { code } = atlasInfo
      getSchoologyCourseList({ code })
    }
  }, [atlasInfo])

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
    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={item._id}>
      <Card data={item} />
    </Col>
  ))

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  const onAtlasSyncSubmit = (data) => {
    const properties = [
      'grades',
      'name',
      'standardSets',
      'subject',
      'courseId',
      'atlasCode',
      'thumbnail',
      'class',
    ]
    const bulkClassSyncData = data.classList.map((each) => {
      return pick(each, properties)
    })
    syncAtlasClasses({ ...data, districtId, bulkClassSyncData })
  }

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
      <ClassSelectModal
        type="schoology"
        visible={showAtlasSyncModal}
        onSubmit={onAtlasSyncSubmit}
        onCancel={cancelAtlasSync}
        loading={loadingSchoologyClassList}
        classListToSync={schoologyClassList}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        refreshPage="dashboard"
        existingGroups={allClasses}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
        allowedInstitutions={schoologyAllowedInstitutions}
      />
      <ShowSyncDetailsModal
        syncClassResponse={schoologySyncResponse}
        visible={showSchoologySyncResponse}
        type="schoology"
        close={() => setShowSchoologySyncResponse(false)}
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
      <TextWrapper size="20px" color={title} style={{ marginBottom: '1rem' }}>
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
          enableSchoologySync={schoologyAllowedInstitutions.length > 0}
          canvasAllowedInstitutions={canvasAllowedInstitutions}
          enableCleverSync={isCleverUser}
          setShowCleverSyncModal={setShowCleverSyncModal}
          handleCanvasBulkSync={() => setShowCanvasSyncModal(true)}
          handleSyncWithAtlas={() => logInAtlasUser({ districtId })}
          user={user}
          isClassLink={isClassLink}
        />
      ) : (
        <Row gutter={20}>{ClassCards}</Row>
      )}
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
      schoologyAllowedInstitutions: getSchoologyAllowedInstitutionPoliciesSelector(
        state
      ),
      loadingCleverClassList: get(state, 'manageClass.loadingCleverClassList'),
      cleverClassList: getCleverClassListSelector(state),
      getStandardsListBySubject: (subject) =>
        getFormattedCurriculumsSelector(state, { subject }),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state),
      showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
      showAtlasSyncModal: get(state, 'manageClass.showAtlasSyncModal', false),
      atlasInfo: get(state, 'manageClass.atlasInfo', null),
      loadingSchoologyClassList: get(
        state,
        'manageClass.loadingSchoologyClassList',
        false
      ),
      schoologyClassList: get(state, 'manageClass.schoologyClassList', []),
      teacherData: get(state, 'dashboardTeacher.data', {}),
      schoologySyncResponse: get(
        state,
        'manageClass.schoologySyncResponse',
        {}
      ),
      showSchoologySyncResponse: get(
        state,
        'manageClass.showSchoologySyncResponse',
        false
      ),
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
      logInAtlasUser: logInAtlasUserAction,
      getSchoologyCourseList: getSchoologyCourseListAction,
      cancelAtlasSync: cancelAtlasSyncAction,
      syncAtlasClasses: syncAtlasClassesAction,
      setShowSchoologySyncResponse: setShowSchoologySyncResponseAction,
    }
  )
)(MyClasses)
