import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { get } from "lodash";

import ClassListContainer from "./ClassListContainer";

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
import { getDictCurriculumsAction } from "../../src/actions/dictionaries";
import { receiveSearchCourseAction } from "../../Courses/ducks";
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector
} from "../../src/selectors/user";

const ManageClass = ({
  fetchGroups,
  receiveSearchCourse,
  getDictCurriculums,
  districtId,
  fetchArchiveGroups,
  groups,
  isLoading,
  syncClassLoading,
  googleAllowedInstitutions,
  archiveGroups,
  setClass,
  fetchClassListLoading,
  ...restProps
}) => {
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!fetchClassListLoading) setIsGoogleModalVisible(true);
    else {
      setIsGoogleModalVisible(false);
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
    receiveSearchCourse({ districtId, active: 1 });
    setIsGoogleModalVisible(false);
    setShowBanner(false);
  }, []);

  return (
    <ClassListContainer
      {...restProps}
      setShowBanner={setShowBanner}
      syncClassLoading={syncClassLoading}
      isGoogleModalVisible={isGoogleModalVisible}
      closeGoogleModal={() => setIsGoogleModalVisible(false)}
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
  isGoogleModalVisible: PropTypes.bool.isRequired,
  googleCourseList: PropTypes.array.isRequired,
  defaultGrades: PropTypes.array.isRequired,
  defaultSubjects: PropTypes.array.isRequired
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      groups: getGroupsSelector(state),
      archiveGroups: getArchiveGroupsSelector(state),
      isLoading: groupsLoadingSelector(state),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      courseList: get(state, "coursesReducer.searchResult"),
      districtId: state?.user?.user?.orgData?.districtIds?.[0],
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(state),
      syncClassResponse: get(state, "manageClass.syncClassResponse", {}),
      syncClassLoading: get(state, "manageClass.syncClassLoading", false),
      googleCourseList: getGoogleCourseListSelector(state),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state)
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
