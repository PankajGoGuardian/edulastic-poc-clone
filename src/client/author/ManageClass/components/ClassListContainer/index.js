import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";

// eslint-disable-next-line max-len
const ClassListContainer = ({
  setModal,
  groups,
  archiveGroups,
  isModalVisible,
  googleCourseList,
  courseList,
  allowGoogleLogin,
  syncClassLoading = false,
  updateGoogleCourseList,
  syncClass,
  state
}) => {
  const closeModal = () => setModal(false);
  const selectedGroups = groups.filter(i => !!i.googleCode).map(i => i.googleCode);

  return (
    <React.Fragment>
      <Header allowGoogleLogin={allowGoogleLogin} />
      <ClassSelectModal
        style={{ width: "700px" }}
        visible={isModalVisible}
        close={closeModal}
        groups={googleCourseList}
        state={state}
        courseList={courseList}
        syncClassLoading={syncClassLoading}
        updateGoogleCourseList={updateGoogleCourseList}
        syncClass={syncClass}
        selectedGroups={selectedGroups}
      />
      <ClassList groups={groups} archiveGroups={archiveGroups} />
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
