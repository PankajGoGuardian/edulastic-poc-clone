import { themeColor } from "@edulastic/colors";
import { SelectInputStyled } from "@edulastic/common";
import { Select } from "antd";
import { get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { StyledTable, Title } from "./styled";

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
      className: "score-column",
      align: "left",
      render: (text, record) => (
        <NameColumn>
          <StyledBox color={record.color} /> <StyleTextWrapper>{text}</StyleTextWrapper>
        </NameColumn>
      )
    },
    {
      title: "Mastery Level",
      dataIndex: "masteryLevel",
      width: "25%",
      key: "masteryLevel",
      align: "left",
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
        <SelectInputStyled
          style={{ width: "250px" }}
          value={selectedStandardData._id}
          onChange={val => handleProfileChange(val)}
          disabled={disabled}
        >
          {standardsData.map(standardData => (
            <Select.Option key={standardData._id} value={standardData._id}>
              {standardData.name}
            </Select.Option>
          ))}
        </SelectInputStyled>
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

const NameColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
