import React from "react";
import styled from "styled-components";

// components
import { Table } from "antd";
import { withWindowSizes } from "@edulastic/common";

// constants
import { lightGrey11, greyThemeDark1 } from "@edulastic/colors";

const GradebookTable = ({ data, assessments, selectedRows, setSelectedRows, windowHeight }) => {
  const columns = [
    {
      title: "Student",
      key: "studentId",
      dataIndex: "studentName",
      fixed: "left",
      width: 170,
      sorter: (a, b) => a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    },
    {
      title: "Class Name",
      key: "className",
      dataIndex: "className",
      width: 170,
      sorter: (a, b) => a.className.toLowerCase().localeCompare(b.className.toLowerCase())
    },
    {
      title: "Last Activity Date",
      key: "lastActivityDate",
      dataIndex: "lastActivityDate",
      width: 180,
      sorter: () => {}
    },
    ...assessments.map(ass => ({
      title: ass.name,
      key: ass.id,
      align: "center",
      width: 170,
      render: (_, row) => (
        <StyledDiv color="#FDE0E9">{row.assessments.find(d => d.name === ass.name).score}%</StyledDiv>
      ),
      sorter: (a, b) =>
        a.assessments.find(d => d.name === ass.name).score > b.assessments.find(d => d.name === ass.name).score
    }))
  ];
  return (
    <StyledTable
      minHeight={windowHeight - 170}
      columns={columns}
      dataSource={data}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: setSelectedRows
      }}
      pagination={{ pageSizeOptions: [10, 20, 30, 40, 50] }}
      scroll={{ x: "100%" }}
    />
  );
};

export default withWindowSizes(GradebookTable);

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  background-color: ${props => props.color};
  height: 40px;
  width: 100%;
`;

export const StyledTable = styled(Table)`
  .ant-table {
    .ant-table-content {
      .ant-table-body {
        min-height: auto;
        table {
          border: none;
          .ant-table-thead {
            tr {
              background: white;
              th {
                border: none;
                background: white;
                padding: 5px 10px 20px 10px;
                .ant-table-column-title {
                  white-space: nowrap;
                  font-size: 12px;
                  line-height: 17px;
                  font-weight: 700;
                  color: ${lightGrey11};
                  text-transform: uppercase;
                }
              }
            }
          }
          .ant-table-tbody {
            border-collapse: collapse;
            tr {
              cursor: pointer;
              height: 45px;
              td {
                height: 40px;
                padding: 5px 10px;
                font-size: 14px;
                line-height: 19px;
                font-weight: 600;
                color: ${greyThemeDark1};
              }
              td:nth-child(n + 5) {
                padding: 0px;
              }
            }
          }
        }
      }
      .ant-table-placeholder {
        border: none;
      }
      .ant-table-fixed {
        .ant-table-thead {
          tr {
            background: white;
            th {
              border: none;
              background: white;
              padding: 5px 10px 20px 10px;
              .ant-table-column-title {
                white-space: nowrap;
                font-size: 12px;
                line-height: 17px;
                font-weight: 700;
                color: ${lightGrey11};
                text-transform: uppercase;
              }
            }
          }
        }
        .ant-table-tbody {
          border-collapse: collapse;
          tr {
            cursor: pointer;
            height: 45px;
            td {
              height: 40px;
              padding: 5px 10px;
              font-size: 14px;
              line-height: 19px;
              font-weight: 600;
              color: ${greyThemeDark1};
            }
          }
        }
      }
    }
  }
`;
