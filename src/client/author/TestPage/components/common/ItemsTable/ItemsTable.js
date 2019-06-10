import React, { memo } from "react";
import PropTypes from "prop-types";
import { tabletWidth } from "@edulastic/colors";
import { Table } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { withWindowSizes } from "@edulastic/common";

import styled from "styled-components";
import { getTestItemAuthorName } from "../../../../dataUtils";
import MainInfoCell from "./MainInfoCell";
import MetaInfoCell from "./MetaInfoCell";
import { getItemsTypesSelector, getStandardsSelector } from "../../Review/ducks";

const ItemsTable = ({
  items,
  types,
  setSelectedTests,
  selectedTests,
  onAddItems,
  standards,
  windowWidth,
  testId,
  search,
  gotoSummary
}) => {
  const columnProps = {
    setSelectedTests,
    selectedTests,
    onAddItems,
    windowWidth,
    search,
    testId,
    gotoSummary
  };

  const columns = [
    {
      title: "Main info",
      dataIndex: "main",
      key: "main",
      width: "30%",
      render: data => <MainInfoCell testId={testId} data={data} />
    },
    {
      title: "Meta info",
      dataIndex: "meta",
      key: "meta",
      render: data => <MetaInfoCell data={data} {...columnProps} />
    }
  ];

  const mobileColumns = [
    {
      title: "Meta info",
      dataIndex: "meta",
      key: "meta",
      render: data => <MetaInfoCell data={data} {...columnProps} />
    }
  ];

  const data = items.map(item => {
    const stimulus =
      item.data && item.data.questions && item.data.questions[0] && item.data.questions[0].stimulus
        ? item.data.questions[0].stimulus
        : item._id;
    const main = {
      title: item._id,
      id: item._id,
      stimulus,
      item
    };
    const meta = {
      id: item._id,
      title: item._id,
      by: getTestItemAuthorName(item),
      shared: "9578 (1)",
      likes: 9,
      types: types[item._id],
      standards: standards[item._id],
      stimulus,
      item
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
  types: PropTypes.object.isRequired,
  setSelectedTests: PropTypes.func.isRequired,
  onAddItems: PropTypes.func.isRequired,
  selectedTests: PropTypes.array.isRequired,
  standards: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withWindowSizes,
  connect(state => ({
    types: getItemsTypesSelector(state),
    standards: getStandardsSelector(state)
  }))
);

export default enhance(ItemsTable);

const TableWrapper = styled(Table)`
  .ant-table-tbody > tr > td {
    padding: 38px 6px 28px 26px;
  }

  @media (max-width: ${tabletWidth}) {
    .ant-table-tbody > tr > td {
      padding: 28px;
    }
  }
`;
