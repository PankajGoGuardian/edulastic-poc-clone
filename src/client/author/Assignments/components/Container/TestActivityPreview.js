import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { IconReport } from "@edulastic/icons";
import { MainContentWrapper, FlexContainer } from "@edulastic/common";
import ProgressGraph from "../../../../common/components/ProgressGraph";
import TestAcivityHeader from "../../../../student/sharedComponents/Header";

import {
  previewTestActivitySelector,
  previewTestQuestionActivities
} from "../../../../assessment/sharedDucks/previewTest";

const TestActivityPreview = ({ title, testItems, testActivity, questionActivities, onClose }) => (
  <FlexContainer height="100vh">
    <TestAcivityHeader
      showExit
      hideSideMenu
      onExit={onClose}
      isDocBased={false}
      titleIcon={IconReport}
      titleText={title}
      showReviewResponses={false}
    />
    <MainContentWrapper padding="0px 20px">
      <StudentPerformancePreview>
        <ProgressGraph testActivity={testActivity} questionActivities={questionActivities} testItems={testItems} />
      </StudentPerformancePreview>
    </MainContentWrapper>
  </FlexContainer>
);

const enhanced = connect(
  state => ({
    title: state.test.title,
    testItems: state.test.items,
    testActivity: previewTestActivitySelector(state),
    questionActivities: previewTestQuestionActivities(state)
  }),
  null
);

export default enhanced(TestActivityPreview);

const StudentPerformancePreview = styled.div`
  margin-top: ${props => `${props.theme.HeaderHeight.xs}px`};
`;
