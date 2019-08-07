import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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

const Content = ({ flag, assignments, fetchAssignments, currentGroup }) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, []);

  return (
    <LayoutContent flag={flag}>
      <WrapperReport>
        <ReportHeader>
          <ReportHeaderName>Report name</ReportHeaderName>
          <ReportHeaderDate>Date</ReportHeaderDate>
          <ReportHeaderAttempt>Attempt</ReportHeaderAttempt>
          <ReportHeaderCorrectAnswer>Correct answer</ReportHeaderCorrectAnswer>
          <ReportHeaderAverageScore>Average score</ReportHeaderAverageScore>
          <ReportHeaderReview />
        </ReportHeader>
        <ReportList>
          {assignments.map((item, index) => (
            <ReportCard key={index} data={item} />
          ))}
        </ReportList>
      </WrapperReport>
    </LayoutContent>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    currentGroup: getCurrentGroup(state),
    assignments: getAssignmentsSelector(state)
  }),
  {
    fetchAssignments: fetchAssignmentsAction
  }
)(Content);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired,
  currentGroup: PropTypes.string
};

Content.defaultProps = {
  assignments: [],
  currentGroup: ""
};
