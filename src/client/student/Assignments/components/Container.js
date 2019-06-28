import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";
import { useRealtimeV2 } from "@edulastic/common";
import { get, partial } from "lodash";
import { getCurrentGroup, getClasses } from "../../Login/ducks";

// actions
import { fetchAssignmentsAction, getAssignmentsSelector, transformAssignmentForRedirect } from "../ducks";

import { addRealtimeAssignmentAction } from "../../sharedDucks/AssignmentModule/ducks";
import { addRealtimeReportAction } from "../../sharedDucks/ReportsModule/ducks";
// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";
import NoDataIcon from "../../assets/nodata.svg";

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  allClasses,
  userId,
  addRealtimeAssignment,
  addRealtimeReport,
  isLoading
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

  const noDataNotification = () => {
    return (
      <NoDataBox>
        <img src={NoDataIcon} alt="noData" />
        <h4>No Assignments</h4>
        <p>You don&apos;t have any currently assigned or completed assignments.</p>
      </NoDataBox>
    );
  };

  const renderAssignments = () => {
    return (
      <div>
        {assignments.map((item, index) => (
          <AssignmentCard key={index} data={item} currentGroup={currentGroup} type="assignment" />
        ))}
      </div>
    );
  };

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
    allClasses: getClasses(state),
    userId: get(state, "user.user._id"),
    isLoading: get(state, "studentAssignment.isLoading")
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
  min-height: 400px;
  margin: 30px;
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

const NoDataBox = styled.div`
  background: #f3f3f3;
  width: 300px;
  height: 300px;
  position: absolute;
  left: 50%;
  border-radius: 6px;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  img {
    width: 50px;
    margin-bottom: 15px;
  }
  h4 {
    color: #304050;
    font-size: 18px;
    font-weight: 600;
  }
  p {
    color: #848993;
    font-size: 12px;
    line-height: 22px;
  }
`;
