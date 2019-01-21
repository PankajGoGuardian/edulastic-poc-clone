import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReportListHeader from "../../styled/header";
import ReportListSecondHeader from "./secondHeader";
import ReportListContent from "./mainContent";
import MainContainer from "../commonStyle/mainContainer";
import {
  fetchTestActivityDetailAction,
  loadReportAction
} from "../../actions/report";

const ReportListContainer = ({ flag, location, loadReport }) => {
  useEffect(() => {
    loadReport(location.testActivityId);
  }, []);
  return (
    <MainContainer flag={flag}>
      <ReportListHeader flag={flag} titleText="common.reportsTitle" />
      <ReportListSecondHeader title={location.title} />
      <ReportListContent title={location.title} />
    </MainContainer>
  );
};

export default React.memo(
  connect(
    ({ ui, reports }) => ({
      flag: ui.flag,
      reportDetail: reports.reportDetail
    }),
    {
      fetchTestActivityDetail: fetchTestActivityDetailAction,
      loadReport: loadReportAction
    }
  )(ReportListContainer)
);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  loadReport: PropTypes.func.isRequired
};
