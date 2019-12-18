import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { ReviewTableWrapper } from "./styled";

import MainInfoCell from "./MainInfoCell/MainInfoCell";
import MetaInfoCell from "./MetaInfoCell/MetaInfoCell";
import { getStandardsSelector } from "../../ducks";
import { getQuestionType } from "../../../../../dataUtils";
import { SortableItem } from "../List/List";
import { helpers } from "@edulastic/common";

const ItemsTable = ({
  items,
  mobile,
  standards,
  questions,
  scoring = {},
  rows,
  selected,
  setSelected,
  handlePreview,
  isEditable,
  owner,
  onChangePoints,
  isCollapse,
  passagesKeyed = {},
  gradingRubricsFeature
}) => {
  const [expandedRows, setExpandedRows] = useState(-1);
  const handleCheckboxChange = (index, checked) => {
    if (checked) {
      setSelected([...selected, index]);
    } else {
      const newSelected = selected.filter(item => item !== index);
      setSelected(newSelected);
    }
  };
  const columns = [
    {
      title: "Main info",
      dataIndex: "data",
      key: "main",
      render: data =>
        expandedRows === data.key ? (
          <SortableItem
            key={data.key}
            metaInfoData={data.meta}
            index={data.key}
            owner={owner}
            indx={data.key}
            isEditable={isEditable}
            item={rows[data.key]}
            testItem={data.meta.item}
            points={data.main.points}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            onPreview={handlePreview}
            selected={selected}
            collapseView={true}
            questions={questions}
            mobile={mobile}
            passagesKeyed={passagesKeyed}
            isScoringDisabled={data.main.isScoringDisabled}
          />
        ) : (
          <>
            <MainInfoCell
              data={data.main}
              handlePreview={handlePreview}
              isEditable={isEditable}
              owner={owner}
              index={data.key}
              setExpandedRows={setExpandedRows}
              onChangePoints={onChangePoints}
              isCollapse={isCollapse}
              isScoringDisabled={data.main.isScoringDisabled}
            />
            <MetaInfoCell data={data.meta} />
          </>
        )
    }
  ];

  const audioStatus = item => {
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
    const audio = {};
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
      audio.ttsSuccess = ttsSuccess;
    }
    return audio;
  };

  const data = items.map((item, i) => {
    const isScoringDisabled = !!item.data.questions.find(q => q.rubrics) && gradingRubricsFeature;
    const main = {
      id: item._id,
      points: scoring[item._id] || helpers.getPoints(item),
      title: item._id,
      isScoringDisabled
    };

    const meta = {
      id: item._id,
      by: get(item, ["createdBy", "name"], ""),
      shared: 0,
      likes: 0,
      type: getQuestionType(item),
      points: scoring[item._id] || helpers.getPoints(item),
      item,
      isPremium: !!item.collectionName,
      standards: standards[item._id],
      audio: audioStatus(item),
      dok:
        item.data && item.data.questions && (item.data.questions.find(e => e.depthOfKnowledge) || {}).depthOfKnowledge
    };

    if (item.data && item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].stimulus;
    }

    return {
      data: {
        key: i,
        main,
        meta
      }
    };
  });

  const rowSelection = {
    onChange: selectedRowKeys => {
      setSelected(selectedRowKeys);
    },
    selectedRowKeys: selected
  };
  return (
    <ReviewTableWrapper
      rowSelection={isEditable ? rowSelection : ""}
      columns={columns}
      dataSource={data}
      showHeader={false}
      pagination={false}
    />
  );
};

ItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  types: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  handlePreview: PropTypes.func,
  standards: PropTypes.object.isRequired,
  gradingRubricsFeature: PropTypes.bool
};

const enhance = compose(
  memo,
  connect(state => ({
    standards: getStandardsSelector(state)
  }))
);

export default enhance(ItemsTable);
