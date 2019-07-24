import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";

import useInterval from "@use-it/interval";
import { useRealtimeV2 } from "@edulastic/common";
import { get, values } from "lodash";
import { getCurrentGroup, getClasses } from "../../Login/ducks";

import { Wrapper, NoDataBox } from "../../styled";

// actions
import {
  fetchAssignmentsAction,
  getAssignmentsSelector,
  assignmentsSelector,
  transformAssignmentForRedirect
} from "../ducks";

import { addRealtimeAssignmentAction, rerenderAssignmentsAction } from "../../sharedDucks/AssignmentModule/ducks";
import { addRealtimeReportAction } from "../../sharedDucks/ReportsModule/ducks";
// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";
import NoDataIcon from "../../assets/nodata.svg";

const withinThreshold = (targetDate, threshold) => {
  const diff = new Date(targetDate) - Date.now();
  if (diff > 0 && diff <= threshold) {
    return true;
  }
  return false;
};

/**
 *
 * @param {Object[]} assignments
 * @returns {boolean}
 */
const needRealtimeDateTracking = assignments => {
  const threshold = 24 * 60 * 60 * 1000; // 24 hours
  for (const assignment of assignments) {
    if (assignment.endDate && withinThreshold(assignment.endDate, threshold)) {
      return true;
    }
    for (const cls of assignment.class) {
      if (cls.startDate && withinThreshold(cls.startDate, threshold)) {
        return true;
      }
      if (cls.endDate && withinThreshold(cls.endDate, threshold)) {
        return true;
      }
    }
  }
  return false;
};

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  allClasses,
  userId,
  addRealtimeAssignment,
  addRealtimeReport,
  isLoading,
  rerenderAssignments,
  allAssignments
}) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, []);

  const topics = [
    `student_assignment:user:${userId}`,
    ...(currentGroup
      ? [`student_assignment:class:${currentGroup}`]
      : allClasses.map(x => `student_assignment:class:${x._id}`))
  ];

  const transformAssignment = payload => {
    addRealtimeAssignment(transformAssignmentForRedirect(currentGroup, userId, allClasses, payload));
  };

  useRealtimeV2(topics, {
    addAssignment: transformAssignment,
    addReport: addRealtimeReport,
    "absentee-mark": addRealtimeReport,
    "open-assignment": transformAssignment,
    "close-assignment": transformAssignment
  });

  useInterval(() => {
    if (needRealtimeDateTracking(allAssignments)) {
      rerenderAssignments();
    }
  }, 60 * 1000);

  const noDataNotification = () => (
    <NoDataBox>
      <img src={NoDataIcon} alt="noData" />
      <h4>No Assignments</h4>
      <p>You don&apos;t have any currently assigned or completed assignments.</p>
    </NoDataBox>
  );

  const renderAssignments = () => (
    <div>
      {assignments.map((item, index) => (
        <AssignmentCard key={index} data={item} currentGroup={currentGroup} type="assignment" />
      ))}
    </div>
  );

  const showLoader = () => <Spin size="small" />;

  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {!isLoading
          ? assignments && assignments.length > 0
            ? renderAssignments()
            : noDataNotification()
          : showLoader()}
      </Wrapper>
    </LayoutContent>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    currentGroup: getCurrentGroup(state),
    assignments: getAssignmentsSelector(state),
    allAssignments: values(assignmentsSelector(state)),
    allClasses: getClasses(state),
    userId: get(state, "user.user._id"),
    isLoading: get(state, "studentAssignment.isLoading")
  }),
  {
    fetchAssignments: fetchAssignmentsAction,
    addRealtimeAssignment: addRealtimeAssignmentAction,
    addRealtimeReport: addRealtimeReportAction,
    rerenderAssignments: rerenderAssignmentsAction
  }
)(Content);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentGroup: PropTypes.string.isRequired,
  allClasses: PropTypes.object.isRequired,
  allAssignments: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  addRealtimeAssignment: PropTypes.func.isRequired,
  addRealtimeReport: PropTypes.func.isRequired,
  rerenderAssignments: PropTypes.func.isRequired
};

Content.defaultProps = {
  assignments: []
};

const LayoutContent = styled(Layout.Content)`
  width: 100%;
`;
