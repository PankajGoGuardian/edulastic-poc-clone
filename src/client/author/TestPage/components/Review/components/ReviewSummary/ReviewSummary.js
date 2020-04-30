import { FieldLabel, FlexContainer, SelectInputStyled } from "@edulastic/common";
import { Row, Select } from "antd";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { getInterestedStandards } from "../../../../../dataUtils";
import Tags from "../../../../../src/components/common/Tags";
import { getInterestedCurriculumsSelector, getItemBucketsSelector } from "../../../../../src/selectors/user";
import {
  getDisableAnswerOnPaperSelector as hasRandomQuestions,
  getTestEntitySelector,
  getTestSummarySelector
} from "../../../../ducks";
import { Photo, selectsData } from "../../../common";
import {
  Container,
  FlexBoxFour,
  FlexBoxOne,
  FlexBoxThree,
  FlexBoxTwo,
  InnerFlex,
  MainLabel,
  Standard,
  SummaryInfoContainer,
  SummaryInfoNumber,
  SummaryInfoTitle,
  TableBodyCol,
  TableBodyRow,
  TableHeaderCol
} from "./styled";

const ReviewSummary = ({
  isEditable = false,
  onChangeGrade,
  owner,
  onChangeField,
  thumbnail,
  onChangeSubjects,
  onChangeCollection,
  grades,
  subjects,
  collections = [],
  interestedCurriculums,
  windowWidth,
  orgCollections,
  test: { itemGroups },
  summary,
  hasRandomQuestions,
  isPublishers
}) => {
  let subjectsList = [...selectsData.allSubjects];
  subjectsList.splice(0, 1);
  const questionsCount = summary?.totalItems || 0;
  const totalPoints = summary?.totalPoints || 0;
  const filteredCollections = useMemo(() => collections.filter(c => orgCollections.some(o => o._id === c._id)), [
    collections,
    orgCollections
  ]);

  return (
    <Container>
      <FlexBoxOne>
        <Photo url={thumbnail} onChangeField={onChangeField} owner={owner} isEditable={isEditable} height={120} />
      </FlexBoxOne>
      <FlexBoxTwo>
        <InnerFlex>
          <FieldLabel>Grade</FieldLabel>
          <SelectInputStyled
            data-cy="gradeSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
            placeholder="Please select"
            defaultValue={grades}
            onChange={onChangeGrade}
            margin="0px 0px 15px"
          >
            {selectsData.allGrades.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </InnerFlex>
        <InnerFlex>
          <FieldLabel>Subject</FieldLabel>
          <SelectInputStyled
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
            placeholder="Please select"
            defaultValue={subjects}
            onChange={onChangeSubjects}
            margin="0px 0px 15px"
          >
            {subjectsList.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </InnerFlex>
        {isPublishers && (
          <InnerFlex>
            <FieldLabel>Collections</FieldLabel>
            <SelectInputStyled
              mode="multiple"
              data-cy="collectionsSelect"
              size="medium"
              disabled={!owner || !isEditable}
              placeholder="Please select"
              value={filteredCollections.flatMap(c => c.bucketIds)}
              onChange={onChangeCollection}
              filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
              margin="0px 0px 15px"
            >
              {orgCollections?.map(o => (
                <Select.Option key={o.bucketId} value={o.bucketId} _id={o._id}>
                  {`${o.collectionName} - ${o.name}`}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </InnerFlex>
        )}
      </FlexBoxTwo>

      <FlexBoxThree>
        {isPublishers &&
          summary?.groupSummary?.map((group, i) => {
            const standards = group?.standards
              ?.filter(item => !item.isEquivalentStandard)
              ?.map(item => item.identifier);
            return (
              <>
                <MainLabel>{itemGroups[i]?.groupName}</MainLabel>
                <FlexContainer flexWrap={windowWidth < 1200 && "wrap"} justifyContent="space-between">
                  <SummaryInfoContainer style={{ borderRadius: 0, width: "50%" }}>
                    <SummaryInfoNumber data-cy={`item-${itemGroups[i]?.groupName}`}>
                      {group.totalItems}
                    </SummaryInfoNumber>
                    <SummaryInfoTitle>Items</SummaryInfoTitle>
                  </SummaryInfoContainer>
                  <SummaryInfoContainer style={{ borderRadius: 0, width: "50%", padding: "2px 0" }}>
                    <Tags tags={standards} key="standards" show={1} isStandards />
                  </SummaryInfoContainer>
                </FlexContainer>
              </>
            );
          })}

        <MainLabel>Summary</MainLabel>
        <FlexContainer flexWrap={windowWidth < 1200 && "wrap"} justifyContent="space-between">
          <SummaryInfoContainer>
            <SummaryInfoNumber data-cy="question">{questionsCount}</SummaryInfoNumber>
            <SummaryInfoTitle>Items</SummaryInfoTitle>
          </SummaryInfoContainer>
          <SummaryInfoContainer>
            <SummaryInfoNumber data-cy="points">{totalPoints}</SummaryInfoNumber>
            <SummaryInfoTitle>Points</SummaryInfoTitle>
          </SummaryInfoContainer>
        </FlexContainer>
      </FlexBoxThree>
      {!hasRandomQuestions && (
        <FlexBoxFour>
          <Row>
            <TableHeaderCol span={12}>Summary</TableHeaderCol>
            <TableHeaderCol span={6}>Q's</TableHeaderCol>
            <TableHeaderCol span={6}>Points</TableHeaderCol>
          </Row>
          {summary &&
            getInterestedStandards(summary, interestedCurriculums).map(
              data =>
                !data.isEquivalentStandard && (
                  <TableBodyRow key={data.key}>
                    <TableBodyCol span={12}>
                      <Standard>{data.identifier}</Standard>
                    </TableBodyCol>
                    <TableBodyCol span={6}>{data.totalQuestions}</TableBodyCol>
                    <TableBodyCol span={6}>{data.totalPoints}</TableBodyCol>
                  </TableBodyRow>
                )
            )}
          {summary?.noStandards?.totalQuestions > 0 && (
            <TableBodyRow key={"noStandard"}>
              <TableBodyCol span={12}>
                <Standard>NO STANDARD</Standard>
              </TableBodyCol>
              <TableBodyCol span={6}>{summary.noStandards.totalQuestions}</TableBodyCol>
              <TableBodyCol span={6}>{summary.noStandards.totalPoints}</TableBodyCol>
            </TableBodyRow>
          )}
        </FlexBoxFour>
      )}
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
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    orgCollections: getItemBucketsSelector(state),
    test: getTestEntitySelector(state),
    hasRandomQuestions: hasRandomQuestions(state),
    summary: getTestSummarySelector(state)
  }),
  null
)(ReviewSummary);
