import React, { memo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { ReviewTableWrapper } from "./styled";

import MainInfoCell from "./MainInfoCell/MainInfoCell";
import MetaInfoCell from "./MetaInfoCell/MetaInfoCell";
import { getItemsTypesSelector, getStandardsSelector } from "../../ducks";

const ItemsTable = ({ items, types, standards, selected, setSelected, handlePreview, isEditable }) => {
  const columns = [
    {
      title: "Main info",
      dataIndex: "main",
      key: "main",
      render: data => <MainInfoCell data={data} handlePreview={handlePreview} />
    },
    {
      title: "Meta info",
      dataIndex: "meta",
      key: "meta",
      render: data => <MetaInfoCell data={data} itemTableView={false} />
    }
  ];
  const getPoints = item => {
    if (!item) {
      return 0;
    }
    if (item.itemLevelScoring) {
      return item.itemLevelScore;
    }

    return get(item, ["data", "questions"], []).reduce(
      (acc, q) => acc + (q.scoringDisabled ? 0 : get(q, ["validation", "valid_response", "score"], 0)),
      0
    );
  };
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

  const getQuestionTypes = item => {
    return get(item, ["data", "questions"], []).reduce((acc, q) => {
      acc.push(q.title);
      return acc;
    }, []);
  };

  const data = items.map((item, i) => {
    const main = {
      id: item._id,
      title: item._id
    };

    const meta = {
      id: item._id,
      by: get(item, ["createdBy", "name"], ""),
      shared: "9578 (1)",
      likes: 9,
      types: getQuestionTypes(item),
      points: getPoints(item),
      standards: standards[item._id],
      audio: audioStatus(item),
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
  standards: PropTypes.object.isRequired
};

const enhance = compose(
  memo,
  connect(state => ({
    types: getItemsTypesSelector(state),
    standards: getStandardsSelector(state)
  }))
);

export default enhance(ItemsTable);
