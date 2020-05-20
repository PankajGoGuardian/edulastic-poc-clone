import React from "react";
import moment from "moment";

// components
import { Tooltip } from "antd";
import { StyledTable, StyledTableCell } from "./styled";

// constants
import { STATUS_LIST } from "../transformers";
import { extraDesktopWidthMax } from "@edulastic/colors";

const GradebookTable = ({ data, assessments, selectedRows, setSelectedRows, windowWidth, windowHeight }) => {
  const colWidth = windowWidth >= parseInt(extraDesktopWidthMax) ? 170 : 150;
  const columns = [
    {
      title: "Student",
      key: "_id",
      dataIndex: "studentName",
      fixed: "left",
      width: colWidth + 40,
      render: data => <Tooltip title={data}>{data}</Tooltip>,
      sorter: (a, b) => a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase()),
      defaultSortOrder: "descend"
    },
    {
      title: "Class Name",
      key: "className",
      dataIndex: "className",
      width: colWidth + 80,
      render: data => <Tooltip title={data}>{data}</Tooltip>,
      sorter: (a, b) => a.className.toLowerCase().localeCompare(b.className.toLowerCase())
    },
    {
      title: "Last Activity Date",
      key: "laDate",
      dataIndex: "laDate",
      width: colWidth + 20,
      render: data => (data ? moment(data).format("MMM Do, YYYY h:mm A") : "-"),
      sorter: (a, b) => (a.laDate || 0) - (b.laDate || 0)
    },
    ...assessments.map(ass => ({
      title: ass.name,
      key: ass.id,
      align: "center",
      width: colWidth,
      render: (_, row) => {
        const { status, percentScore } = row.assessments[ass.id] || {};
        const color = STATUS_LIST.find(s => s.id === status)?.color;
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
