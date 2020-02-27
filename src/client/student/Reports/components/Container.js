import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";
import { get } from "lodash";
import { getCurrentGroup } from "../../Login/ducks";

// actions
import { fetchAssignmentsAction, getAssignmentsSelector } from "../ducks";

// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";
import NoDataNotification from "../../../common/components/NoDataNotification";
import { smallDesktopWidth } from "@edulastic/colors";

const Content = ({ flag, assignments, fetchAssignments, currentGroup, isLoading, currentChild }) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, [currentChild]);

  if (isLoading) {
    return <Spin size="large" />;
  }
  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {assignments.length < 1 ? (
          <NoDataNotification heading={"No Grades "} description={"You don't have any completed assignment."} />
        ) : (
            assignments.map(item => (
              <AssignmentCard key={`${item._id}_${item.classId}`} data={item} classId={item.classId} type="reports" />
            ))
          )}
      </Wrapper>
    </LayoutContent>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    currentGroup: getCurrentGroup(state),
    isLoading: get(state, "studentAssignment.isLoading"),
    assignments: getAssignmentsSelector(state),
    currentChild: state ?.user ?.currentChild,
  }),
  {
    fetchAssignments: fetchAssignmentsAction
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
  min-height: 75vh;
  width: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  margin: 15px 0px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.assignment.cardContainerBgColor};
  padding: 5px 15px;
  position: relative;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 5px;
  }
`;
