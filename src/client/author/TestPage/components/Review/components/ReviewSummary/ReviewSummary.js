import React from "react";
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

const ReviewSummary = ({
  totalPoints,
  questionsCount,
  tableData,
  onChangeGrade,
  onChangeSubjects,
  grades,
  subjects
}) => (
  <Container>
    <Photo height={120} />

    <MainTitle>Grade</MainTitle>
    <SummarySelect
      mode="multiple"
      size="large"
      style={{ width: "100%" }}
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
      mode="multiple"
      size="large"
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={subjects}
      onChange={onChangeSubjects}
    >
      {selectsData.allSubjects.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </SummarySelect>

    <MainTitle>Summary</MainTitle>
    <FlexContainer justifyContent="space-between">
      <SummaryInfoContainer>
        <SummaryInfoNumber>{questionsCount}</SummaryInfoNumber>
        <SummaryInfoTitle>Questions</SummaryInfoTitle>
      </SummaryInfoContainer>
      <SummaryInfoContainer>
        <SummaryInfoNumber>{totalPoints}</SummaryInfoNumber>
        <SummaryInfoTitle>Points</SummaryInfoTitle>
      </SummaryInfoContainer>
    </FlexContainer>
    <Row>
      <TableHeaderCol span={8}>Summary</TableHeaderCol>
      <TableHeaderCol span={8}>Q's</TableHeaderCol>
      <TableHeaderCol span={8}>Points</TableHeaderCol>
    </Row>
    {tableData.map(data => (
      <TableBodyRow key={data.key}>
        <TableBodyCol span={8}>
          <Standard>{data.standard}</Standard>
        </TableBodyCol>
        <TableBodyCol span={8}>{data.qs}</TableBodyCol>
        <TableBodyCol span={8}>{data.points}</TableBodyCol>
      </TableBodyRow>
    ))}
  </Container>
);

ReviewSummary.propTypes = {
  totalPoints: PropTypes.number.isRequired,
  questionsCount: PropTypes.number.isRequired,
  tableData: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  grades: PropTypes.array.isRequired,
  subjects: PropTypes.array.isRequired
};

export default ReviewSummary;
