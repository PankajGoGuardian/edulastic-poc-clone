import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
//components
import TestAcivityHeader from "../../sharedComponents/Header";
import TestActivitySubHeader from "./SubHeader";
import ReportListContent from "./Container";
import MainContainer from "../../styled/mainContainer";
//actions
import { loadTestActivityReportAction } from "../ducks";
import { setCurrentItemAction } from "../../sharedDucks/TestItem";

const ReportListContainer = ({ flag, match, location, loadTestActivityReport, setCurrentItem }) => {
  useEffect(() => {
    loadTestActivityReport({ testActivityId: match.params.id, groupId: match.params.classId });
    setCurrentItem(0);
  }, []);
  return (
    <MainContainer flag={flag}>
      <TestAcivityHeader titleText="common.reportsTitle" />
      <TestActivitySubHeader title={location.title} />
      <ReportListContent title={location.title} reportId={match.params.id} />
    </MainContainer>
  );
};

const enhance = compose(
  withRouter,
  connect(
    ({ ui }) => ({
      flag: ui.flag
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
  location: PropTypes.object.isRequired
};
