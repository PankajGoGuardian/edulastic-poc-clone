import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { get } from "lodash";

// ducks
import {
  getCleverClassListSelector,
  fetchCleverClassListRequestAction,
  syncClassesWithCleverAction
} from "../../ducks";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";

// components
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";
import ShowSyncDetailsModal from "./ShowSyncDetailsModal";

// eslint-disable-next-line max-len
const ClassListContainer = ({
  groups,
  archiveGroups,
  groupsLoading,
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
  getStandardsListBySubject
}) => {
  const [showCleverSyncModal, setShowCleverSyncModal] = useState(false);

  useEffect(() => {
    // fetch clever classes on modal display
    if (showCleverSyncModal) {
      fetchCleverClassList();
    }
  }, [showCleverSyncModal]);

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
      />
    </React.Fragment>
  );
};

ClassListContainer.propTypes = {
  setModal: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  syncClassLoading: PropTypes.bool,
  archiveGroups: PropTypes.array.isRequired,
  isGoogleModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  updateGoogleCourseList: PropTypes.func
};

export default connect(
  state => ({
    loadingCleverClassList: get(state, "manageClass.loadingCleverClassList"),
    cleverClassList: getCleverClassListSelector(state),
    getStandardsListBySubject: subject => getFormattedCurriculumsSelector(state, { subject })
  }),
  {
    fetchCleverClassList: fetchCleverClassListRequestAction,
    syncCleverClassList: syncClassesWithCleverAction
  }
)(ClassListContainer);
