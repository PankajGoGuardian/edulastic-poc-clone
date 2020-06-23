import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "lodash";

// ducks
import {
  getCleverClassListSelector,
  fetchCleverClassListRequestAction,
  syncClassesWithCleverAction,
  getCanvasCourseListRequestAction,
  getCanvasSectionListRequestAction
} from "../../ducks";
import { fetchGroupsAction } from "../../../sharedDucks/groups";
import { getUserDetails } from "../../../../student/Login/ducks";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";

// components
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";
import ShowSyncDetailsModal from "./ShowSyncDetailsModal";
import CanvasClassSelectModal from "./CanvasClassSelectModal";

// eslint-disable-next-line max-len
const ClassListContainer = ({
  groups,
  archiveGroups,
  googleCourseList,
  courseList,
  googleAllowedInstitutions,
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
  fetchGroups
}) => {
  const [showCleverSyncModal, setShowCleverSyncModal] = useState(false);
  const [showCanvasSyncModal, setShowCanvasSyncModal] = useState(false);

  useEffect(() => {
    // fetch clever classes on modal display
    if (showCleverSyncModal) {
      fetchCleverClassList();
    }
  }, [showCleverSyncModal]);

  useEffect(() => {
    if (bulkSyncCanvasStatus === "SUCCESS") fetchGroups();
  }, [bulkSyncCanvasStatus]);

  const syncedGoogleClassroomIds = groups.filter(g => !!g.googleCode).map(g => g.googleCode);
  const syncedCleverIds = groups.filter(g => !!g.cleverId).map(g => g.cleverId);

  return (
    <React.Fragment>
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
      />
      <ClassSelectModal
        style={{ width: "700px" }}
        type="googleClassroom"
        visible={isGoogleModalVisible}
        onCancel={closeGoogleModal}
        loading={syncClassLoading}
        syncedIds={syncedGoogleClassroomIds}
        classListToSync={googleCourseList}
        onSubmit={payload => {
          syncClass(payload);
          updateGoogleCourseList(payload.classList);
          setShowBanner(true);
        }}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        allowedInstitutions={googleAllowedInstitutions}
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
      <ShowSyncDetailsModal
        syncClassResponse={syncClassResponse}
        visible={showDetails}
        close={() => setShowDetails(false)}
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
    </React.Fragment>
  );
};

ClassListContainer.propTypes = {
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  syncClassLoading: PropTypes.bool.isRequired,
  archiveGroups: PropTypes.array.isRequired,
  isGoogleModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  updateGoogleCourseList: PropTypes.func.isRequired
};

export default connect(
  state => ({
    loadingCleverClassList: get(state, "manageClass.loadingCleverClassList"),
    cleverClassList: getCleverClassListSelector(state),
    getStandardsListBySubject: subject => getFormattedCurriculumsSelector(state, { subject }),
    user: getUserDetails(state),
    canvasCourseList: get(state, "manageClass.canvasCourseList", []),
    canvasSectionList: get(state, "manageClass.canvasSectionList", []),
    institutionIds: get(state, "user.user.institutionIds", []),
    bulkSyncCanvasStatus: get(state, "signup.bulkSyncCanvasStatus", false)
  }),
  {
    fetchCleverClassList: fetchCleverClassListRequestAction,
    syncCleverClassList: syncClassesWithCleverAction,
    getCanvasCourseListRequest: getCanvasCourseListRequestAction,
    getCanvasSectionListRequest: getCanvasSectionListRequestAction,
    fetchGroups: fetchGroupsAction
  }
)(ClassListContainer);
