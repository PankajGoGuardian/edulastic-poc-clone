import React, { useMemo } from "react";
import { connect } from "react-redux";
import { Tag, Popover } from "antd";
import styled, { css } from "styled-components";
import { test as testsConstants, questionType as questionTypes } from "@edulastic/constants";
import { curriculumsByIdSelector, standardsSelector } from "../../../src/selectors/dictionaries";
import { getCollectionsSelector } from "../../../src/selectors/user";
import { getAllTagsSelector } from "../../../TestPage/ducks";
import selectsData from "../../../TestPage/components/common/selectsData";

const gradeKeys = { O: "Other", K: "Kindergarten", o: "Other", k: "Kindergarten" };
const filtersTagToBeShown = [
  "grades",
  "subject",
  "curriculumId",
  "standardIds",
  "questionType",
  "depthOfKnowledge",
  "authorDifficulty",
  "collections",
  "status",
  "tags"
];

const allStatus = [...selectsData.allStatus, ...selectsData.extraStatus];

const HeaderFilter = ({ handleCloseFilter, search, curriculumById, standardsList, collectionsList, allTagsData }) => {
  const { curriculumId, standardIds = [], collections = [], tags = [] } = search;
  const curriculum = curriculumById[curriculumId];
  const selectedStandards = useMemo(() => standardsList.elo.filter(s => standardIds.includes(s._id)), [
    standardsList,
    standardIds
  ]);
  const selectedCollection = useMemo(
    () =>
      [
        ...testsConstants.collectionDefaultFilter.filter(c => c.value),
        ...collectionsList.map(o => ({ text: o.name, value: o._id }))
      ].filter(c => collections.includes(c.value)),
    [collections, collectionsList]
  );
  const selectedTags = useMemo(() => allTagsData.filter(t => tags.includes(t._id)), [allTagsData, tags]);

  const handleCloseTag = (e, type, value) => {
    e.preventDefault();
    if (value === undefined) {
      handleCloseFilter(type, "");
    }

    if (value) {
      const arr = search[type];
      handleCloseFilter(type, arr.filter(a => a !== value));
    }
  };

  const getPopOverContent = (data, type) => {
    const [first, ...remainingData] = data;
    return remainingData.map(d => {
      if (type === "grades")
        return (
          <StyledPopupTag closable onClose={e => handleCloseTag(e, type, d)}>
            {["O", "K", "o", "k"].includes(d) ? gradeKeys[d] : `Grade ${d}`}
          </StyledPopupTag>
        );
      if (type === "standardIds") {
        return (
          <StyledPopupTag closable onClose={e => handleCloseTag(e, type, d._id)}>
            {d.identifier}
          </StyledPopupTag>
        );
      }
      if (type === "collections") {
        return (
          <StyledPopupTag closable onClose={e => handleCloseTag(e, type, d.value)}>
            {d.text}
          </StyledPopupTag>
        );
      }
      if (type === "tags") {
        return (
          <StyledPopupTag closable onClose={e => handleCloseTag(e, type, d._id)}>
            {d.tagName}
          </StyledPopupTag>
        );
      }
      return null;
    });
  };

  const getTags = (data, type) => {
    if (type === "grades" && data.length) {
      return (
        <>
          <Tag closable onClose={e => handleCloseTag(e, type, data[0])}>
            {["O", "K", "o", "k"].includes(data[0]) ? gradeKeys[data[0]] : `Grade ${data[0]}`}
          </Tag>
          {data.length > 1 && (
            <Popover placement="bottom" content={<>{getPopOverContent(data, type)}</>}>
              <Tag>{`+${data.length - 1}`}</Tag>
            </Popover>
          )}
        </>
      );
    }
    if (type === "standardIds" && selectedStandards.length) {
      return (
        <>
          <Tag closable onClose={e => handleCloseTag(e, type, selectedStandards[0]._id)}>
            {selectedStandards[0].identifier}
          </Tag>
          {selectedStandards.length > 1 && (
            <Popover placement="bottom" content={<>{getPopOverContent(selectedStandards, type)}</>}>
              <Tag>{`+${selectedStandards.length - 1}`}</Tag>
            </Popover>
          )}
        </>
      );
    }
    if (type === "collections" && selectedCollection.length) {
      return (
        <>
          <Tag closable onClose={e => handleCloseTag(e, type, selectedCollection[0].value)}>
            {selectedCollection[0].text}
          </Tag>
          {selectedCollection.length > 1 && (
            <Popover placement="bottom" content={<>{getPopOverContent(selectedCollection, type)}</>}>
              <Tag>{`+${selectedCollection.length - 1}`}</Tag>
            </Popover>
          )}
        </>
      );
    }
    if (type === "tags" && selectedTags.length) {
      return (
        <>
          <Tag closable onClose={e => handleCloseTag(e, type, selectedTags[0]._id)}>
            {selectedTags[0].tagName}
          </Tag>
          {selectedTags.length > 1 && (
            <Popover placement="bottom" content={<>{getPopOverContent(selectedTags, type)}</>}>
              <Tag>{`+${selectedTags.length - 1}`}</Tag>
            </Popover>
          )}
        </>
      );
    }
    if (type === "curriculumId") {
      if (curriculum?._id)
        return (
          <Tag closable onClose={e => handleCloseTag(e, type)}>
            {curriculum.curriculum}
          </Tag>
        );
      return null;
    }
    if (typeof data === "string" && data?.length) {
      let label = data;
      if (type === "questionType") {
        label = questionTypes.selectsData.find(q => q.value === data)?.text;
      }
      if (type === "status") {
        label = allStatus.find(s => s.value === data)?.text;
      }
      return (
        <Tag closable onClose={e => handleCloseTag(e, type)}>
          {label}
        </Tag>
      );
    }
    return null;
  };

  const getFilters = () => {
    const arr = [];
    for (let i = 0; i < filtersTagToBeShown.length; i++) {
      const filterType = filtersTagToBeShown[i];
      const value = search[filterType];
      if (value?.length || typeof value === "number") {
        arr.push(<>{getTags(value, filterType)}</>);
      }
    }
    return arr;
  };

  return <FiltersWrapper>{getFilters()}</FiltersWrapper>;
};

export default connect((state, ownProps) => ({
  curriculumById: curriculumsByIdSelector(state),
  standardsList: standardsSelector(state),
  collectionsList: getCollectionsSelector(state),
  allTagsData: getAllTagsSelector(state, ownProps.type)
}))(HeaderFilter);

const TagsStyle = css`
  color: #686f75;
  background: #bac3ca;
  padding: 2px 10px;
  border: none;
  font-weight: bold;
  border-radius: 6px;
  margin-bottom: 5px;
`;

const StyledPopupTag = styled(Tag)`
  ${TagsStyle};
`;

export const FiltersWrapper = styled.div`
  display: flex;
  justify-self: center;
  margin-right: auto;
  margin-left: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
  .ant-tag {
    ${TagsStyle};
  }
`;
