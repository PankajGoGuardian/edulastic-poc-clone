import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { size, isEmpty } from "lodash";

import { MainContentWrapper } from "@edulastic/common";
import HooksContainer from "../ClassBoard/components/HooksContainer/HooksContainer";
import ClassHeader from "../Shared/Components/ClassHeader/ClassHeader";
import PresentationToggleSwitch from "../Shared/Components/PresentationToggleSwitch";
import TableDisplay from "./components/TableDisplay";
import { receiveTestActivitydAction } from "../src/actions/classBoard";
import {
  getTestActivitySelector,
  getAdditionalDataSelector,
  getQIdsSelector,
  getQLabelsSelector
} from "../ClassBoard/ducks";
import { StyledFlexContainer, DivWrapper } from "./components/styled";
import ClassBreadBrumb from "../Shared/Components/ClassBreadCrumb";

class StandardsBasedReport extends Component {
  componentDidMount() {
    const { loadTestActivity, match, testActivity, additionalData } = this.props;
    if (!size(testActivity) && isEmpty(additionalData)) {
      const { assignmentId, classId } = match.params;
      loadTestActivity(assignmentId, classId);
    }
  }

  getTestActivity = data => {
    let id = null;
    data.forEach(item => {
      if (item.testActivityId) {
        id = item.testActivityId;
      }
    });
    return id;
  };

  render() {
    const {
      testActivity,
      additionalData,
      creating,
      match: {
        params: { assignmentId, classId }
      },
      labels,
      testQIds
    } = this.props;
    const testActivityId = this.getTestActivity(testActivity);

    return (
      <React.Fragment>
        <ClassHeader
          classId={classId}
          active="standard_report"
          creating={creating}
          assignmentId={assignmentId}
          additionalData={additionalData || {}}
          testActivityId={testActivityId}
          testActivity={testActivity}
        />
        <HooksContainer classId={classId} assignmentId={assignmentId} />
        <MainContentWrapper>
          <StyledFlexContainer justifyContent="space-between">
            <ClassBreadBrumb />
            <PresentationToggleSwitch groupId={classId} />
          </StyledFlexContainer>

          <DivWrapper>
            <TableDisplay
              testActivities={testActivity}
              labels={labels}
              additionalData={additionalData}
              qids={testQIds}
            />
          </DivWrapper>
        </MainContentWrapper>
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQIds: getQIdsSelector(state),
      labels: getQLabelsSelector(state)
    }),
    {
      loadTestActivity: receiveTestActivitydAction
    }
  )
);

export default enhance(StandardsBasedReport);

StandardsBasedReport.propTypes = {
  /* eslint-disable react/require-default-props */
  match: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  loadTestActivity: PropTypes.func,
  creating: PropTypes.object
};

StandardsBasedReport.defaultProps = {
  additionalData: {}
};
