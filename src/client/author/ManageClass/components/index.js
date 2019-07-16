import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { get } from "lodash";
// actions
import {
  fetchGroupsAction,
  fetchArchiveGroupsAction,
  getGroupsSelector,
  getArchiveGroupsSelector,
  getActiveGroupsLoadingSelector
} from "../../sharedDucks/groups";
import {
  setModalAction,
  syncClassAction,
  setClassAction,
  updateGoogleCourseListAction,
  getGoogleCourseListSelector
} from "../ducks";

// components

import ClassListContainer from "./ClassListContainer";
import { getDictCurriculumsAction } from "../../src/actions/dictionaries";
import { receiveSearchCourseAction } from "../../Courses/ducks";

const ManageClass = ({
  fetchGroups,
  receiveSearchCourse,
  getDictCurriculums,
  districtId,
  fetchArchiveGroups,
  groups,
  activeGroupsLoading,
  state,
  syncClassLoading,
  allowGoogleLogin,
  archiveGroups,
  setClass,
  fetchClassListLoading,
  ...restProps
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    if (!fetchClassListLoading) setIsModalVisible(true);
    else {
      setIsModalVisible(false);
    }
  }, [fetchClassListLoading]);

  useEffect(() => {
    if (!syncClassLoading && isModalVisible) {
      setIsModalVisible(false);
    }
  }, [syncClassLoading]);
  useEffect(() => {
    fetchGroups();
    fetchArchiveGroups();
    getDictCurriculums();
    receiveSearchCourse({ districtId });
    setIsModalVisible(false);
  }, []);

  return (
    <ClassListContainer
      {...restProps}
      state={state}
      syncClassLoading={syncClassLoading}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      allowGoogleLogin={allowGoogleLogin}
      groups={groups}
      archiveGroups={archiveGroups}
      activeGroupsLoading={activeGroupsLoading}
    />
  );
};

ManageClass.propTypes = {
  fetchGroups: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  setClass: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      groups: getGroupsSelector(state),
      archiveGroups: getArchiveGroupsSelector(state),
      activeGroupsLoading: getActiveGroupsLoadingSelector(state),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      state: state,
      courseList: get(state, "coursesReducer.searchResult"),
      districtId: get(state, "user.user.orgData.districtId"),
      allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom"),
      isGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      syncClassLoading: get(state, "manageClass.syncClassLoading", false),
      googleCourseList: getGoogleCourseListSelector(state)
    }),
    {
      fetchGroups: fetchGroupsAction,
      fetchArchiveGroups: fetchArchiveGroupsAction,
      setModal: setModalAction,
      syncClass: syncClassAction,
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      updateGoogleCourseList: updateGoogleCourseListAction,
      setClass: setClassAction
    }
  )
);

export default enhance(ManageClass);
