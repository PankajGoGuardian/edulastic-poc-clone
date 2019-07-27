import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
//components
import TestAcivityHeader from "../../sharedComponents/Header";
import TestActivitySubHeader from "./SubHeader";
import ReportListContent from "./Container";
import MainContainer from "../../styled/mainContainer";
//actions
import { loadTestActivityReportAction } from "../ducks";
import { setCurrentItemAction } from "../../sharedDucks/TestItem";
import { getAssignmentsSelector } from "../../Reports/ducks";

const ReportListContainer = ({
  flag,
  match,
  location,
  loadTestActivityReport,
  setCurrentItem,
  testTitle,
  testFeedback
}) => {
  const [assignmentItemTitle, setAssignmentItemTitle] = useState(null);

  useEffect(() => {
    loadTestActivityReport({
      testId: match.params.testId,
      testActivityId: match.params.id,
      groupId: match.params.classId
    });
    setCurrentItem(0);
  }, []);

  useEffect(() => {
    if (!testFeedback) return;

    setAssignmentItemTitle(testTitle);
  }, [testFeedback]);

  return (
    <MainContainer flag={flag}>
      <TestAcivityHeader titleText="common.reportsTitle" />
      <TestActivitySubHeader title={assignmentItemTitle} />
      <ReportListContent title={assignmentItemTitle} reportId={match.params.id} />
    </MainContainer>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      flag: state.ui.flag,
      testFeedback: get(state, "testFeedback", null),
      testTitle: get(state, ["tests", "entity", "title"], "")
    }),
    {
      setCurrentItem: setCurrentItemAction,
      loadTestActivityReport: loadTestActivityReportAction
    }
  )
);

export default enhance(ReportListContainer);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  testFeedback: PropTypes.array.isRequired
};
