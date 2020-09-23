import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { round, get } from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import BarGraph from "./BarGraph";
import OverallFeedback from "../OverallFeedback";
import {
  GraphContainer,
  ProgressBarContainer,
  BarGraphContainer,
  GraphTitle,
  Progress,
  MessageBox,
  InfoRow,
  Info
} from "./styled";
import { getTestFeedbackSelector, getItemsSelector } from "../../../sharedDucks/TestItem";

const ProgressGraph = ({ testActivity, questionActivities, testItems, setCurrentItem, isCliUser }) => {
  const { score, maxScore } = testActivity;
  const scorePercentage = round(score / maxScore, 2) * 100 || 0;

  const totalTimeSpent = (questionActivities || []).reduce((total, current) => {
    total += current.timeSpent;
    return total;
  }, 0);

  const duration = moment.duration(totalTimeSpent);
  const submittedOn = moment(testActivity.updatedAt).format("MMM D YYYY / H:mm");
  const h = Math.floor(duration.asHours());
  let m = duration.minutes();
  const s = duration.seconds();
  if (s > 59) {
    m += 1;
  }

  const timeSpent = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;

  return (
    <Fragment>
      <GraphContainer padding="20px" justifyContent="flex-start" isCliUser={isCliUser}>
        <ProgressBarContainer style={{ textAlign: "center" }}>
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
          <Info>
            <InfoRow>
              <label>TIME (MIN)</label>
              <span>{timeSpent}</span>
            </InfoRow>
            <InfoRow>
              <label>SUBMITTED ON</label>
              <span>{submittedOn}</span>
            </InfoRow>
          </Info>
        </ProgressBarContainer>
        {isCliUser ? (
          <MessageBox>
            Thanks for helping your teacher get a better picture of what you know and what you need to get ready to
            learn
          </MessageBox>
        ) : (
          <BarGraphContainer>
            <GraphTitle>Performance by Questions</GraphTitle>
            <BarGraph questionActivities={questionActivities} setCurrentItem={setCurrentItem} testItems={testItems} />
          </BarGraphContainer>
        )}
      </GraphContainer>
      {!isCliUser && <OverallFeedback />}
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
