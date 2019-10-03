import React, { useEffect } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get } from "lodash";

import { SimplePieChart } from "./components/charts/pieChart";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { UpperContainer, TableContainer, StyledAssessmentStatisticTable } from "./components/styled";
import { Stats } from "./components/stats";
import { Placeholder } from "../../../common/components/loader";

import {
  getAssessmentSummaryRequestAction,
  getReportsAssessmentSummary,
  getReportsAssessmentSummaryLoader
} from "./ducks";
import { getPrintingState, getCsvDownloadingState } from "../../../ducks";
import { getUserRole } from "../../../../src/selectors/user";

const AssessmentSummary = ({
  loading,
  isPrinting,
  isCsvDownloading,
  role,
  assessmentSummary,
  getAssessmentSummary,
  settings
}) => {
  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      let q = {};
      q.testId = settings.selectedTest.key;
      const { performanceBandProfile, ...requestFilters } = settings.requestFilters;
      q.requestFilters = { ...requestFilters, profileId: performanceBandProfile };

      getAssessmentSummary(q);
    }
  }, [settings]);

  const { bandInfo, metricInfo } = assessmentSummary;

  const assessmentName = get(settings, "selectedTest.title", "");

  return (
    <div>
      {loading ? (
        <div>
          <Row type="flex">
            <Placeholder />
            <Placeholder />
          </Row>
          <Row type="flex">
            <Placeholder />
          </Row>
        </div>
      ) : (
        <>
          <UpperContainer type="flex">
            <Col className="sub-container district-statistics" xs={24} sm={24} md={18} lg={18} xl={18}>
              <StyledCard>
                <Stats name={assessmentName} data={metricInfo} role={role} />
              </StyledCard>
            </Col>
            <Col className="sub-container chart-container" xs={24} sm={24} md={6} lg={6} xl={6}>
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
      )}
    </div>
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
      assessmentSummary: getReportsAssessmentSummary(state)
    }),
    {
      getAssessmentSummary: getAssessmentSummaryRequestAction
    }
  )
);

export default enhance(AssessmentSummary);
