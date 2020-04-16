import React, { useState } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import * as moment from "moment";

import { StyledTable } from "./styled";
import NoDataNotification from "../../common/components/NoDataNotification";
import { getIsloadingAssignmentSelector } from "../TestPage/components/Assign/ducks";

const formatDate = date => moment(date).format("MM-DD-YYYY");

const tbleColumns = [
  {
    title: "Class/Group Name",
    dataIndex: "classes",
    render: classes => (
      <div>
        {classes.map((_class, i) => (
          <span>
            {_class.name}
            {classes.length > 1 && i < classes.length - 1 && ", "}
          </span>
        ))}
      </div>
    )
  },
  {
    title: "Assigned By",
    dataIndex: "assigned"
  },
  {
    title: "Open Policy",
    dataIndex: "openPolicy"
  },
  {
    title: "Close Policy",
    dataIndex: "closePolicy"
  },
  {
    title: "Open Date",
    dataIndex: "openDate",
    render: formatDate
  },
  {
    title: "Close Date",
    dataIndex: "closeDate",
    render: formatDate
  }
];

const AssignmentsTable = ({
  assignments,
  handleSettingsChange,
  regradeType,
  regradeSettings,
  isAssignmentsLoading
}) => {
  const [list, setNewList] = useState(regradeSettings.assignmentList);
  const rowSelection = {
    selectedRowKeys: regradeType == "SPECIFIC" ? list : [],
    onChange: (selectedRowKeys, selectedRows) => {
      const assignmentList = selectedRows.map(item => item._id);
      handleSettingsChange("assignmentList", assignmentList);
      setNewList(assignmentList);
    },
    getCheckboxProps: () => ({
      disabled: regradeType !== "SPECIFIC"
    })
  };
  const tableData = assignments
    .filter(item => !item.archived)
    .map(item => ({
      key: item._id,
      _id: item._id,
      class: item.class,
      students: item.students,
      openPolicy: item.openPolicy || "",
      closePolicy: item.closePolicy || "",
      openDate: item.startDate,
      closeDate: item.endDate,
      assigned: item.assignedBy.name,
      classes: item.class
    }));
  if (isAssignmentsLoading) {
    <Spin />;
  }
  if (!tableData.length) {
    return (
      <NoDataNotification heading="Assignments not available" description="There are no active assignments found." />
    );
  }
  return <StyledTable rowSelection={rowSelection} columns={tbleColumns} dataSource={tableData} />;
};

export default connect(state => ({
  isAssignmentsLoading: getIsloadingAssignmentSelector(state)
}))(AssignmentsTable);
