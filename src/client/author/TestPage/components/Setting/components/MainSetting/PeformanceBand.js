import React, { useEffect } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { Table, Checkbox, Icon } from "antd";
import styled, { css } from "styled-components";
import { white, blue } from "@edulastic/colors";
import { setTestDataAction, getTestEntitySelector } from "../../../../ducks";
import { receivePerformanceBandAction } from "../../../../../PerformanceBand/ducks";
import { getUserOrgId } from "../../../../../src/selectors/user";

const PerformanceBands = ({ setTestData, entity, fetchPerformanceBand, userOrgId, performanceBandData }) => {
  const { performanceBandsData = performanceBandData } = entity;

  useEffect(() => {
    fetchPerformanceBand({ orgId: userOrgId });
  }, []);

  const handleIsAbove = (isChecked, index) => {
    const newPerformanceBands = [...performanceBandsData];
    newPerformanceBands[index].aboveOrAtStandard = !isChecked;
    setTestData({
      performanceBands: newPerformanceBands
    });
  };

  const onPerformanceBandChange = (index, dir) => {
    let { to } = performanceBandsData[index];
    const previousBandTo = index ? performanceBandsData[index - 1].to : 100;
    if (dir === "decrease" && to > performanceBandsData[index + 1].to + 1) {
      to--;
    } else if (dir === "increase" && to < previousBandTo) {
      to++;
    } else {
      return;
    }
    const newPerformanceBands = [...performanceBandsData];
    newPerformanceBands[index].to = newPerformanceBands[index + 1].from = to;
    setTestData({
      performanceBandsData: newPerformanceBands
    });
  };

  const columns = [
    {
      title: "Performance Bands",
      dataIndex: "name",
      width: "35%",
      key: "name"
    },
    {
      title: "ABOVE OR AT STANDARD",
      dataIndex: "aboveOrAtStandard",
      width: "25%",
      key: "aboveOrAtStandard",
      render: (value, _, index) => <Checkbox checked={value} onClick={() => handleIsAbove(value, index)} />
    },
    {
      title: "FROM",
      dataIndex: "from",
      width: "15%",
      key: "from",
      render: text => <span>{`${text}%`}</span>
    },
    {
      title: "TO",
      width: "25%",
      key: "to",
      dataIndex: "to",
      className: "action-wrapper",
      render: (text, row, index) => {
        const nextBandTo = index ? performanceBandsData[index - 1].to : 100;
        const previousBandTo = index < performanceBandsData.length - 1 ? performanceBandsData[index + 1].to : 0;
        const disableDecrease = row.to === 0 || previousBandTo + 1 === row.to;
        const disableIncrease = row.to === 0 || row.to === 100 || nextBandTo === row.to + 1;
        return (
          <div>
            <ChangeValueBtns
              type="minus-circle"
              disabled={disableDecrease}
              onClick={() => !disableDecrease && onPerformanceBandChange(index, "decrease")}
            />
            {`${text}%`}
            <ChangeValueBtns
              type="plus-circle"
              disabled={disableIncrease}
              onClick={() => !disableIncrease && onPerformanceBandChange(index, "increase")}
            />
          </div>
        );
      }
    }
  ];
  return <StyledTable columns={columns} dataSource={performanceBandsData} pagination={false} />;
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state),
    performanceBandData: get(state, ["performanceBandReducer", "data", "performanceBand"], []),
    userOrgId: getUserOrgId(state)
  }),
  {
    setTestData: setTestDataAction,
    fetchPerformanceBand: receivePerformanceBandAction
  }
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

      &:first-child {
        font-size: ${({ isAdvanced }) => (isAdvanced ? "14px" : "20px")};
        font-weight: bold;
        text-transform: unset;
        color: #434b5d;
        text-align: left;
        padding-left: 20px;
      }
    }
    .ant-table-tbody > tr > td {
      border-bottom: 15px;
      border-bottom-color: ${white};
      border-bottom-style: solid;
      background: #f8f8f8;
      text-align: center;
      padding: 8px;

      &:first-child {
        text-align: left;
        padding-left: 20px;
      }
      &.action-wrapper {
        div {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
  }
`;

const Disabled = css`
  cursor: not-allowed;
  pointer-events: none;
  color: grey;
  border: grey;
  svg {
    fill: grey;
  }
`;

const ChangeValueBtns = styled(Icon)`
  svg {
    fill: ${blue};
    font-size: 18px;
  }
  &.anticon[tabindex] {
    ${props => props.disabled && Disabled};
  }
`;
