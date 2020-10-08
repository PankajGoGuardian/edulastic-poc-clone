import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get, pick } from 'lodash'

// ducks
import {
  getCleverClassListSelector,
  fetchCleverClassListRequestAction,
  syncClassesWithCleverAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction,
  setShowCleverSyncModalAction,
  getSchoologyCourseListAction,
  cancelAtlasSyncAction,
  syncAtlasClassesAction,
  setShowSchoologySyncResponseAction,
} from '../../ducks'
import { fetchGroupsAction } from '../../../sharedDucks/groups'
import { getUserDetails } from '../../../../student/Login/ducks'
import { getFormattedCurriculumsSelector } from '../../../src/selectors/dictionaries'
import { getSchoologyAllowedInstitutionPoliciesSelector } from '../../../src/selectors/user'
// components
import ClassList from './ClassList'
import ClassSelectModal from './ClassSelectModal'
import ShowSyncDetailsModal from './ShowSyncDetailsModal'
import CanvasClassSelectModal from './CanvasClassSelectModal'

// eslint-disable-next-line max-len
const ClassListContainer = ({
  groups,
  archiveGroups,
  googleCourseList,
  courseList,
  googleAllowedInstitutions,
  schoologyAllowedInstitutions,
  closeGoogleModal,
  syncClassResponse,
  showBanner,
  isGoogleModalVisible,
  setShowBanner,
  showDetails,
  setShowDetails,
  syncClassLoading = false,
  updateGoogleCourseList,
  syncClass,
  loadingCleverClassList,
  cleverClassList,
  fetchCleverClassList,
  syncCleverClassList,
  getStandardsListBySubject,
  defaultGrades = [],
  defaultSubjects = [],
  user,
  getCanvasCourseListRequest,
  getCanvasSectionListRequest,
  canvasCourseList,
  canvasSectionList,
  institutionIds,
  bulkSyncCanvasStatus,
  fetchGroups,
  showCleverSyncModal,
  setShowCleverSyncModal,
  showAtlasSyncModal,
  getSchoologyCourseList,
  atlasInfo,
  cancelAtlasSync,
  loadingSchoologyClassList,
  schoologyClassList,
  syncAtlasClasses,
  districtId,
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
    if (bulkSyncCanvasStatus === 'SUCCESS') fetchGroups()
  }, [bulkSyncCanvasStatus])

  const syncedGoogleClassroomIds = groups
    .filter((g) => !!g.googleCode)
    .map((g) => g.googleCode)
  const syncedCleverIds = groups
    .filter((g) => !!g.cleverId)
    .map((g) => g.cleverId)
  const syncedAtlasIds = groups.filter((g) => !!g.atlasId).map((g) => g.atlasId)

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
    <>
      <ClassSelectModal
        type="clever"
        visible={showCleverSyncModal}
        onCancel={() => setShowCleverSyncModal(false)}
        loading={loadingCleverClassList}
        syncedIds={syncedCleverIds}
        classListToSync={cleverClassList}
        onSubmit={syncCleverClassList}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        refreshPage="manageClass"
        existingGroups={groups}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
      />
      <ClassSelectModal
        style={{ width: '700px' }}
        type="googleClassroom"
        visible={isGoogleModalVisible}
        onCancel={closeGoogleModal}
        loading={syncClassLoading}
        syncedIds={syncedGoogleClassroomIds}
        classListToSync={googleCourseList}
        onSubmit={(payload) => {
          syncClass(payload)
          updateGoogleCourseList(payload.classList)
          setShowBanner(true)
        }}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        allowedInstitutions={googleAllowedInstitutions}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
      />
      <ClassSelectModal
        type="schoology"
        visible={showAtlasSyncModal}
        onSubmit={onAtlasSyncSubmit}
        onCancel={cancelAtlasSync}
        syncedIds={syncedAtlasIds}
        loading={loadingSchoologyClassList}
        classListToSync={schoologyClassList}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        refreshPage="manageClass"
        existingGroups={groups}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
        allowedInstitutions={schoologyAllowedInstitutions}
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
      <ShowSyncDetailsModal
        syncClassResponse={syncClassResponse}
        visible={showDetails}
        close={() => setShowDetails(false)}
      />
      <ShowSyncDetailsModal
        syncClassResponse={schoologySyncResponse}
        visible={showSchoologySyncResponse}
        type="schoology"
        close={() => setShowSchoologySyncResponse(false)}
      />
      <ClassList
        groups={groups}
        setShowDetails={setShowDetails}
        archiveGroups={archiveGroups}
        syncClassLoading={syncClassLoading}
        showBanner={showBanner}
        setShowCleverSyncModal={setShowCleverSyncModal}
        handleCanvasBulkSync={() => setShowCanvasSyncModal(true)}
      />
    </>
  )
}

ClassListContainer.propTypes = {
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  syncClassLoading: PropTypes.bool.isRequired,
  archiveGroups: PropTypes.array.isRequired,
  isGoogleModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  updateGoogleCourseList: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    loadingCleverClassList: get(state, 'manageClass.loadingCleverClassList'),
    cleverClassList: getCleverClassListSelector(state),
    getStandardsListBySubject: (subject) =>
      getFormattedCurriculumsSelector(state, { subject }),
    user: getUserDetails(state),
    canvasCourseList: get(state, 'manageClass.canvasCourseList', []),
    canvasSectionList: get(state, 'manageClass.canvasSectionList', []),
    institutionIds: get(state, 'user.user.institutionIds', []),
    bulkSyncCanvasStatus: get(state, 'signup.bulkSyncCanvasStatus', false),
    showCleverSyncModal: get(state, 'manageClass.showCleverSyncModal', false),
    showAtlasSyncModal: get(state, 'manageClass.showAtlasSyncModal', false),
    atlasInfo: get(state, 'manageClass.atlasInfo', null),
    loadingSchoologyClassList: get(
      state,
      'manageClass.loadingSchoologyClassList',
      false
    ),
    schoologyAllowedInstitutions: getSchoologyAllowedInstitutionPoliciesSelector(
      state
    ),
    districtId: state.user.user?.orgData?.districtIds?.[0],
    schoologyClassList: get(state, 'manageClass.schoologyClassList', []),
    schoologySyncResponse: get(state, 'manageClass.schoologySyncResponse', {}),
    showSchoologySyncResponse: get(
      state,
      'manageClass.showSchoologySyncResponse',
      false
    ),
  }),
  {
    fetchCleverClassList: fetchCleverClassListRequestAction,
    syncCleverClassList: syncClassesWithCleverAction,
    getCanvasCourseListRequest: getCanvasCourseListRequestAction,
    getCanvasSectionListRequest: getCanvasSectionListRequestAction,
    fetchGroups: fetchGroupsAction,
    setShowCleverSyncModal: setShowCleverSyncModalAction,
    getSchoologyCourseList: getSchoologyCourseListAction,
    cancelAtlasSync: cancelAtlasSyncAction,
    syncAtlasClasses: syncAtlasClassesAction,
    setShowSchoologySyncResponse: setShowSchoologySyncResponseAction,
  }
)(ClassListContainer)
