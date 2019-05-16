import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// actions
import { fetchGroupsAction, getGroupsSelector } from "../../sharedDucks/groups";
import { setModalAction, syncClassAction, setClassAction } from "../ducks";
// components

import ClassCreate from "./ClassCreate";
import ClassListContainer from "./ClassListContainer";
import ClassDetails from "./ClassDetails";
import ClassEdit from "./ClassEdit";
import PrintPreview from "./PrintPreview";

const ManageClass = ({ fetchGroups, setClass, ...restProps }) => {
  useEffect(() => {
    fetchGroups();
  }, []);

  const [view, setView] = useState("");

  const updateView = v => {
    setView(v);
  };

  const setEntity = entity => {
    setClass(entity);
    updateView("details");
  };

  const renderView = () => {
    switch (view) {
      case "create":
        return <ClassCreate changeView={updateView} />;
      case "update":
        return <ClassEdit changeView={updateView} />;
      case "details":
        return <ClassDetails updateView={updateView} />;
      case "printview":
        return <PrintPreview />;
      default:
        return <ClassListContainer {...restProps} onCreate={() => updateView("create")} setEntity={setEntity} />;
    }
  };

  return renderView();
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

export default connect(
  state => ({
    groups: getGroupsSelector(state),
    isModalVisible: state.manageClass.showModal,
    googleCourseList: state.manageClass.googleCourseList
  }),
  {
    fetchGroups: fetchGroupsAction,
    setModal: setModalAction,
    syncClass: syncClassAction,
    setClass: setClassAction
  }
)(ManageClass);
