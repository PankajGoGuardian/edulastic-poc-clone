import React from "react";
import moment from "moment";

// components
import { StyledTable, StyledTableCell } from "./styled";

// constants
import { STATUS_LIST } from "../transformers";

const GradebookTable = ({ data, assessments, selectedRows, setSelectedRows, windowHeight }) => {
  const columns = [
    {
      title: "Student",
      key: "_id",
      dataIndex: "studentName",
      fixed: "left",
      width: 170,
      sorter: (a, b) => a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase()),
      defaultSortOrder: "descend"
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
      key: "laDate",
      dataIndex: "laDate",
      width: 190,
      render: data => (data ? moment(data).format("MMM Do, YYYY h:mm A") : "-"),
      sorter: (a, b) => (a.laDate || 0) - (b.laDate || 0)
    },
    ...assessments.map(ass => ({
      title: ass.name,
      key: ass.id,
      align: "center",
      width: 170,
      render: (_, row) => {
        const { status, percentScore } = row.assessments[ass.id] || {};
        const color = STATUS_LIST.find(s => s.name === status)?.color;
        return <StyledTableCell color={color}>{percentScore || "-"}</StyledTableCell>;
      },
      sorter: (a, b) =>
        (a.assessments[ass.id]?.percentScore || "-").localeCompare(b.assessments[ass.id]?.percentScore || "-")
    }))
  ];
  return (
    <StyledTable
      rowKey={row => row._id}
      columns={columns}
      dataSource={data}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: setSelectedRows
      }}
      pagination={false}
      scroll={{ x: "100%", y: windowHeight - 250 }}
    />
  );
};

export default GradebookTable;
