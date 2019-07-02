import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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

import ClassCreate from "./ClassCreate";
import ClassListContainer from "./ClassListContainer";
import ClassDetails from "./ClassDetails";
import ClassEdit from "./ClassEdit";
import PrintPreview from "./PrintPreview";

const ManageClass = ({ fetchGroups, fetchArchiveGroups, groups, archiveGroups, setClass, ...restProps }) => {
  const [view, setView] = useState("listView");

  useEffect(() => {
    if (view === "listView") {
      fetchGroups();
      fetchArchiveGroups();
    }
  }, [view]);

  const updateView = v => {
    setView(v);
  };

  const setEntity = entity => {
    setClass(entity);
    updateView("details");
  };

  const renderView = () => {
    // eslint-disable-next-line default-case
    switch (view) {
      case "create":
        return <ClassCreate changeView={updateView} />;
      case "update":
        return <ClassEdit changeView={updateView} />;
      case "details":
        return <ClassDetails updateView={updateView} />;
      case "printview":
        return <PrintPreview />;
      case "listView":
        return (
          <ClassListContainer
            {...restProps}
            onCreate={() => updateView("create")}
            setEntity={setEntity}
            groups={groups}
            archiveGroups={archiveGroups}
          />
        );
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
)(ManageClass);
