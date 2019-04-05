import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { sumBy } from "lodash";
import PropTypes from "prop-types";

import DetailedDisplay from "./DetailedDisplay";

import { getAdditionalDataSelector, getTestActivitySelector } from "../../ClassBoard/ducks";

import {
  TableData,
  StandardCell,
  QuestionCell,
  MasterySummary,
  PerformanceSummary,
  StyledCard,
  ReportTitle,
  MoblieFlexContainer,
  MoblieSubFlexContainer,
  StandardsMobile,
  InfoCard,
  MasterySummaryInfo
} from "./styled";

import ArrowLeftIcon from "../Assets/left-arrow.svg";
import ArrowRightIcon from "../Assets/right-arrow.svg";

class TableDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stdId: "",
      selectedRow: 0
    };
  }

  onCaretClick = (e, id = 0, data) => {
    this.setState({ selectedRow: id, stdId: data });
  };

  isMobile = () => window.innerWidth < 480;

  filteredData = data => {
    const { testActivity } = this.props;
    const studentData = testActivity.filter(std =>
      std.questionActivities.filter(
        questionActivity => data.qIds.filter(qId => questionActivity._id === qId).length > 0
      )
    );
    return studentData;
  };

  getPerfomancePercentage = data => {
    const studentData = this.filteredData(data);
    const totalMaxScore = sumBy(studentData, std => std.maxScore);
    const totalScore = sumBy(studentData, std => std.score);
    const perfomancePercentage = parseFloat(((totalScore / totalMaxScore) * 100).toFixed(0));
    return perfomancePercentage;
  };

  getMasterySummary = data => {
    const {
      additionalData: { assignmentMastery }
    } = this.props;
    const studentData = this.filteredData(data);
    let totalMastered = 0;
    studentData.forEach(student => {
      const score = student.score || 0;
      if (assignmentMastery[1].threshold < ((score / student.maxScore) * 100).toFixed(10)) {
        totalMastered += 1;
      }
    });
    return Math.round((totalMastered / studentData.length) * 100 * 100) / 100;
  };

  render() {
    const { selectedRow, stdId } = this.state;
    const { additionalData: { standards = [] } = {} } = this.props;

    const columns = [
      {
        title: "Standards",
        dataIndex: "standard",
        key: "standard",
        sorter: (a, b) => a.age - b.age,
        render: text => <StandardCell>{text}</StandardCell>
      },
      {
        title: "Question",
        dataIndex: "question",
        key: "question",
        sorter: (a, b) => a.age - b.age,
        render: text => <QuestionCell>{text}</QuestionCell>
      },
      {
        title: "Mastery Summary",
        dataIndex: "masterySummary",
        key: "masterySummary",
        sorter: (a, b) => a.age - b.age,
        render: text => <MasterySummary percent={parseFloat(text)} />
      },
      {
        title: "Performance Summary %",
        key: "performanceSummary",
        dataIndex: "performanceSummary",
        sorter: (a, b) => a.age - b.age,
        render: text => <PerformanceSummary>{text}</PerformanceSummary>
      },
      {
        title: "",
        key: "icon",
        dataIndex: "icon"
      }
    ];

    const data = standards.map((std, index) => {
      const perfomancePercentage = this.getPerfomancePercentage(std);
      const masterySummaryPercentage = this.getMasterySummary(std);

      return {
        key: index + 1,
        standard: <p className="first-data">{std.identifier}</p>,
        question: `Q${index + 1}`, // std.qIds ? std.qIds[0] : "",
        masterySummary: masterySummaryPercentage,
        performanceSummary: perfomancePercentage,
        icon:
          selectedRow === index + 1 ? (
            <div onClick={e => this.onCaretClick(e, 0, std._id)}>
              <img src={ArrowRightIcon} alt="right" />
            </div>
          ) : (
            <div onClick={e => this.onCaretClick(e, index + 1, std._id)}>
              <img src={ArrowLeftIcon} alt="left" />
            </div>
          )
      };
    });

    const isMobile = this.isMobile();

    return (
      <React.Fragment>
        {isMobile && (
          <MoblieFlexContainer>
            <ReportTitle>Standard performance</ReportTitle>
          </MoblieFlexContainer>
        )}
        {isMobile && (
          <MoblieFlexContainer>
            {data.map((d, i) => (
              <StyledCard key={i}>
                <StandardsMobile>{d.standard}</StandardsMobile>
                <MoblieSubFlexContainer>
                  <InfoCard>
                    <label>Question</label>
                    <QuestionCell>{d.question}</QuestionCell>
                  </InfoCard>
                  <InfoCard>
                    <label>Performance %</label>
                    <PerformanceSummary>{d.performanceSummary}</PerformanceSummary>
                  </InfoCard>
                </MoblieSubFlexContainer>

                <MoblieSubFlexContainer column>
                  <label>Mastery Summary</label>
                  <MasterySummary percent={parseFloat(d.masterySummary)} showInfo={false} />
                  <MasterySummaryInfo>{d.masterySummary}%</MasterySummaryInfo>
                </MoblieSubFlexContainer>

                <MoblieSubFlexContainer>{d.icon}</MoblieSubFlexContainer>
              </StyledCard>
            ))}
          </MoblieFlexContainer>
        )}

        {!isMobile && (
          <StyledCard>
            <ReportTitle>Standard performance</ReportTitle>
            <TableData columns={columns} dataSource={data} pagination={false} />
          </StyledCard>
        )}

        {selectedRow !== 0 && (
          <DetailedDisplay
            onClose={e => this.onCaretClick(e, 0, stdId)}
            data={standards.find(std => std._id === stdId)}
          />
        )}
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

export default enhance(TableDisplay);

TableDisplay.propTypes = {
  /* eslint-disable react/require-default-props */
  testActivity: PropTypes.object,
  additionalData: PropTypes.object
};
