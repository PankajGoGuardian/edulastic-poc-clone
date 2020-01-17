import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Select, Row } from "antd";
import { keyBy } from "lodash";
import { FlexContainer } from "@edulastic/common";
import { Photo, selectsData } from "../../../common";

import {
  Container,
  SummaryInfoContainer,
  SummaryInfoNumber,
  SummaryInfoTitle,
  TableHeaderCol,
  TableBodyRow,
  TableBodyCol,
  Standard,
  FlexBoxOne,
  FlexBoxTwo,
  FlexBoxThree,
  FlexBoxFour,
  InnerFlex,
  SummarySelectBox,
  MainLabel
} from "./styled";
import { getInterestedStandards } from "../../../../../dataUtils";
import {
  getInterestedCurriculumsSelector,
  getOrgDataSelector,
  getUserFeatures
} from "../../../../../src/selectors/user";
import { getTestEntitySelector, getDisableAnswerOnPaperSelector as hasRandomQuestions } from "../../../../ducks";
import Tags from "../../../../../src/components/common/Tags";

const ReviewSummary = ({
  totalPoints,
  questionsCount,
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
  orgData,
  userFeatures,
  test: { itemGroups, summary },
  hasRandomQuestions
}) => {
  let subjectsList = [...selectsData.allSubjects];
  subjectsList.splice(0, 1);
  const isPublishers = userFeatures.isPublisherAuthor || userFeatures.isCurator;
  const groupsKeyed = keyBy(itemGroups, "_id");
  return (
    <Container>
      <FlexBoxOne>
        <Photo url={thumbnail} onChangeField={onChangeField} owner={owner} isEditable={isEditable} height={120} />
      </FlexBoxOne>
      <FlexBoxTwo>
        <InnerFlex>
          <MainLabel marginBottom="0px" width="75px">
            Grade
          </MainLabel>
          <SummarySelectBox
            data-cy="gradeSelect"
            mode="multiple"
            size="large"
            style={{ width: "100%" }}
            disabled={!owner || !isEditable}
            placeholder="Please select"
            defaultValue={grades}
            onChange={onChangeGrade}
            marginBottom="0px"
          >
            {selectsData.allGrades.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SummarySelectBox>
        </InnerFlex>
        <InnerFlex>
          <MainLabel marginBottom="0px" width="75px">
            Subject
          </MainLabel>
          <SummarySelectBox
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
            style={{ width: "100%" }}
            placeholder="Please select"
            defaultValue={subjects}
            onChange={onChangeSubjects}
            marginBottom="0px"
          >
            {subjectsList.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SummarySelectBox>
        </InnerFlex>
        {isPublishers && (
          <InnerFlex>
            <MainLabel marginBottom="0px" width="75px">
              Collections
            </MainLabel>
            <SummarySelectBox
              mode="multiple"
              data-cy="collectionsSelect"
              size="medium"
              disabled={!owner || !isEditable}
              style={{ width: "100%" }}
              placeholder="Please select"
              value={collections.map(o => o._id)}
              onChange={onChangeCollection}
              filterOption={(input, option) => option.props.title.toLowerCase().includes(input.toLowerCase())}
              marginBottom="0px"
            >
              {orgData?.itemBanks?.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id} title={name}>
                  {name}
                </Select.Option>
              ))}
            </SummarySelectBox>
          </InnerFlex>
        )}
      </FlexBoxTwo>

      <FlexBoxThree>
        {summary?.groupSummary?.map(group => {
          const standards = group?.standards?.filter(item => !item.isEquivalentStandard)?.map(item => item.identifier);
          return (
            <>
              <MainLabel>{groupsKeyed[group.groupId]?.groupName}</MainLabel>
              <FlexContainer flexWrap={windowWidth < 1200 && "wrap"} justifyContent="space-between">
                <SummaryInfoContainer style={{ borderRadius: 0, width: "50%" }}>
                  <SummaryInfoNumber data-cy="question">{group.totalItems}</SummaryInfoNumber>
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
    orgData: getOrgDataSelector(state),
    userFeatures: getUserFeatures(state),
    test: getTestEntitySelector(state),
    hasRandomQuestions: hasRandomQuestions(state)
  }),
  null
)(ReviewSummary);
