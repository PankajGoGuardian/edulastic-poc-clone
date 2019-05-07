//@ts-check
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { sumBy, sum, groupBy, round, mapValues, values } from "lodash";
import PropTypes from "prop-types";

import DetailedDisplay from "./DetailedDisplay";
import { getStandardWisePerformanceMemoized } from "../Transformer";

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
    const { testActivities: testActivity } = this.props;
    const studentData = testActivity.filter(std =>
      std.questionActivities.filter(
        questionActivity => data.qIds.filter(qId => questionActivity._id === qId).length > 0
      )
    );
    return studentData;
  };

  getPerfomancePercentage = std => {
    const performances = values(getStandardWisePerformanceMemoized(this.props.testActivities, std));
    return (sum(performances) / performances.length) * 100;
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
      return {
        key: index + 1,
        standard: <p className="first-data">{std.identifier}</p>,
        question: std.qIds
          .map(qid => this.props.qids.indexOf(qid))
          .filter(x => x > -1)
          .map(x => `Q${x + 1}`)
          .join(","),
        masterySummary: perfomancePercentage,
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

export default TableDisplay;

TableDisplay.propTypes = {
  /* eslint-disable react/require-default-props */
  testActivity: PropTypes.object,
  additionalData: PropTypes.object
};
