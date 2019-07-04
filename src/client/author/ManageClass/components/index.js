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
  getArchiveGroupsSelector
} from "../../sharedDucks/groups";
import { setModalAction, syncClassAction, setClassAction, updateGoogleCourseListAction } from "../ducks";

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
  state,
  archiveGroups,
  setClass,
  ...restProps
}) => {
  useEffect(() => {
    fetchGroups();
    fetchArchiveGroups();
    getDictCurriculums();
    receiveSearchCourse({ districtId });
  }, []);

  return <ClassListContainer {...restProps} state={state} groups={groups} archiveGroups={archiveGroups} />;
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
      isModalVisible: state.manageClass.showModal,
      state: state,
      courseList: get(state, "coursesReducer.searchResult"),
      districtId: get(state, "user.user.orgData.districtId"),
      isGoogleLoggedIn: get(state, "user.user.isGoogleLoggedIn"),
      googleCourseList: state.manageClass.googleCourseList
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
