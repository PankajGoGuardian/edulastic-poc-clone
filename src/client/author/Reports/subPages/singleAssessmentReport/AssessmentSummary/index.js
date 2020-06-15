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
        <Col className="sub-container district-statistics" xs={24} sm={18} md={18} lg={18} xl={18}>
          <StyledCard>
            <Stats name={assessmentName} data={metricInfo} role={role} user={user} />
          </StyledCard>
        </Col>
        <Col className="sub-container chart-container" xs={24} sm={6} md={6} lg={6} xl={6}>
          <StyledCard>
            <StyledH3 textAlign="center">Students in Performance Bands (%)</StyledH3>
            <SimplePieChart data={bandInfo} />
          </StyledCard>
        </Col>
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
      loading: getReportsAssessmentSummaryLoader(state),
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
