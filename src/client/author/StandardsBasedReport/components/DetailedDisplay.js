//@ts-check
import React, { Component } from "react";
import { Icon } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { get, round } from "lodash";

import { getTestActivitySelector, getAdditionalDataSelector } from "../../ClassBoard/ducks";
import { getStandardWisePerformanceDetailMemoized } from "../Transformer";
import {
  DetailCard,
  DetailCardHeader,
  DetailCardTitle,
  DetailCardSubTitle,
  DetailCardDesc,
  DetailTable,
  StudnetCell,
  PerformanceScore,
  PerformancePercent,
  MasteryCell,
  MasterySummary
} from "./styled";

const sortAlphaNum = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const columns = [
  {
    title: "Student",
    dataIndex: "student",
    key: "student",
    sorter: (a, b) => sortAlphaNum(a.student, b.student),
    render: text => <StudnetCell>{text}</StudnetCell>
  },
  {
    title: "Mastery",
    dataIndex: "mastery",
    key: "mastery",
    sorter: (a, b) => sortAlphaNum(a.performance, b.performance),
    render: mastery => (
      <MasteryCell>
        <span style={{ color: mastery.color }}>{mastery.masteryLabel}</span>
      </MasteryCell>
    )
  },
  {
    title: "Performance",
    dataIndex: "performance",
    sorter: (a, b) => sortAlphaNum(a.performance.split("@")[1], b.performance.split("@")[1]),
    key: "performance",
    render: text => {
      const strArr = text.split("@");
      return (
        <div style={{ textAlign: "center" }}>
          <PerformanceScore>{strArr[0]}</PerformanceScore>
          <PerformancePercent>{strArr[1]}</PerformancePercent>
        </div>
      );
    }
  }
];

class DetailedDisplay extends Component {
  filterData = () => {
    const { testActivity, data } = this.props;
    const studentData = testActivity.filter(std => {
      if (std.status != "submitted") {
        return false;
      }
      return std.questionActivities.filter(
        questionActivity => data.qIds.filter(qId => questionActivity._id === qId).length > 0
      );
    });
    return studentData;
  };

  displayData = () => {
    const { additionalData, isPresentationMode } = this.props;
    const assignmentMasteryArray = additionalData.assignmentMastery;
    assignmentMasteryArray.sort((a, b) => b.threshold - a.threshold);
    const scoreStudentWise = getStandardWisePerformanceDetailMemoized(
      this.props.testActivity,
      this.props.data,
      isPresentationMode
    );

    return Object.keys(scoreStudentWise).map((studentId, index) => {
      const score = scoreStudentWise[studentId] ? scoreStudentWise[studentId].score : 0;
      const perfomancePercentage = score * 100;

      // TODO: need to update `mastery'
      let mastery = {
        color: "#E61E54",
        masteryLabel: "NM"
      };

      for (let i = 0; i < assignmentMasteryArray.length; i++) {
        if (perfomancePercentage > assignmentMasteryArray[i].threshold) {
          mastery = assignmentMasteryArray[i];
          break;
        }
      }

      return {
        key: index + 1,
        student: scoreStudentWise[studentId].studentName,
        mastery,
        performance: `${round(score, 2)}/${scoreStudentWise[studentId].maxScore}@(${round(perfomancePercentage, 2)}%)`
      };
    });
  };

  render() {
    const { data, onClose, performancePercentage } = this.props;
    return (
      <React.Fragment>
        <DetailCard>
          <DetailCardHeader>
            <DetailCardTitle>
              Student Performance
              <Icon type="close" onClick={onClose} />
            </DetailCardTitle>
            <DetailCardSubTitle>{`Standard: ${data.identifier}`}</DetailCardSubTitle>
            <DetailCardDesc>{data.desc}</DetailCardDesc>
            <DetailCardSubTitle>MasterySummary</DetailCardSubTitle>
            <MasterySummary percent={round(parseFloat(performancePercentage), 2) || 0} />
            <DetailCardSubTitle>Performance summary % </DetailCardSubTitle>
            <DetailCardDesc>{round(parseFloat(performancePercentage), 2) || 0}</DetailCardDesc>
          </DetailCardHeader>
          <DetailTable columns={columns} dataSource={this.displayData()} pagination={false} />
        </DetailCard>
      </React.Fragment>
    );
  }
}

const enhance = compose(
  connect(state => ({
    testActivity: getTestActivitySelector(state),
    additionalData: getAdditionalDataSelector(state),
    isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false)
  }))
);

export default enhance(DetailedDisplay);
DetailedDisplay.propTypes = {
  data: PropTypes.object.isRequired,
  /* eslint-disable react/require-default-props */
  onClose: PropTypes.func,
  additionalData: PropTypes.object,
  testActivity: PropTypes.array
};
