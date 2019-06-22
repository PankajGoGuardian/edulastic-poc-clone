import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout } from "antd";
import { getCurrentGroup, getClasses } from "../../Login/ducks";
import { useRealtimeV2 } from "@edulastic/common";
import { get, partial } from "lodash";

// actions
import { fetchAssignmentsAction, getAssignmentsSelector, transformAssignmentForRedirect } from "../ducks";

import { addRealtimeAssignmentAction } from "../../sharedDucks/AssignmentModule/ducks";
import { addRealtimeReportAction } from "../../sharedDucks/ReportsModule/ducks";
// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  allClasses,
  userId,
  addRealtimeAssignment,
  addRealtimeReport
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

  useRealtimeV2(topics, { addAssignment: transformAssignment, addReport: addRealtimeReport });

  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {assignments.map((item, index) => (
          <AssignmentCard key={index} data={item} currentGroup={currentGroup} type="assignment" />
        ))}
      </Wrapper>
    </LayoutContent>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    currentGroup: getCurrentGroup(state),
    assignments: getAssignmentsSelector(state),
    allClasses: getClasses(state),
    userId: get(state, "user.user._id")
  }),
  {
    fetchAssignments: fetchAssignmentsAction,
    addRealtimeAssignment: addRealtimeAssignmentAction,
    addRealtimeReport: addRealtimeReportAction
  }
)(Content);

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired
};

Content.defaultProps = {
  assignments: []
};

const LayoutContent = styled(Layout.Content)`
  min-height: 100vh;
  padding-bottom: 150px;
  width: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  margin: 30px 30px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.assignment.cardContainerBgColor};
  padding: 5px 30px;
  position: relative;
  @media screen and (max-width: 1300px) {
    padding: 5px 15px;
  }

  @media screen and (max-width: 767px) {
    padding: 5px 30px;
  }
`;
