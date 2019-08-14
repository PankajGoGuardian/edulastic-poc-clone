import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";

import { getCurrentGroup } from "../../Login/ducks";

// actions
import { fetchAssignmentsAction, getAssignmentsSelector } from "../ducks";

// components
import ReportCard from "./ReportCard";

// styles
import {
  WrapperReport,
  ReportHeader,
  LayoutContent,
  ReportHeaderName,
  ReportHeaderDate,
  ReportHeaderAttempt,
  ReportHeaderCorrectAnswer,
  ReportHeaderAverageScore,
  ReportHeaderReview,
  ReportList
} from "./styles";

const Content = ({ flag, assignments, fetchAssignments, currentGroup, t }) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, []);

  return (
    <LayoutContent flag={flag}>
      <WrapperReport>
        <ReportHeader>
          <ReportHeaderName>{t("common.report.reportName")}</ReportHeaderName>
          <ReportHeaderDate>{t("common.report.date")}</ReportHeaderDate>
          <ReportHeaderAttempt>{t("common.report.attempt")}</ReportHeaderAttempt>
          <ReportHeaderCorrectAnswer>{t("common.report.correctAnswer")}</ReportHeaderCorrectAnswer>
          <ReportHeaderAverageScore>{t("common.report.averageScore")}</ReportHeaderAverageScore>
          <ReportHeaderReview />
        </ReportHeader>
        <ReportList>
          {assignments.map((item, index) => (
            <ReportCard key={index} data={item} t={t} />
          ))}
        </ReportList>
      </WrapperReport>
    </LayoutContent>
  );
};

const enhance = compose(
  withNamespaces("student"),
  connect(
    state => ({
      flag: state.ui.flag,
      currentGroup: getCurrentGroup(state),
      assignments: getAssignmentsSelector(state)
    }),
    {
      fetchAssignments: fetchAssignmentsAction
    }
  )
);

export default enhance(Content);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  currentGroup: PropTypes.string
};

Content.defaultProps = {
  assignments: [],
  currentGroup: ""
};
