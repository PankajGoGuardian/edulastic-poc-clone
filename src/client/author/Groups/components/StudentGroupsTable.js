import React from "react";

import { Tooltip } from "antd";
import { themeColor } from "@edulastic/colors";
import { IconPencilEdit, IconTrash } from "@edulastic/icons";
import { StyledTable, StyledTableButton } from "../../../common/styled";

const StudentGroupsTable = ({
  t,
  data,
  selectedRows,
  setSelectedRows,
  showActive,
  handleEditGroup,
  handleShowGroup,
  setArchiveModalProps
}) => {
  // prevent button click to propagate to row click
  const safeClick = func => e => {
    e.preventDefault();
    e.stopPropagation();
    func();
  };
  const columns = [
    {
      title: t("group.name"),
      dataIndex: "name",
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    },
    {
      title: t("group.students"),
      dataIndex: "studentCount",
      align: "center",
      sorter: (a, b) => a.studentCount - b.studentCount
    },
    {
      dataIndex: "_id",
      align: "right",
      render: (_, { _id, name }) => (
        <div style={{ whiteSpace: "nowrap", padding: "0 10px" }}>
          {showActive && (
            <StyledTableButton onClick={safeClick(() => handleEditGroup(_id))} title="Edit">
              <Tooltip title="Edit">
                <IconPencilEdit color={themeColor} />
              </Tooltip>
            </StyledTableButton>
          )}
          {showActive ? (
            <StyledTableButton
              title="Archive"
              onClick={safeClick(() => setArchiveModalProps({ visible: true, _id, name }))}
            >
              <Tooltip title="Archive">
                <IconTrash color={themeColor} />
              </Tooltip>
            </StyledTableButton>
          ) : (
            <StyledTableButton title="Unarchive" onClick={safeClick(() => setArchiveModalProps({ visible: true, _id, name }))}>
              UNARCHIVE
            </StyledTableButton>
          )}
        </div>
      )
    }
  ];

  return (
    <StyledTable
      rowKey={record => record._id}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: setSelectedRows
      }}
      dataSource={data}
      columns={columns}
      onRow={({ _id }) => ({
        onClick: () => handleShowGroup(_id)
      })}
    />
  );
};

export default StudentGroupsTable;
