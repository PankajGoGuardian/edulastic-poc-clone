import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  closeModal,
  syncClassResponse,
  showBanner,
  isModalVisible,
  setShowBanner,
  showDetails,
  setShowDetails,
  syncClassLoading = false,
  updateGoogleCourseList,
  syncClass,
  state
}) => {
  const selectedGroups = groups.filter(i => !!i.googleCode).map(i => i.googleCode);

  return (
    <React.Fragment>
      <ClassSelectModal
        style={{ width: "700px" }}
        visible={isModalVisible}
        close={closeModal}
        groups={googleCourseList}
        state={state}
        setShowBanner={setShowBanner}
        courseList={courseList}
        syncClassLoading={syncClassLoading}
        updateGoogleCourseList={updateGoogleCourseList}
        syncClass={syncClass}
        selectedGroups={selectedGroups}
        googleAllowedInstitutions={googleAllowedInstitutions}
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
  isModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  updateGoogleCourseList: PropTypes.func
};

export default ClassListContainer;
