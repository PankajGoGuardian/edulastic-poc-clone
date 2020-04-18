import React from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import * as moment from "moment";
import NoDataNotification from "../../common/components/NoDataNotification";
import { getIsloadingAssignmentSelector } from "../TestPage/components/Assign/ducks";
import { StyledTable } from "./styled";

const formatDate = date => moment(date).format("MM-DD-YYYY");

const tbleColumns = [
  {
    title: "Class/Group Name",
    dataIndex: "className",
    width: "25%"
  },
  {
    title: "Assigned By",
    dataIndex: "assigned",
    width: "25%"
  },
  {
    title: "Open Policy",
    dataIndex: "openPolicy",
    width: "14%"
  },
  {
    title: "Close Policy",
    dataIndex: "closePolicy",
    width: "14%"
  },
  {
    title: "Open Date",
    dataIndex: "openDate",
    render: formatDate,
    width: "11%"
  },
  {
    title: "Close Date",
    dataIndex: "closeDate",
    render: formatDate,
    width: "11%"
  }
];

const AssignmentsTable = ({ assignments, isAssignmentsLoading }) => {
  const assignmentsSpreadByClass = assignments.flatMap(assignment =>
    assignment.class.map(_clazz => ({
      ...assignment,
      assignmentId: assignment._id,
      classId: _clazz._id,
      className: _clazz.name,
      class: _clazz
    }))
  );
  const tableData = assignmentsSpreadByClass.map(item => ({
    key: `${item.assignmentId}_${item.classId}`,
    _id: item._id,
    class: item.class,
    students: item.students,
    openPolicy: item.openPolicy || "",
    closePolicy: item.closePolicy || "",
    openDate: item.startDate,
    closeDate: item.endDate,
    assigned: item.assignedBy.name,
    className: item.className
  }));
  if (isAssignmentsLoading) {
    <Spin />;
  }
  if (!tableData.length) {
    return (
      <NoDataNotification heading="Assignments not available" description="There are no active assignments found." />
    );
  }
  return <StyledTable columns={tbleColumns} dataSource={tableData} pagination={false} bordered />;
};

export default connect(state => ({
  assignments: state.authorTestAssignments.assignments,
  isAssignmentsLoading: getIsloadingAssignmentSelector(state)
}))(AssignmentsTable);
