import {
  EduIf,
  FieldLabel,
  FlexContainer,
  SelectInputStyled,
  TextAreaInputStyled,
} from '@edulastic/common'
import { Row, Select, Input, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { test as testConstants } from '@edulastic/constants'
import { get } from 'lodash'
import { getInterestedStandards } from '../../../../../dataUtils'
import Tags from '../../../../../src/components/common/Tags'
import useTagSelection from '../../../common/useTagSelection'
import {
  getInterestedCurriculumsSelector,
  getCollectionsToAddContent,
  getItemBucketsForAllCollectionsSelector,
} from '../../../../../src/selectors/user'
import {
  getDisableAnswerOnPaperSelector as hasRandomQuestionsSelector,
  getTestEntitySelector,
  getTestSummarySelector,
  getAllTagsSelector,
  addNewTagAction,
} from '../../../../ducks'
import { Photo, selectsData } from '../../../common'
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
  TableHeaderCol,
  TestIdCopy,
} from './styled'

const ReviewSummary = ({
  isEditable = false,
  onChangeGrade,
  owner,
  onChangeField,
  thumbnail,
  onChangeSkillIdentifiers,
  onChangeSubjects,
  onChangeCollection,
  grades,
  subjects,
  collections = [],
  interestedCurriculums,
  windowWidth,
  test: {
    versionId,
    itemGroups,
    metadata,
    alignment,
    derivedFromPremiumBankId = false,
    description,
    tags,
  },
  allTagsData,
  addNewTag,
  testCategory,
  summary,
  hasRandomQuestions,
  isPublishers,
  collectionsToShow,
  allCollectionsList,
  editEnable,
}) => {
  const questionsCount = summary?.totalItems || 0
  const totalPoints = summary?.totalPoints || 0
  const collectionListToUse =
    !owner && !isEditable ? allCollectionsList : collectionsToShow

  const {
    searchValue,
    selectTags,
    searchTags,
    deselectTags,
    newAllTagsData,
    selectedTags,
  } = useTagSelection({
    tags,
    onChangeField,
    addNewTag,
    allTagsData,
  })

  const filteredCollections = useMemo(
    () =>
      collections.filter((c) =>
        collectionListToUse.some((o) => o._id === c._id)
      ),
    [collections, collectionListToUse]
  )

  const skillIdentifiers = (metadata?.skillIdentifiers || []).join(',')
  const interestedStandards = getInterestedStandards(
    summary,
    alignment,
    interestedCurriculums
  )
  const isCollectionSelectDisabled =
    !owner || !isEditable || derivedFromPremiumBankId

  return (
    <Container>
      <FlexBoxOne>
        <Photo
          url={thumbnail}
          onChangeField={onChangeField}
          owner={owner}
          isEditable={isEditable}
          height={120}
        />
        <InnerFlex>
          <EduIf condition={versionId?.length}>
            <>
              <FieldLabel display="inline-block">Test Id: </FieldLabel>
              <TestIdCopy
                copyable={{
                  text: versionId?.slice(-8),
                }}
              >
                {versionId?.slice(-8)}
              </TestIdCopy>
            </>
          </EduIf>
        </InnerFlex>
      </FlexBoxOne>
      <FlexBoxTwo>
        <InnerFlex>
          <FieldLabel>Description</FieldLabel>
          <TextAreaInputStyled
            value={description}
            onChange={(e) => onChangeField('description', e.target.value)}
            size="large"
            placeholder="Enter a description"
            margin="0px 0px 15px"
            height="110px"
          />
        </InnerFlex>
        <InnerFlex>
          <FieldLabel>Grade</FieldLabel>
          <SelectInputStyled
            showArrow
            data-cy="gradeSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
            placeholder="Please select"
            value={grades}
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
            showArrow
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            disabled={!owner || !isEditable}
            placeholder="Please select"
            value={subjects}
            onChange={onChangeSubjects}
            margin="0px 0px 15px"
          >
            {selectsData.allSubjects.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </InnerFlex>

        <InnerFlex>
          <FieldLabel data-cy="collection-review">Collections</FieldLabel>
          <Tooltip
            title={
              editEnable &&
              isCollectionSelectDisabled &&
              'Action not permitted on clone of a premium content'
            }
          >
            <SelectInputStyled
              showArrow
              mode="multiple"
              data-cy="collectionsSelect"
              size="medium"
              disabled={isCollectionSelectDisabled}
              placeholder="Please select"
              value={filteredCollections.flatMap((c) => c.bucketIds)}
              onChange={(value, options) => onChangeCollection(value, options)}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              margin="0px 0px 15px"
            >
              {collectionListToUse?.map((o) => (
                <Select.Option
                  key={o.bucketId}
                  value={o.bucketId}
                  _id={o._id}
                  type={o.type}
                  collectionName={o.collectionName}
                >
                  {`${o.collectionName} - ${o.name}`}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Tooltip>
        </InnerFlex>
        <InnerFlex>
          <FieldLabel>Tags</FieldLabel>
          <SelectInputStyled
            showArrow
            data-cy="tagsSelect"
            className="tagsSelect"
            mode="multiple"
            size="large"
            margin="0px 0px 15px"
            optionLabelProp="title"
            placeholder="Please enter"
            value={selectedTags}
            onSearch={searchTags}
            onSelect={selectTags}
            onDeselect={deselectTags}
            filterOption={(input, option) =>
              option.props.title
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
          >
            {searchValue?.trim() ? (
              <Select.Option key={0} value={searchValue} title={searchValue}>
                {`${searchValue} (Create new Tag)`}
              </Select.Option>
            ) : (
              ''
            )}
            {newAllTagsData.map(({ tagName, _id }) => (
              <Select.Option key={_id} value={_id} title={tagName}>
                {tagName}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </InnerFlex>
      </FlexBoxTwo>

      <FlexBoxThree>
        {(isPublishers ||
          testCategory == testConstants.testCategoryTypes.DYNAMIC_TEST) &&
          summary?.groupSummary?.map((group, i) => {
            const standards = interestedStandards.map(
              ({ identifier }) => identifier
            )
            return (
              <>
                <MainLabel>{itemGroups[i]?.groupName}</MainLabel>
                <FlexContainer
                  flexWrap={windowWidth < 1200 && 'wrap'}
                  justifyContent="space-between"
                >
                  <SummaryInfoContainer
                    style={{ borderRadius: 0, width: '50%' }}
                  >
                    <SummaryInfoNumber
                      data-cy={`item-${itemGroups[i]?.groupName}`}
                    >
                      {group.totalItems}
                    </SummaryInfoNumber>
                    <SummaryInfoTitle>Items</SummaryInfoTitle>
                  </SummaryInfoContainer>
                  <SummaryInfoContainer
                    style={{ borderRadius: 0, width: '50%', padding: '2px 0' }}
                  >
                    <Tags
                      tags={standards}
                      key="standards"
                      show={1}
                      isStandards
                    />
                  </SummaryInfoContainer>
                </FlexContainer>
              </>
            )
          })}

        <MainLabel>Summary</MainLabel>
        <FlexContainer
          flexWrap={windowWidth < 1200 && 'wrap'}
          justifyContent="space-between"
        >
          <SummaryInfoContainer>
            <SummaryInfoNumber data-cy="question">
              {questionsCount}
            </SummaryInfoNumber>
            <SummaryInfoTitle>Items</SummaryInfoTitle>
          </SummaryInfoContainer>
          <SummaryInfoContainer>
            <SummaryInfoNumber data-cy="points">
              {totalPoints}
            </SummaryInfoNumber>
            <SummaryInfoTitle>Points</SummaryInfoTitle>
          </SummaryInfoContainer>
        </FlexContainer>
      </FlexBoxThree>
      {!hasRandomQuestions && (
        <FlexBoxFour>
          <Row>
            <TableHeaderCol span={12}>Summary</TableHeaderCol>
            <TableHeaderCol span={6}>Q&apos;s</TableHeaderCol>
            <TableHeaderCol span={6}>Points</TableHeaderCol>
          </Row>
          {!!summary?.standards?.length &&
            summary.standards.map((data) => (
              <TableBodyRow data-cy={data.identifier} key={data.key}>
                <TableBodyCol span={12}>
                  <Standard>{data.identifier}</Standard>
                </TableBodyCol>
                <TableBodyCol span={6}>{data.totalQuestions}</TableBodyCol>
                <TableBodyCol span={6}>{data.totalPoints}</TableBodyCol>
              </TableBodyRow>
            ))}
          {summary?.noStandards?.totalQuestions > 0 && (
            <TableBodyRow key="noStandard">
              <TableBodyCol span={12}>
                <Standard>NO STANDARD</Standard>
              </TableBodyCol>
              <TableBodyCol span={6}>
                {summary.noStandards.totalQuestions}
              </TableBodyCol>
              <TableBodyCol span={6}>
                {summary.noStandards.totalPoints}
              </TableBodyCol>
            </TableBodyRow>
          )}
        </FlexBoxFour>
      )}
      <Input
        style={{ display: 'none' }}
        defaultValue={skillIdentifiers}
        onChange={(e) => onChangeSkillIdentifiers(e.currentTarget.value)}
      />
    </Container>
  )
}

ReviewSummary.propTypes = {
  totalPoints: PropTypes.number.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  grades: PropTypes.array.isRequired,
  thumbnail: PropTypes.string,
  summary: PropTypes.object,
  owner: PropTypes.bool,
  isEditable: PropTypes.bool,
  onChangeField: PropTypes.func,
  subjects: PropTypes.array.isRequired,
}

ReviewSummary.defaultProps = {
  thumbnail: '',
  summary: {},
  owner: false,
  isEditable: false,
  onChangeField: () => {},
}

export default connect(
  (state) => ({
    allTagsData: getAllTagsSelector(state, 'test'),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    test: getTestEntitySelector(state),
    hasRandomQuestions: hasRandomQuestionsSelector(state),
    summary: getTestSummarySelector(state),
    collectionsToShow: getCollectionsToAddContent(state),
    allCollectionsList: getItemBucketsForAllCollectionsSelector(state),
    editEnable: get(state, 'tests.editEnable'),
  }),
  {
    addNewTag: addNewTagAction,
  }
)(ReviewSummary)
