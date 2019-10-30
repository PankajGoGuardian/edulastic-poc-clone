/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Select, Row } from "antd";
import { Photo, selectsData } from "../../../common";
import { MainTitle } from "../../../Summary/components/Sidebar/styled";
import {
  Container,
  ImageWrapper,
  SelectWrapper,
  GradWrapper,
  SubjectWrapper,
  SummarySelect,
  SummaryWrapper,
  StandardWrapper,
  SummaryInfo,
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
  const subjectsList = [...selectsData.allSubjects];
  subjectsList.splice(0, 1);
  return (
    <Container>
      <ImageWrapper>
        <Photo url={thumbnail} onChangeField={onChangeField} owner={owner} isEditable={isEditable} height={120} />
      </ImageWrapper>

      <SelectWrapper>
        <GradWrapper>
          <MainTitle>Grade</MainTitle>
          <SummarySelect
            data-cy="gradesSelect"
            mode="multiple"
            size="large"
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
        </GradWrapper>

        <SubjectWrapper>
          <MainTitle>Subject</MainTitle>
          <SummarySelect
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
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
        </SubjectWrapper>
      </SelectWrapper>

      <SummaryWrapper>
        <MainTitle>Summary</MainTitle>
        <SummaryInfo justifyContent="space-between">
          <SummaryInfoContainer>
            <SummaryInfoTitle>Items</SummaryInfoTitle>
            <SummaryInfoNumber data-cy="question">{questionsCount}</SummaryInfoNumber>
          </SummaryInfoContainer>
          <SummaryInfoContainer>
            <SummaryInfoTitle>Points</SummaryInfoTitle>
            <SummaryInfoNumber data-cy="points">{totalPoints}</SummaryInfoNumber>
          </SummaryInfoContainer>
        </SummaryInfo>
      </SummaryWrapper>

      <StandardWrapper>
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
      </StandardWrapper>
    </Container>
  );
};

ReviewSummary.propTypes = {
  totalPoints: PropTypes.number.isRequired,
  questionsCount: PropTypes.number.isRequired,
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
