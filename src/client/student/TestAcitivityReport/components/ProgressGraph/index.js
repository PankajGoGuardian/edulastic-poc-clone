import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { round, get } from "lodash";
import { connect } from "react-redux";
import BarGraph from "./BarGraph";
import OverallFeedback from "../OverallFeedback";

import { GraphContainer, ProgressBarContainer, BarGraphContainer, GraphTitle, Progress } from "./styled";
import { getTestFeedbackSelector, getItemsSelector } from "../../../sharedDucks/TestItem";

const ProgressGraph = ({ testActivity, questionActivities, testItems, setCurrentItem }) => {
  const { score, maxScore } = testActivity;
  const scorePercentage = round(score / maxScore, 2) * 100 || 0;

  return (
    <Fragment>
      <GraphContainer padding="20px" justifyContent="flex-start">
        <ProgressBarContainer>
          <GraphTitle>Performance Summary</GraphTitle>
          <Progress
            className="getProgress"
            strokeLinecap="square"
            type="circle"
            percent={scorePercentage}
            width={140}
            strokeWidth={8}
            strokeColor={{
              "0%": "#8DB8F3",
              "100%": "#2B7FF0"
            }}
            format={percent => `${percent}%`}
          />
        </ProgressBarContainer>
        <BarGraphContainer>
          <GraphTitle>Performance by Questions</GraphTitle>
          <BarGraph questionActivities={questionActivities} setCurrentItem={setCurrentItem} testItems={testItems} />
        </BarGraphContainer>
      </GraphContainer>

      <OverallFeedback />
    </Fragment>
  );
};

ProgressGraph.propTypes = {
  testActivity: PropTypes.object.isRequired
};

const enhance = connect(
  state => ({
    testItems: getItemsSelector(state),
    questionActivities: getTestFeedbackSelector(state),
    testActivity: get(state, `[studentReport][testActivity]`, {})
  }),
  null
);

export default enhance(ProgressGraph);
