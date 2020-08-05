import React from "react";
import { Spin } from "antd";
import { get } from "lodash";
import { helpers } from "@edulastic/common";
import SortableList from "./SortableList";
import { getQuestionType } from "../../../../../dataUtils";
import { StyledSpinnerContainer } from "./styled";
import { isPremiumContent } from "../../../../utils";

const ReviewItems = ({
  items,
  itemGroups,
  standards,
  userFeatures,
  isEditable,
  isCollapse,
  passagesKeyed,
  isSmallSize,
  rows,
  scoring,
  owner,
  onChangePoints,
  handlePreview,
  removeTestItem,
  moveTestItems,
  setSelected,
  selected,
  questions,
  getContainer,
  isPublishers,
  isFetchingAutoselectItems = false,
  userRole,
  isPowerPremiumAccount,
  showGroupsPanel
}) => {
  const container = getContainer();
  if (!container) return null;

  const audioStatus = item => {
    const _questions = get(item, "data.questions", []);
    const getAllTTS = _questions.filter(ite => ite.tts).map(ite => ite.tts);
    const audio = {};
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(ite => ite.taskStatus !== "COMPLETED").length === 0;
      audio.ttsSuccess = ttsSuccess;
    }
    return audio;
  };

  const data = items.map((item, i) => {
    const isScoringDisabled =
      (!!item?.data?.questions?.find(q => q.rubrics) && userFeatures.gradingrubrics) ||
      item.autoselectedItem ||
      item.isLimitedDeliveryType;

    const main = {
      id: item._id,
      points: item.isLimitedDeliveryType ? 1 : scoring[item._id] || helpers.getPoints(item),
      title: item._id,
      isScoringDisabled,
      groupId: item.groupId
    };

    const meta = {
      id: item._id,
      by: get(item, ["createdBy", "name"], ""),
      analytics: item?.analytics || [],
      type: getQuestionType(item),
      points: scoring[item._id] || helpers.getPoints(item),
      item,
      isPremium: isPremiumContent(item?.collections || []),
      standards: standards[item._id],
      audio: audioStatus(item),
      tags: item.tags,
      dok:
        item.data && item.data.questions && (item.data.questions.find(e => e.depthOfKnowledge) || {}).depthOfKnowledge
    };

    if (item.data && item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].stimulus;
    }

    return {
      key: i,
      main,
      meta
    };
  });

  const handleCheckboxChange = (index, checked) => {
    if (checked) {
      setSelected([...selected, index]);
    } else {
      const newSelected = selected.filter(item => item !== index);
      setSelected(newSelected);
    }
  };

  return (
    <>
      <SortableList
        items={data}
        useDragHandle
        passagesKeyed={passagesKeyed}
        onChangePoints={onChangePoints}
        handlePreview={handlePreview}
        isEditable={isEditable}
        isCollapse={isCollapse}
        mobile={!isSmallSize}
        owner={owner}
        onSortEnd={moveTestItems}
        lockToContainerEdges
        lockOffset={["10%", "10%"]}
        onSelect={handleCheckboxChange}
        selected={selected}
        questions={questions}
        rows={rows}
        removeItem={removeTestItem}
        getContainer={getContainer}
        itemGroups={itemGroups}
        isPublishers={isPublishers}
        userRole={userRole}
        isPowerPremiumAccount={isPowerPremiumAccount}
        showGroupsPanel={showGroupsPanel}
      />

      {isFetchingAutoselectItems && (
        <StyledSpinnerContainer>
          <Spin />
        </StyledSpinnerContainer>
      )}
    </>
  );
};

export default ReviewItems;
