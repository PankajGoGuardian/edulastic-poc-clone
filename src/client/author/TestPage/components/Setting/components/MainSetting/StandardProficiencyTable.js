import React, { useState, useEffect } from "react";
import { Table, Select } from "antd";
import { connect } from "react-redux";
import { get } from "lodash";
import { Title } from "./styled";
import { white, themeColor } from "@edulastic/colors";
import styled from "styled-components";

const StandardProficiencyTable = ({ standardsData, setSettingsData, standardGradingScale = {}, disabled = false }) => {
  const handleProfileChange = val => {
    const selectedStandardData = standardsData.find(o => o._id === val) || standardsData[0] || { scale: [] };
    setSettingsData({ _id: selectedStandardData._id, name: selectedStandardData.name });
  };

  const selectedStandardData = standardsData.find(o => o._id === standardGradingScale._id) ||
    standardsData[0] || { scale: [] };
  const standardsProficiency = selectedStandardData.scale.map(item => ({ ...item, key: item._id }));
  const columns = [
    {
      title: "Score",
      dataIndex: "score",
      width: "25%",
      key: "score",
      render: (text, record) => {
        return (
          <NameColumn>
            <StyledBox color={record.color} /> <StyleTextWrapper>{text}</StyleTextWrapper>
          </NameColumn>
        );
      }
    },
    {
      title: "Mastery Level",
      dataIndex: "masteryLevel",
      width: "25%",
      key: "masteryLevel",
      className: "mastery-level-column"
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      width: "25%",
      key: "shortName"
    },
    {
      title: "Performance Threshold",
      dataIndex: "threshold",
      width: "25%",
      key: "threshold"
    }
  ];

  return (
    <>
      <Title style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span>Standard based grading scale</span>
        <Select
          disabled={disabled}
          style={{ width: "150px" }}
          value={selectedStandardData._id}
          onChange={val => handleProfileChange(val)}
        >
          {standardsData.map(standardData => {
            return (
              <Select.Option key={standardData._id} value={standardData._id}>
                {standardData.name}
              </Select.Option>
            );
          })}
        </Select>
      </Title>
      <StyledTable dataSource={standardsProficiency} columns={columns} pagination={false} />
    </>
  );
};

export default connect(
  state => ({
    standardsData: get(state, ["standardsProficiencyReducer", "data"], [])
  }),
  null
)(StandardProficiencyTable);

export const StyledTable = styled(Table)`
  margin-left: ${({ isAdvanced }) => (isAdvanced ? "20px" : "0px")};
  .ant-table {
    color: #434b5d;
    font-size: 12px;
    font-weight: 600;

    .ant-table-thead > tr > th {
      border-bottom: 0px;
      color: #aaafb5;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      font-size: ${({ isAdvanced }) => (isAdvanced ? "10px" : "12px")};
      padding: 8px;
      &.mastery-level-column {
        text-align: left;
      }
    }
    .ant-table-tbody > tr > td {
      border-bottom: 15px;
      border-bottom-color: ${white};
      border-bottom-style: solid;
      background: #f8f8f8;
      text-align: center;
      padding: 8px;

      &.mastery-level-column {
        text-align: left;
      }
    }
  }
`;

const NameColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBox = styled.span`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  border: 1px solid ${themeColor};
`;
const StyleTextWrapper = styled.span`
  margin-left: 10px;
`;
