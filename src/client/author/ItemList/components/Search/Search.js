import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { connect } from "react-redux";
import { questionType as questionTypes } from "@edulastic/constants";
import { getFormattedCurriculumsSelector } from "../../../src/selectors/dictionaries";
import { Container, Item, ItemBody, ItemHeader, MainFilterItems, ItemRelative, IconWrapper } from "./styled";
import selectsData from "../../../TestPage/components/common/selectsData";
import StandardsSearchModal from "./StandardsSearchModal";
import { getCollectionsSelector } from "../../../src/selectors/user";
import { test as testsConstants } from "@edulastic/constants";
import { getAllTagsSelector } from "../../../TestPage/ducks";
const Search = ({
  search: {
    grades,
    status,
    tags,
    subject,
    collectionName = "",
    curriculumId,
    standardIds,
    questionType,
    depthOfKnowledge,
    authorDifficulty
  },
  allTagsData,
  onSearchFieldChange,
  curriculumStandards,
  showStatus = false,
  collections,
  formattedCuriculums
}) => {
  const [showModal, setShowModalValue] = useState(false);

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

  const collectionData = [
    ...testsConstants.collectionDefaultFilter,
    ...collections.map(o => ({ text: o.title, value: o._id }))
  ];
  const isStandardsDisabled = !(curriculumStandards.elo && curriculumStandards.elo.length > 0);
  const standardsPlaceholder = isStandardsDisabled ? "Available with Curriculum" : 'Type to Search, for example "k.cc"';
  return (
    <MainFilterItems id="filter-container">
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
            getPopupContainer={() => document.getElementById("filter-container")}
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
              getPopupContainer={() => document.getElementById("filter-container")}
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
              getPopupContainer={() => document.getElementById("filter-container")}
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
            getPopupContainer={() => document.getElementById("filter-container")}
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
              getPopupContainer={() => document.getElementById("filter-container")}
            >
              {questionTypes.selectsData.map(el => (
                <Select.Option key={el.value} value={el.value}>
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
              getPopupContainer={() => document.getElementById("filter-container")}
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
              getPopupContainer={() => document.getElementById("filter-container")}
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
              data-cy="Collections"
              size="large"
              onSelect={onSearchFieldChange("collectionName")}
              value={collectionName}
              getPopupContainer={() => document.getElementById("filter-container")}
            >
              {collectionData.map(el => (
                <Select.Option
                  key={el.value}
                  value={el.value}
                  getPopupContainer={() => document.getElementById("filter-container")}
                >
                  {el.text}
                </Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>

        {showStatus && (
          <Item>
            <ItemHeader>Status</ItemHeader>
            <ItemBody>
              <Select
                data-cy="selectStatus"
                size="large"
                onSelect={onSearchFieldChange("status")}
                value={status}
                getPopupContainer={() => document.getElementById("filter-container")}
              >
                {selectsData.allStatus.map(el => (
                  <Select.Option key={el.value} value={el.value}>
                    {el.text}
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
              getPopupContainer={() => document.getElementById("filter-container")}
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
    formattedCuriculums: getFormattedCurriculumsSelector(state, search)
  }),
  {}
)(Search);
