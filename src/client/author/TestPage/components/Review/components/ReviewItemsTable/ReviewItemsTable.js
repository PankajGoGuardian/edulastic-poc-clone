import React, { memo } from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import MainInfoCell from "./MainInfoCell/MainInfoCell";
import MetaInfoCell from "./MetaInfoCell/MetaInfoCell";
import { getItemsTypesSelector, getStandardsSelector } from "../../ducks";

const ItemsTable = ({ items, types, standards, selected, setSelected, handlePreview }) => {
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
      render: data => <MetaInfoCell data={data} />
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
    const main = {
      id: item._id,
      title: item._id
    };
    const meta = {
      id: item._id,
      by: item.createdBy.name,
      shared: "9578 (1)",
      likes: 9,
      types: types[item._id],
      standards: standards[item._id],
      audio: audioStatus(item)
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
    <Table rowSelection={rowSelection} columns={columns} dataSource={data} showHeader={false} pagination={false} />
  );
};

ItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  types: PropTypes.object.isRequired,
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
