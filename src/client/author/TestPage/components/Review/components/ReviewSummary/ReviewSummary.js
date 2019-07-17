import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Select, Row } from "antd";

import { FlexContainer } from "@edulastic/common";

import { Photo, selectsData } from "../../../common";
import { SummarySelect } from "../../../Summary/common/SummaryForm";
import { MainTitle } from "../../../Summary/components/Sidebar/styled";
import {
  Container,
  SummaryInfoContainer,
  SummaryInfoNumber,
  SummaryInfoTitle,
  TableHeaderCol,
  TableBodyRow,
  TableBodyCol,
  Standard
} from "./styled";
import { getInterestedStandards } from "../../../../../dataUtils";
import { getInterestedCurriculumsSelector } from "../../../../../src/selectors/user";

const ReviewSummary = ({
  totalPoints,
  questionsCount,
  tableData,
  isEditable = false,
  onChangeGrade,
  owner,
  summary,
  onChangeField,
  thumbnail,
  onChangeSubjects,
  grades,
  subjects,
  interestedCurriculums
}) => {
  let subjectsList = [...selectsData.allSubjects];
  subjectsList.splice(0, 1);
  return (
    <Container>
      <Photo url={thumbnail} onChangeField={onChangeField} owner={owner} isEditable={isEditable} height={120} />

      <MainTitle>Grade</MainTitle>
      <SummarySelect
        data-cy="gradesSelect"
        mode="multiple"
        size="large"
        style={{ width: "100%" }}
        disabled={!owner || !isEditable}
        placeholder="Please select"
        defaultValue={grades}
        onChange={onChangeGrade}
      >
        {selectsData.allGrades.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </SummarySelect>

      <MainTitle>Subject</MainTitle>
      <SummarySelect
        data-cy="subjectSelect"
        mode="multiple"
        size="large"
        disabled={!owner || !isEditable}
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={subjects}
        onChange={onChangeSubjects}
      >
        {subjectsList.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </SummarySelect>

      <MainTitle>Summary</MainTitle>
      <FlexContainer justifyContent="space-between">
        <SummaryInfoContainer>
          <SummaryInfoNumber data-cy="question">{questionsCount}</SummaryInfoNumber>
          <SummaryInfoTitle>Questions</SummaryInfoTitle>
        </SummaryInfoContainer>
        <SummaryInfoContainer minWidth="95px">
          <SummaryInfoNumber data-cy="points">{summary.totalPoints}</SummaryInfoNumber>
          <SummaryInfoTitle>Points</SummaryInfoTitle>
        </SummaryInfoContainer>
      </FlexContainer>
      <Row>
        <TableHeaderCol span={8}>Summary</TableHeaderCol>
        <TableHeaderCol span={8}>Q's</TableHeaderCol>
        <TableHeaderCol span={8}>Points</TableHeaderCol>
      </Row>
      {summary &&
        getInterestedStandards(summary, interestedCurriculums).map(
          data =>
            !data.isEquivalentStandard && (
              <TableBodyRow key={data.key}>
                <TableBodyCol span={8}>
                  <Standard>{data.identifier}</Standard>
                </TableBodyCol>
                <TableBodyCol span={8}>{data.totalQuestions}</TableBodyCol>
                <TableBodyCol span={8}>{data.totalPoints}</TableBodyCol>
              </TableBodyRow>
            )
        )}
    </Container>
  );
};

ReviewSummary.propTypes = {
  totalPoints: PropTypes.number.isRequired,
  questionsCount: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  grades: PropTypes.array.isRequired,
  thumbnail: PropTypes.string,
  summary: PropTypes.object,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  onChangeField: PropTypes.func,
  subjects: PropTypes.array.isRequired
};

export default connect(
  state => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state)
  }),
  null
)(ReviewSummary);
