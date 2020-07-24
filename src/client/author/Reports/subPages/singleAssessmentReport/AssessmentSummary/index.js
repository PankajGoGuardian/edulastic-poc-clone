import { SpinLoader } from "@edulastic/common";
import { Col } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getUserRole, getUser } from "../../../../src/selectors/user";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { getCsvDownloadingState, getPrintingState } from "../../../ducks";
import { SimplePieChart } from "./components/charts/pieChart";
import { Stats } from "./components/stats";
import { StyledAssessmentStatisticTable, TableContainer, UpperContainer } from "./components/styled";
import {
  getAssessmentSummaryRequestAction,
  getReportsAssessmentSummary,
  getReportsAssessmentSummaryLoader
} from "./ducks";
import { getReportsSARFilterLoadingState } from "../common/filterDataDucks";

const AssessmentSummary = ({
  loading,
  isPrinting,
  isCsvDownloading,
  role,
  assessmentSummary,
  getAssessmentSummary,
  settings,
  user
}) => {
  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {};
      q.testId = settings.selectedTest.key;
      const { performanceBandProfile, ...requestFilters } = settings.requestFilters;
      q.requestFilters = { ...requestFilters, profileId: performanceBandProfile };

      getAssessmentSummary(q);
    }
  }, [settings]);

  const { bandInfo, metricInfo } = assessmentSummary;

  const assessmentName = get(settings, "selectedTest.title", "");

  return loading ? (
    <SpinLoader position="fixed" />
  ) : (
    <>
      <UpperContainer type="flex">
        <StyledCard className="sub-container district-statistics">
          <Stats name={assessmentName} data={metricInfo} role={role} user={user} />
        </StyledCard>
        <StyledCard className="sub-container chart-container">
          <StyledH3 textAlign="center">Students in Performance Bands (%)</StyledH3>
          <SimplePieChart data={bandInfo} />
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <Col>
          <StyledCard>
            {role ? (
              <StyledAssessmentStatisticTable
                name={assessmentName}
                data={metricInfo}
                role={role}
                isPrinting={isPrinting}
                isCsvDownloading={isCsvDownloading}
              />
            ) : (
              ""
            )}
          </StyledCard>
        </Col>
      </TableContainer>
    </>
  );
};

const reportPropType = PropTypes.shape({
  bandInfo: PropTypes.array,
  metricInfo: PropTypes.array
});

AssessmentSummary.propTypes = {
  loading: PropTypes.bool.isRequired,
  isPrinting: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  assessmentSummary: reportPropType.isRequired,
  getAssessmentSummary: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

const enhance = compose(
  connect(
    state => ({
      loading: getReportsAssessmentSummaryLoader(state)
        || getReportsSARFilterLoadingState(state),
      isPrinting: getPrintingState(state),
      isCsvDownloading: getCsvDownloadingState(state),
      role: getUserRole(state),
      assessmentSummary: getReportsAssessmentSummary(state),
      user: getUser(state)
    }),
    {
      getAssessmentSummary: getAssessmentSummaryRequestAction
    }
  )
);

export default enhance(AssessmentSummary);
