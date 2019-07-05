//@ts-check
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { sumBy, sum, groupBy, round, mapValues, values, partial } from "lodash";
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

const getMastery = (assignmentMasteryArray, performancePercentage) => {
  performancePercentage = performancePercentage || 0;

  for (const mastery of assignmentMasteryArray) {
    if (performancePercentage >= mastery.threshold) {
      return mastery;
    }
  }
  return {
    color: "#E61E54",
    masteryLabel: "NM"
  };
};

const sortAlphaNum = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const getPerfomancePercentage = (testActivities, std) => {
  const performances = values(getStandardWisePerformanceMemoized(testActivities, std));
  return (sum(performances) / performances.length) * 100;
};

class TableDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stdId: "",
      selectedRow: 0,
      perfomancePercentage: undefined
    };
    this.dataLoaded = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { additionalData: { standards = [] } = {} } = props;
    const submittedActs = props.testActivities.filter(x => x.status === "submitted");
    if (submittedActs.length && !state.dataLoaded) {
      const firstStandard = standards.sort((a, b) => (b.masterySummary || 0) - (a.masterySummary || 0))[0];
      const perfomancePercentage = getPerfomancePercentage(props.testActivities, firstStandard);
      return { selectedRow: 1, stdId: firstStandard ? firstStandard._id : "", perfomancePercentage, dataLoaded: true };
    }
  }

  onCaretClick = (e, id = 0, data, perfomancePercentage = undefined) => {
    if (perfomancePercentage) {
      this.setState({ selectedRow: id, stdId: data, perfomancePercentage });
    } else {
      this.setState({ selectedRow: id, stdId: data });
    }
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
    const { selectedRow, stdId, perfomancePercentage } = this.state;
    const { additionalData: { standards = [], assignmentMastery = [] } = {} } = this.props;
    const columns = [
      {
        title: "Standards",
        dataIndex: "standard",
        key: "standard",
        sorter: (a, b) => sortAlphaNum(a.standard.props.children, b.standard.props.children),
        render: text => <StandardCell>{text}</StandardCell>
      },
      {
        title: "Question",
        dataIndex: "question",
        key: "question",
        sorter: (a, b) => sortAlphaNum(a.question, b.question),
        render: text => <QuestionCell>{text}</QuestionCell>
      },
      {
        title: "Mastery Summary",
        dataIndex: "masterySummary",
        key: "masterySummary",
        sorter: (a, b) => (a.masterySummary || 0) - (b.masterySummary || 0),
        render: text => (
          <MasterySummary
            strokeColor={getMastery(assignmentMastery, text || 0).color}
            showInfo={false}
            percent={round(parseFloat(text), 2) || 0}
          />
        )
      },
      {
        title: "Performance Summary %",
        key: "performanceSummary",
        dataIndex: "performanceSummary",
        sorter: (a, b) => (a.masterySummary || 0) - (b.masterySummary || 0),
        render: text => <PerformanceSummary>{round(text, 2) || 0}</PerformanceSummary>,
        defaultSortOrder: "descend"
      },
      {
        title: "",
        key: "icon",
        dataIndex: "icon"
      }
    ];
    const submittedLength = this.props.testActivities.filter(act => act.status === "submitted").length;
    console.log("standards", standards, standards.filter(x => x.level === "ELO"));
    const data = standards.map((std, index) => {
      const perfomancePercentage = this.getPerfomancePercentage(std);
      return {
        key: index + 1,
        standard: <p className="first-data">{std.identifier}</p>,
        question: [
          ...new Set(
            std.qIds.filter(qid => this.props.qids.indexOf(qid) > -1).map(id => this.props.labels[id].barLabel)
          )
        ].join(","),
        masterySummary: perfomancePercentage,
        performanceSummary: perfomancePercentage,
        icon: submittedLength ? (
          selectedRow === index + 1 ? (
            <div onClick={e => this.onCaretClick(e, 0, std._id)}>
              <img src={ArrowRightIcon} alt="right" />
            </div>
          ) : (
            <div onClick={e => this.onCaretClick(e, index + 1, std._id, perfomancePercentage)}>
              <img src={ArrowLeftIcon} alt="left" />
            </div>
          )
        ) : null
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
                    <PerformanceSummary>{round(d.performanceSummary, 2) || 0}</PerformanceSummary>
                  </InfoCard>
                </MoblieSubFlexContainer>

                <MoblieSubFlexContainer column>
                  <label>Mastery Summary</label>
                  <MasterySummary percent={round(parseFloat(d.masterySummary), 2)} showInfo={false} />
                  <MasterySummaryInfo>{round(d.masterySummary, 2)}%</MasterySummaryInfo>
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

        {selectedRow !== 0 && this.state.stdId != "" && (
          <DetailedDisplay
            onClose={e => this.onCaretClick(e, 0, stdId)}
            data={standards.find(std => std._id === stdId)}
            performancePercentage={perfomancePercentage}
            color={getMastery(assignmentMastery, perfomancePercentage || 0).color}
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
