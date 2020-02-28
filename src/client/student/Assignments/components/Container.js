import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";
import { largeDesktopWidth } from "@edulastic/colors";

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

import {
  addRealtimeAssignmentAction,
  rerenderAssignmentsAction,
  removeAssignmentAction
} from "../../sharedDucks/AssignmentModule/ducks";
import { addRealtimeReportAction } from "../../sharedDucks/ReportsModule/ducks";
// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";
import NoDataIcon from "../../assets/nodata.svg";
import NoDataNotification from "../../../common/components/NoDataNotification";

const withinThreshold = (targetDate, threshold) => {
  const diff = new Date(targetDate) - Date.now();
  if (diff <= threshold) {
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
  allAssignments,
  removeAssignment,
  currentChild
}) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, [currentChild]);

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
    "close-assignment": transformAssignment,
    removeAssignment
  });

  useInterval(() => {
    if (needRealtimeDateTracking(allAssignments)) {
      rerenderAssignments();
    }
  }, 60 * 1000);

  const noDataNotification = () => (
    <NoDataNotification
      heading="No Assignments "
      description={"You don't have any currently assigned or completed assignments."}
    />
  );

  const renderAssignments = () => (
    <AssignmentWrapper>
      {assignments.map(item => (
        <AssignmentCard key={`${item._id}_${item.classId}`} data={item} classId={item.classId} type="assignment" />
      ))}
    </AssignmentWrapper>
  );

  const showLoader = () => <Spin size="small" />;

  console.log("assignments are", assignments);
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
    isLoading: get(state, "studentAssignment.isLoading"),
    currentChild: state?.user?.currentChild
  }),
  {
    fetchAssignments: fetchAssignmentsAction,
    addRealtimeAssignment: addRealtimeAssignmentAction,
    addRealtimeReport: addRealtimeReportAction,
    rerenderAssignments: rerenderAssignmentsAction,
    removeAssignment: removeAssignmentAction
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

const AssignmentWrapper = styled.div`
  @media (max-width: ${largeDesktopWidth}) {
    margin-top: -3px;
  }
`;
