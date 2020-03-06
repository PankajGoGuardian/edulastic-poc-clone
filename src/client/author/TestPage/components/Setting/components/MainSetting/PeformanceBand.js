import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Checkbox, Select } from "antd";
import styled from "styled-components";
import { white, themeColor } from "@edulastic/colors";
import { performanceBandSelector } from "../../../../../AssignTest/duck";
import { Title } from "./styled";
import { EduCheckBox } from "@edulastic/common";

const PerformanceBands = ({ performanceBandsData, setSettingsData, performanceBand = {}, disabled = false }) => {
  const handleProfileChange = val => {
    const selectedBandsData = performanceBandsData.find(o => o._id === val);
    setSettingsData({ _id: selectedBandsData._id, name: selectedBandsData.name });
  };

  const selectedBandsData = performanceBandsData.find(o => o._id === performanceBand._id) ||
    performanceBandsData[0] || { performanceBand: [] };
  const performanceBands = selectedBandsData.performanceBand;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      className: "name",
      render: (text, record) => {
        return (
          <NameColumn>
            <StyledBox color={record.color} /> <StyleTextWrapper>{text}</StyleTextWrapper>
          </NameColumn>
        );
      }
    },
    {
      title: "ABOVE OR AT STANDARD",
      dataIndex: "aboveOrAtStandard",
      width: "25%",
      key: "aboveOrAtStandard",
      render: value => <EduCheckBox disabled checked={value} />
    },
    {
      title: "FROM",
      dataIndex: "from",
      width: "25%",
      key: "from",
      render: text => <span>{`${text}%`}</span>
    },
    {
      title: "TO",
      width: "25%",
      key: "to",
      dataIndex: "to",
      render: text => <span>{`${text}%`}</span>
    }
  ];
  return (
    <>
      <Title style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span>Performance Bands</span>
        <Select
          style={{ width: "250px" }}
          value={selectedBandsData._id}
          onChange={val => handleProfileChange(val)}
          disabled={disabled}
        >
          {performanceBandsData.map(bandsData => {
            return (
              <Select.Option key={bandsData._id} value={bandsData._id}>
                {bandsData.name}
              </Select.Option>
            );
          })}
        </Select>
      </Title>
      {performanceBands && !!performanceBands.length && (
        <StyledTable dataSource={performanceBands} columns={columns} pagination={false} />
      )}
    </>
  );
};

export default connect(
  state => ({
    performanceBandsData: performanceBandSelector(state)
  }),
  null
)(PerformanceBands);

export const StyledTable = styled(Table)`
  margin-left: ${({ isAdvanced }) => (isAdvanced ? "20px" : "0px")};
  .ant-table {
    color: #434b5d;
    font-size: 12px;
    font-weight: 600;

    .ant-table-thead > tr > th {
      border-bottom: 0px;
      background: ${white};
      color: #aaafb5;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      font-size: ${({ isAdvanced }) => (isAdvanced ? "10px" : "12px")};
      padding: 8px;
      &.name {
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
      &.name {
        text-align: left;
      }
    }
  }
`;

const NameColumn = styled.div`
  display: flex;
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
