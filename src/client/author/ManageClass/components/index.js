import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// actions
import {
  fetchGroupsAction,
  fetchArchiveGroupsAction,
  getGroupsSelector,
  getArchiveGroupsSelector
} from "../../sharedDucks/groups";
import { setModalAction, syncClassAction, setClassAction } from "../ducks";

// components

import ClassListContainer from "./ClassListContainer";

const ManageClass = ({ fetchGroups, fetchArchiveGroups, groups, archiveGroups, setClass, history, ...restProps }) => {
  useEffect(() => {
    fetchGroups();
    fetchArchiveGroups();
  }, []);

  return <ClassListContainer {...restProps} groups={groups} archiveGroups={archiveGroups} />;
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
      googleCourseList: state.manageClass.googleCourseList
    }),
    {
      fetchGroups: fetchGroupsAction,
      fetchArchiveGroups: fetchArchiveGroupsAction,
      setModal: setModalAction,
      syncClass: syncClassAction,
      setClass: setClassAction
    }
  )
);

export default enhance(ManageClass);
