import React, { memo } from "react";
import PropTypes from "prop-types";
import { tabletWidth } from "@edulastic/colors";
import { Table } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { withWindowSizes } from "@edulastic/common";

import styled from "styled-components";
import { getTestItemAuthorName, getQuestionType } from "../../../../dataUtils";
import MainInfoCell from "./MainInfoCell";
import MetaInfoCell from "./MetaInfoCell";
import { getStandardsSelector } from "../../Review/ducks";
import { previewShowAnswerAction, previewCheckAnswerAction } from "../../../ducks";

const ItemsTable = ({
  items,
  setSelectedTests,
  selectedTests,
  onAddItems,
  standards,
  windowWidth,
  testId,
  search,
  gotoSummary,
  previewItem,
  setPreviewModalData
}) => {
  const columnProps = {
    setSelectedTests,
    selectedTests,
    onAddItems,
    windowWidth,
    search,
    testId,
    gotoSummary,
    setPreviewModalData
  };

  const columns = [
    {
      title: "Main info",
      dataIndex: "main",
      key: "main",
      width: "30%",
      render: data => <MainInfoCell data={data} previewItem={previewItem} />
    },
    {
      title: "Meta info",
      dataIndex: "meta",
      key: "meta",
      render: data => <MetaInfoCell data={data} itemTableView={true} {...columnProps} />
    }
  ];

  const mobileColumns = [
    {
      title: "Meta info",
      dataIndex: "meta",
      key: "meta",
      render: data => <MetaInfoCell data={data} itemTableView={true} {...columnProps} />
    }
  ];

  const data = items.map(item => {
    const stimulus =
      item.data && item.data.questions && item.data.questions[0] && item.data.questions[0].stimulus
        ? item.data.questions[0].stimulus
        : "Click here to view the question detail.";
    const main = {
      title: item._id,
      id: item._id,
      stimulus,
      item
    };
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
    const audio = {};
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
      audio.ttsSuccess = ttsSuccess;
    }
    const meta = {
      id: item._id,
      shortId: item._id && item._id.substring(18),
      title: item._id,
      by: getTestItemAuthorName(item),
      shared: "9578 (1)",
      likes: 9,
      type: getQuestionType(item),
      standards: standards[item._id],
      stimulus,
      isPremium: !!item.collectionName,
      item,
      audio,
      dok:
        item.data && item.data.questions && (item.data.questions.find(e => e.depthOfKnowledge) || {}).depthOfKnowledge
    };

    return {
      key: item._id,
      main,
      meta
    };
  });

  return (
    <TableWrapper
      columns={windowWidth > 993 ? columns : mobileColumns}
      dataSource={data}
      showHeader={false}
      pagination={false}
    />
  );
};

ItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  setSelectedTests: PropTypes.func.isRequired,
  onAddItems: PropTypes.func.isRequired,
  selectedTests: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
  showModal: PropTypes.bool,
  addDuplicate: PropTypes.func,
  standards: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withWindowSizes,
  connect(
    state => ({
      standards: getStandardsSelector(state)
    }),
    null
  )
);

export default enhance(ItemsTable);

const TableWrapper = styled(Table)`
  .ant-table-tbody > tr > td {
    padding: 25px;
    width: 250px;
    max-width: 250px;
  }

  table tr tr img {
    max-height: 100%;
    max-width: 100%;
  }

  @media (max-width: ${tabletWidth}) {
    .ant-table-tbody > tr > td {
      padding: 28px;
    }
  }
`;
