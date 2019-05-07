import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// actions
import { fetchGroupsAction, getGroupsSelector } from "../../sharedDucks/groups";
import { setModalAction, syncClassAction } from "../ducks";
// components

import ClassCreate from "./ClassCreate";
import ClassListContainer from "./ClassListContainer";

const ManageClass = ({ fetchGroups, ...restProps }) => {
  useEffect(() => {
    fetchGroups();
  }, []);

  const [view, setView] = useState("list");

  const updateView = v => {
    setView(v);
  };

  const renderView = () => {
    switch (view) {
      case "create":
        return <ClassCreate cancelCreate={() => updateView("list")} />;
      default:
        return <ClassListContainer {...restProps} onCreate={() => updateView("create")} />;
    }
  };

  return renderView();
};

ManageClass.propTypes = {
  fetchGroups: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  syncClass: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  isModalVisible: PropTypes.func.isRequired,
  googleCourseList: PropTypes.array.isRequired
};

export default connect(
  state => ({
    groups: getGroupsSelector(state),
    isModalVisible: state.manageClass.showModal,
    googleCourseList: state.manageClass.googleCourseList
  }),
  {
    fetchGroups: fetchGroupsAction,
    setModal: setModalAction,
    syncClass: syncClassAction
  }
)(ManageClass);
