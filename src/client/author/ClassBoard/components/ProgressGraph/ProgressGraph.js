import React, { Component } from "react";
import PropTypes from "prop-types";
import { sumBy, round } from "lodash";
import BarGraph from "../BarGraph/BarGraph";
import { Tag } from "antd";
import {
  StyledProgress,
  StyledDiv,
  StyledProgressDiv,
  GraphInfo,
  GraphDescription,
  ProgressBarContainer
} from "./styled";
import { lightGreen4, themeColor } from "@edulastic/colors";

export default class Graph extends Component {
  static propTypes = {
    gradebook: PropTypes.object.isRequired,
    testActivity: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired
  };

  calculateAvgScore = () => {
    const { testActivity: students } = this.props;

    if (!students.length) {
      return 0;
    }
    const totalScore = sumBy(students, student => {
      const { score, maxScore } = student;
      return ((score || 0) / (maxScore || 1)) * 100;
    });
    return round(totalScore / students.length, 2);
  };

  render() {
    const { gradebook, onClickHandler, testQuestionActivities, testActivity, title = "" } = this.props;
    const absentNumber = (testActivity || []).filter(x => x.status === "absent").length;
    const percentage = round(gradebook.avgScore * 100);
    return (
      <StyledDiv>
        <ProgressBarContainer>
          <StyledProgressDiv>
            {
              // TODO: need to implement gradient stoke color
            }
            <Tag
              color={lightGreen4}
              style={{
                color: themeColor,
                textAlign: "center",
                width: "200px",
                overflow: "hidden",
                marginBottom: "5px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {title}
            </Tag>
            <StyledProgress
              className="getProgress"
              strokeLinecap="square"
              type="circle"
              percent={percentage}
              width={167}
              strokeWidth={8}
              strokeColor="#2B7FF0"
              format={percent => `${percent}%`}
            />
            <GraphDescription>average score %</GraphDescription>
          </StyledProgressDiv>
          <GraphInfo data-cy="submittedSummary">
            {gradebook.submittedNumber} out of {gradebook.total} Submitted
            {absentNumber > 0 && <p>({absentNumber} absent)</p>}
            {/* <p>({gradebook.total - gradebook.submittedNumber} Absent)</p> */}
          </GraphInfo>
        </ProgressBarContainer>
        <BarGraph
          gradebook={gradebook}
          testQuestionActivities={testQuestionActivities}
          onClickHandler={onClickHandler}
        />
      </StyledDiv>
    );
  }
}
