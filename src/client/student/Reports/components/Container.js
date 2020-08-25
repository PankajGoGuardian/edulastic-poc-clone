import React, { useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Layout, Spin } from "antd";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { smallDesktopWidth } from "@edulastic/colors";
import useInterval from "@use-it/interval";
import { getCurrentGroup } from "../../Login/ducks";

// actions
import { fetchAssignmentsAction, getAssignmentsSelector } from "../ducks";

// components
import AssignmentCard from "../../sharedComponents/AssignmentCard";
import NoDataNotification from "../../../common/components/NoDataNotification";
import { startServerTimerAction } from "../../sharedDucks/AssignmentModule/ducks";

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  isLoading,
  currentChild,
  location: { state = {} },
  serverTimeStamp,
  startServerTimer
}) => {
  useEffect(() => {
    fetchAssignments(currentGroup);
  }, [currentChild, currentGroup]);

  useInterval(() => {
    if (!isLoading && serverTimeStamp) {
      startServerTimer();
    }
  }, 60 * 1000);
  if (isLoading) {
    return <Spin size="large" />;
  }
  const { highlightAssignment } = state;
  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {assignments.length < 1 ? (
          <NoDataNotification heading="No Grades" description="You don't have any completed assignment." />
        ) : (
          assignments.map(item => (
            <AssignmentCard
              key={`${item._id}_${item.classId}`}
              data={item}
              classId={item.classId}
              type="reports"
              highlightMode={item._id === highlightAssignment}
            />
          ))
        )}
      </Wrapper>
    </LayoutContent>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      flag: state.ui.flag,
      currentGroup: getCurrentGroup(state),
      isLoading: get(state, "studentAssignment.isLoading"),
      assignments: getAssignmentsSelector(state),
      currentChild: state?.user?.currentChild,
      serverTimeStamp: get(state, "studentAssignment.serverTs")
    }),
    {
      fetchAssignments: fetchAssignmentsAction,
      startServerTimer: startServerTimerAction
    }
  )
);

export default enhance(Content);

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
  background-color: ${props => props.theme.assignment.cardContainerBgColor};
  position: relative;
`;
