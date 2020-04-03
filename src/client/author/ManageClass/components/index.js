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
  groupsLoadingSelector
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
import { getGoogleAllowedInstitionPoliciesSelector } from "../../src/selectors/user";

const ManageClass = ({
  fetchGroups,
  receiveSearchCourse,
  getDictCurriculums,
  districtId,
  fetchArchiveGroups,
  groups,
  isLoading,
  state,
  syncClassLoading,
  googleAllowedInstitutions,
  archiveGroups,
  setClass,
  fetchClassListLoading,
  ...restProps
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (!fetchClassListLoading) setIsModalVisible(true);
    else {
      setIsModalVisible(false);
    }
  }, [fetchClassListLoading]);

  useEffect(() => {
    if (!syncClassLoading && showBanner === true) {
      setTimeout(() => {
        setShowBanner(false);
      }, 5000);
    }
  }, [syncClassLoading]);
  useEffect(() => {
    fetchGroups();
    fetchArchiveGroups();
    getDictCurriculums();
    receiveSearchCourse({ districtId });
    setIsModalVisible(false);
    setShowBanner(false);
  }, []);

  return (
    <ClassListContainer
      {...restProps}
      state={state}
      setShowBanner={setShowBanner}
      syncClassLoading={syncClassLoading}
      isModalVisible={isModalVisible}
      closeModal={closeModal}
      googleAllowedInstitutions={googleAllowedInstitutions}
      groups={groups}
      showBanner={showBanner}
      showDetails={showDetails}
      setShowDetails={setShowDetails}
      archiveGroups={archiveGroups}
      groupsLoading={isLoading}
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
      isLoading: groupsLoadingSelector(state),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      state: state,
      courseList: get(state, "coursesReducer.searchResult"),
      districtId: get(state, "user.user.orgData.districtId"),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(state),
      isGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      syncClassResponse: get(state, "manageClass.syncClassResponse", {}),
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
