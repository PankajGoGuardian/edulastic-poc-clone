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

import ClassCreate from "./ClassCreate";
import ClassListContainer from "./ClassListContainer";
import ClassDetails from "./ClassDetails";
import ClassEdit from "./ClassEdit";
import PrintPreview from "./PrintPreview";

const ManageClass = ({ fetchGroups, fetchArchiveGroups, groups, archiveGroups, setClass, history, ...restProps }) => {
  const [view, setView] = useState("listView");
  useEffect(() => {
    if (view === "listView") {
      fetchGroups();
      fetchArchiveGroups();
    }
  }, []);

  const updateView = v => {
    setView(v);
  };

  const setEntity = entity => {
    const { _id: classId } = entity;
    setClass(entity);
    history.push(`/author/manageClass/${classId}`);
  };

  const renderView = () => {
    // eslint-disable-next-line default-case
    switch (view) {
      case "create":
        return <ClassCreate changeView={updateView} />;
      case "update":
        return <ClassEdit changeView={updateView} />;
      case "details":
        return <ClassDetails changeView={updateView} />;
      case "printview":
        return <PrintPreview />;
      case "listView":
        return (
          <ClassListContainer {...restProps} setEntity={setEntity} groups={groups} archiveGroups={archiveGroups} />
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
