//@ts-check
import React, { Component } from "react";
import { Icon } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";

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
  MasteryCell
} from "./styled";

const columns = [
  {
    title: "Student",
    dataIndex: "student",
    key: "student",
    sorter: (a, b) => a.age - b.age,
    render: text => <StudnetCell>{text}</StudnetCell>
  },
  {
    title: "Mastery",
    dataIndex: "mastery",
    key: "mastery",
    sorter: (a, b) => a.age - b.age,
    render: mastery => (
      <MasteryCell>
        <span style={{ color: mastery.color }}>
          {mastery.masteryLabel}
          <Icon type={mastery.icon || "caret-up"} />
        </span>
      </MasteryCell>
    )
  },
  {
    title: "Performance",
    dataIndex: "performance",
    sorter: (a, b) => a.age - b.age,
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
    const { additionalData } = this.props;
    const assignmentMasteryArray = additionalData.assignmentMastery;
    assignmentMasteryArray.sort((a, b) => b.threshold - a.threshold);
    const scoreStudentWise = getStandardWisePerformanceDetailMemoized(this.props.testActivity, this.props.data);

    return Object.keys(scoreStudentWise).map((studentId, index) => {
      const score = scoreStudentWise[studentId] ? scoreStudentWise[studentId].score : 0;
      const perfomancePercentage = score * 100;

      // TODO need to update `mastery'
      let mastery = {
        color: "#E61E54",
        masteryLabel: "NM",
        icon: "caret-down"
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
        performance: `${score}/${scoreStudentWise[studentId].maxScore}@(${perfomancePercentage}%)`
      };
    });
  };

  render() {
    const { data, onClose } = this.props;
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
    additionalData: getAdditionalDataSelector(state)
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
