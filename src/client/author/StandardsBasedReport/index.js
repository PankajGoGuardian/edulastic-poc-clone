import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { size, isEmpty } from "lodash";

import HooksContainer from "../ClassBoard/components/HooksContainer/HooksContainer";
import ClassHeader from "../Shared/Components/ClassHeader/ClassHeader";
import PresentationToggleSwitch from "../Shared/Components/PresentationToggleSwitch";
import TableDisplay from "./components/TableDisplay";
import { receiveTestActivitydAction } from "../src/actions/classBoard";
import {
  getTestActivitySelector,
  getAdditionalDataSelector,
  getQIdsSelector,
  getClassResponseSelector,
  getQLabelsSelector
} from "../ClassBoard/ducks";
import { Anchor, AnchorLink, PaginationInfo, StyledFlexContainer, DivWrapper } from "./components/styled";
import FeaturesSwitch from "../../features/components/FeaturesSwitch";

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
      classResponse = {}
    } = this.props;
    const testActivityId = this.getTestActivity(testActivity);

    return (
      <FeaturesSwitch inputFeatures="standardBasedReport" actionOnInaccessible="hidden" groupId={classId}>
        <React.Fragment>
          <ClassHeader
            classId={classId}
            active="standard_report"
            creating={creating}
            assignmentId={assignmentId}
            additionalData={additionalData || {}}
            testActivityId={testActivityId}
          />
          <HooksContainer classId={classId} assignmentId={assignmentId} />

          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to="/author/assignments">RECENTS ASSIGNMENTS</AnchorLink> /{" "}
              <Anchor>{additionalData.testName}</Anchor> / <Anchor>{additionalData.className}</Anchor>
            </PaginationInfo>
            <PresentationToggleSwitch groupId={classId} />
          </StyledFlexContainer>

          <DivWrapper>
            <TableDisplay
              testActivities={testActivity}
              labels={this.props.labels}
              additionalData={additionalData}
              qids={this.props.testQIds}
            />
          </DivWrapper>
        </React.Fragment>
      </FeaturesSwitch>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      testQIds: getQIdsSelector(state),
      classResponse: getClassResponseSelector(state),
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
