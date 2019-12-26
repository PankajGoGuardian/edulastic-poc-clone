import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { questionType as questionTypes } from "@edulastic/constants";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import {
  Container,
  Item,
  ItemBody,
  ItemHeader,
  MainFilterItems,
  ItemRelative,
  IconWrapper,
  StyledDatePicker
} from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";
import StandardsSearchModal from "./StandardsSearchModal";
import { getCollectionsSelector, getUserFeatures, getUserOrgId } from "../../../src/selectors/user";
import { test as testsConstants } from "@edulastic/constants";
import { getAllTagsSelector } from "../../../TestPage/ducks";
import { getCurrentDistrictUsersSelector, getCurrentDistrictUsersAction } from "../../../../student/Login/ducks";
const Search = ({
  search: {
    grades,
    status,
    tags,
    subject,
    collections: _collections = [],
    curriculumId,
    standardIds,
    questionType,
    depthOfKnowledge,
    authorDifficulty,
    authoredByIds,
    createdAt
  },
  allTagsData,
  onSearchFieldChange,
  curriculumStandards,
  showStatus = false,
  collections,
  formattedCuriculums,
  defaultQuestionTypes = [],
  userFeatures,
  districtId,
  currentDistrictUsers,
  getCurrentDistrictUsers
}) => {
  const [showModal, setShowModalValue] = useState(false);

  useEffect(() => {
    if (userFeatures.isCurator && !currentDistrictUsers) getCurrentDistrictUsers(districtId);
  }, [userFeatures, districtId, currentDistrictUsers]);

  const setShowModal = value => {
    if (value && !curriculumStandards.elo.length) {
      return;
    }
    setShowModalValue(value);
  };
  const handleApply = standardIds => {
    onSearchFieldChange("standardIds")(standardIds);
    setShowModalValue(false);
  };

  const isPublishers = !!(userFeatures.isPublisherAuthor || userFeatures.isCurator);

  const collectionData = [
    ...testsConstants.collectionDefaultFilter,
    ...collections.map(o => ({ text: o.name, value: o._id }))
  ].filter(cd =>
    // filter public, edulastic certified &
    // engage ny (name same as Edulastic Certified) for publishers
    isPublishers ? !["Public Library", "Edulastic Certified"].includes(cd.text) : 1
  );
  const isStandardsDisabled = !(curriculumStandards.elo && curriculumStandards.elo.length > 0);
  const standardsPlaceholder = isStandardsDisabled ? "Available with Curriculum" : 'Type to Search, for example "k.cc"';

  const questionsType = [
    { value: "", text: "All Types" },
    { value: "multipleChoice", text: "Multiple Choice" },
    { value: "math", text: "Math" },
    { value: "passageWithQuestions", text: "Passage with Questions" },
    { value: "dash", text: "--------------------", disabled: true },
    ...questionTypes.selectsData
      .filter(el => !["", "multipleChoice", "math", "passageWithQuestions"].includes(el.value))
      .sort((a, b) => (a.value > b.value ? 1 : -1))
  ];

  return (
    <MainFilterItems>
      {showModal ? (
        <StandardsSearchModal
          setShowModal={setShowModal}
          showModal={showModal}
          standardIds={standardIds}
          handleApply={handleApply}
        />
      ) : (
        ""
      )}
      <Container>
        <Item>
          <ItemHeader>Grades</ItemHeader>
          <Select
            data-cy="selectGrades"
            mode="multiple"
            size="large"
            placeholder="All Grades"
            value={grades}
            onChange={onSearchFieldChange("grades")}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {selectsData.allGrades.map(el => (
              <Select.Option key={el.value} value={el.value}>
                {el.text}
              </Select.Option>
            ))}
          </Select>
        </Item>
        <Item>
          <ItemHeader>Subject</ItemHeader>
          <ItemBody>
            <Select
              data-cy="selectSubject"
              onSelect={onSearchFieldChange("subject")}
              value={subject}
              size="large"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {selectsData.allSubjects.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Standard set</ItemHeader>
          <ItemBody>
            <Select
              data-cy="selectSdtSet"
              showSearch
              size="large"
              optionFilterProp="children"
              onSelect={onSearchFieldChange("curriculumId")}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={curriculumId}
              defaultValue=""
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <Select.Option key="" value="">
                All Standard set
              </Select.Option>
              {subject !== ""
                ? formattedCuriculums.map(el => (
                    <Select.Option key={el.value} value={el.value} disabled={el.disabled}>
                      {el.text}
                    </Select.Option>
                  ))
                : ""}
            </Select>
          </ItemBody>
        </Item>
        <ItemRelative>
          <IconWrapper>
            <i class="fa fa-expand" aria-hidden="true" onClick={() => setShowModal(true)} />
          </IconWrapper>
          <ItemHeader>Standards</ItemHeader>
          <Select
            data-cy="selectStd"
            mode="multiple"
            size="large"
            optionFilterProp={"children"}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            placeholder={standardsPlaceholder}
            onChange={onSearchFieldChange("standardIds")}
            value={standardIds}
            disabled={isStandardsDisabled}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {curriculumStandards.elo.map(el => (
              <Select.Option key={el._id} value={el._id}>
                {`${el.identifier}`}
              </Select.Option>
            ))}
          </Select>
        </ItemRelative>
        <Item>
          <ItemHeader>Question Type</ItemHeader>
          <ItemBody>
            <Select
              data-cy="selectqType"
              showSearch
              size="large"
              optionFilterProp={"children"}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onSelect={onSearchFieldChange("questionType")}
              value={questionType}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {questionsType.map(el => (
                <Select.Option key={el.value} value={el.value} disabled={el.disabled}>
                  {el.text}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Depth of Knowledge</ItemHeader>
          <ItemBody>
            <Select
              data-cy="selectDOK"
              size="large"
              onSelect={onSearchFieldChange("depthOfKnowledge")}
              value={depthOfKnowledge}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {selectsData.allDepthOfKnowledge.map((el, index) => (
                <Select.Option key={el.value} value={el.value}>
                  {`${index > 0 ? index : ""} ${el.text}`}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Difficulty</ItemHeader>
          <ItemBody>
            <Select
              data-cy="selectDifficulty"
              size="large"
              onSelect={onSearchFieldChange("authorDifficulty")}
              value={authorDifficulty}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {selectsData.allAuthorDifficulty.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Collections</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              data-cy="Collections"
              size="large"
              onChange={onSearchFieldChange("collections")}
              value={_collections}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {collectionData.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>

        {(showStatus || isPublishers) && (
          <Item>
            <ItemHeader>Status</ItemHeader>
            <ItemBody>
              <Select
                data-cy="selectStatus"
                size="large"
                onSelect={onSearchFieldChange("status")}
                value={status}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {selectsData.allStatus.map(el => (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
                  </Select.Option>
                ))}
                {isPublishers &&
                  selectsData.extraStatus.map(el => (
                    <Select.Option key={el.value} value={el.value}>
                      {el.text}
                    </Select.Option>
                  ))}
              </Select>
            </ItemBody>
          </Item>
        )}

        {isPublishers && (
          <Item>
            <ItemHeader>Created On</ItemHeader>
            <ItemBody>
              <StyledDatePicker
                format={"DD/MM/YYYY"}
                onChange={onSearchFieldChange("createdAt")}
                value={createdAt ? moment(createdAt) : ""}
              />
            </ItemBody>
          </Item>
        )}

        {userFeatures.isCurator && (
          <Item>
            <ItemHeader>Authored By</ItemHeader>
            <ItemBody>
              <Select
                mode="multiple"
                size="large"
                placeholder="All Authors"
                optionFilterProp={"children"}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={onSearchFieldChange("authoredByIds")}
                value={authoredByIds}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {currentDistrictUsers?.map(el => (
                  <Select.Option key={el._id} value={el._id}>
                    {`${el.firstName} ${el.lastName}`}
                  </Select.Option>
                ))}
              </Select>
            </ItemBody>
          </Item>
        )}

        <Item>
          <ItemHeader>Tags</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              data-cy="selectTags"
              size="large"
              onChange={onSearchFieldChange("tags")}
              value={tags}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {allTagsData.map(el => (
                <Select.Option key={el._id} value={el._id}>
                  {el.tagName}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
      </Container>
    </MainFilterItems>
  );
};

Search.propTypes = {
  search: PropTypes.object.isRequired,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
  onSearchFieldChange: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  showStatus: PropTypes.bool
};

export default connect(
  (state, { search = {} }) => ({
    allTagsData: getAllTagsSelector(state, "testitem"),
    collections: getCollectionsSelector(state),
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
    userFeatures: getUserFeatures(state),
    districtId: getUserOrgId(state),
    currentDistrictUsers: getCurrentDistrictUsersSelector(state)
  }),
  { getCurrentDistrictUsers: getCurrentDistrictUsersAction }
)(Search);
