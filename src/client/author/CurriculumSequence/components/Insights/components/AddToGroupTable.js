import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Row, Col, Table, Menu, Dropdown, Button, Checkbox, Icon } from "antd";
import { map, round } from "lodash";
import { IconBarChart } from "@edulastic/icons";
import { themeColor, greyThemeDark1 } from "@edulastic/colors";
import TrendArrow from "../assets/TrendArrow";
import { calcArrowPosition } from "../transformers";
// import { getCommonGroups } from "../transformers";
// TODO: iff. transformer to fetch the checked groups is required
// else remove the entire logic for checkedGroups

const handleAddGroupChange = (groupId, checkedGroups, selectedStudents) => {
  /* TODO: fire an api request */
};

const getMenuItems = (groups, onChange, checkedGroups) => (
  <Menu>
    {map(groups, ({ id, name }) => (
      <Menu.Item key={id}>
        <Checkbox
          // checked={checkedGroups.includes(id)}
          onChange={() => onChange(id)}
        >
          {name}
        </Checkbox>
      </Menu.Item>
    ))}
  </Menu>
);

const GroupsDropdown = ({ groups, onChange, checkedGroups }) => (
  <DropdownContainer>
    <Dropdown overlay={getMenuItems(groups, onChange, checkedGroups)}>
      <StyledButton>
        ADD TO GROUP <Icon type="down" />
      </StyledButton>
    </Dropdown>
  </DropdownContainer>
);

const getColumns = (groupsData, handleAddGroupChange, checkedGroups) => [
  {
    title: "SELECT ALL",
    key: "name",
    dataIndex: "name"
  },
  {
    title: <GroupsDropdown groups={groupsData} onChange={handleAddGroupChange} checkedGroups={checkedGroups} />,
    colSpan: 3,
    key: "percentScore",
    dataIndex: "percentScore",
    render: (data, record) => `${round(data * 100)}%`
  },
  {
    title: "TrendAngle",
    colSpan: 0,
    key: "trendAngle",
    dataIndex: "trendAngle",
    render: (data, record) => {
      const [cx, cy] = calcArrowPosition(data);
      return (
        record.isHighlighted && (
          <svg height="26px" width="26px">
            {record.hasTrend ? (
              <TrendArrow cx={cx} cy={cy} trendAngle={data} color={record.color} transformOrigin="center" />
            ) : (
              <circle cx="50%" cy="calc(50% + 1px)" r={3} fill={record.color} />
            )}
          </svg>
        )
      );
    }
  },
  {
    title: "Reports",
    colSpan: 0,
    key: "studentId",
    dataIndex: "studentId",
    render: (data, record) => (
      /* TODO: Link for individual student reports */
      <Link to="/author">
        <IconBarChart width={24} height={21} />
      </Link>
    )
  }
];

const AddToGroupTable = ({ studData, groupsData, highlighted }) => {
  const [selectedRowKeys, onSelectChange] = useState([]);
  const checkedStudents = studData.filter((item, index) => selectedRowKeys.includes(index + 1));
  const checkedGroups = []; /* getCommonGroups(checkedStudents) */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  // merge studData with highlighted
  studData.forEach(item => {
    if (highlighted.ids?.includes(item.studentId)) {
      item.isHighlighted = true;
      item.color = highlighted.color;
    }
  });

  return (
    <Col span={24}>
      <StyledTable
        rowSelection={rowSelection}
        columns={getColumns(groupsData, groupId => handleAddGroupChange(groupId, checkedStudents), checkedGroups)}
        dataSource={studData}
        pagination={false}
      />
    </Col>
  );
};

export default AddToGroupTable;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  min-width: 100%;
  height: 35px;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: 11px/15px Open Sans;
  font-weight: 600;
  color: ${themeColor};
  svg {
    fill: ${themeColor};
  }
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            padding: 16px 10px;
            border-bottom: unset;
            background: white;
            white-space: nowrap;
            font: 11px/15px Open Sans;
            font-weight: 600;
            color: ${themeColor};
            .ant-table-column-sorters {
              .ant-table-column-sorter {
                .ant-table-column-sorter-inner {
                  .ant-icon {
                    font-size: 10px;
                  }
                }
              }
            }
          }
          th:last-child {
            padding: 0px;
            .ant-table-header-column {
              width: 100%;
            }
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 10px 10px 5px 10px;
            height: 40px;
            color: ${greyThemeDark1};
            font: 11px/15px Open Sans;
            white-space: nowrap;
            background-color: white;
            font-weight: 600;
            word-break: break-all;
            svg {
              fill: ${themeColor};
            }
          }
          td:nth-child(2) {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        ${props => {
          let styledRows = "";
          props.dataSource.map((item, index) => {
            if (item.isHighlighted) {
              styledRows += `
                tr:nth-child(${index + 1}) {
                  td {
                    background-color: ${"#e4f7e6"};
                  }
                }
              `;
            }
          });
          return styledRows;
        }}
      }
    }
  }
`;
