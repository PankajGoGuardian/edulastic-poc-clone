import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import ClassList from "./ClassList";
import ClassSelectModal from "./ClassSelectModal";
import { Spin } from "antd";

// eslint-disable-next-line max-len
const ClassListContainer = ({
  groups,
  archiveGroups,
  activeGroupsLoading,
  googleCourseList,
  courseList,
  allowGoogleLogin,
  closeModal,
  isModalVisible,
  syncClassLoading = false,
  updateGoogleCourseList,
  syncClass,
  state
}) => {
  const selectedGroups = groups.filter(i => !!i.googleCode).map(i => i.googleCode);
  if (activeGroupsLoading) return <Spin />;
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
