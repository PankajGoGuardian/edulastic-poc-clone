import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Tooltip } from "antd";
import { Link, withRouter } from "react-router-dom";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";
import presentationIcon from "../../assets/presentation.svg";
import additemsIcon from "../../assets/add-items.svg";
import piechartIcon from "../../assets/pie-chart.svg";

import { Container, Icon, TableData, TypeIcon, BtnStatus, ActionsWrapper } from "./styled";

export const testTypeToolTip = {
  assessment: "Class Assessment",
  "common assessment": "Common Assessment",
  practice: "Practice Assessment"
};

const columns = [
  {
    title: "Class",
    dataIndex: "class",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.class.localeCompare(b.class, "en", { ignorePunctuation: true }),
    width: "16%",
    render: text => <div>{text}</div>
  },
  {
    title: "Type",
    dataIndex: "type",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.type.localeCompare(b.type, "en", { ignorePunctuation: true }),
    width: "8%",
    render: (text = test.type.ASSESSMENT) => (
      <Tooltip placement="bottom" title={testTypeToolTip[text]}>
        <TypeIcon type={text.charAt(0)}>{text.charAt(0)}</TypeIcon>
      </Tooltip>
    )
  },
  {
    title: "Assigned by",
    dataIndex: "assigned",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.assigned.localeCompare(b.assigned, "en", { ignorePunctuation: true }),
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "Status",
    dataIndex: "status",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.status.localeCompare(b.status, "en", { ignorePunctuation: true }),
    width: "16%",
    render: text => (text ? <BtnStatus status={text}>{text}</BtnStatus> : "")
  },
  {
    title: "Submitted",
    dataIndex: "submitted",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => parseInt(a.submitted.split("/")[0]) - parseInt(b.submitted.split("/")[0]),
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "Graded",
    dataIndex: "graded",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.graded - b.graded,
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "",
    dataIndex: "action",
    width: "5%",
    render: (_, row) => (
      <ActionsWrapper data-cy="PresentationIcon">
        <Tooltip placement="bottom" title="Live Class Board">
          <Link to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
            <Icon src={presentationIcon} alt="Images" />
          </Link>
        </Tooltip>
        <Tooltip placement="bottom" title="Express Grader">
          <Link to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}>
            <Icon src={additemsIcon} alt="Images" />
          </Link>
        </Tooltip>
        <Tooltip placement="bottom" title="Reports">
          <Link to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}>
            <Icon src={piechartIcon} alt="Images" />
          </Link>
        </Tooltip>
      </ActionsWrapper>
    )
  }
];
class TableList extends Component {
  static propTypes = {};

  convertRowData = (data, index) => ({
    class: data.name,
    type: data.testType,
    status: data.isPaused && data.status !== "DONE" ? `${data.status} (PAUSED)` : data.status,
    assigned: data.assignedBy.name,
    submitted: `${data.inGradingNumber + data.gradedNumber}/${data.assignedCount}`,
    graded: data.gradedNumber,
    action: "",
    assignmentId: data.assignmentId,
    classId: data._id,
    key: index
  });

  render() {
    const { classList, filterStatus } = this.props;
    const rowData = classList
      .filter(o => (filterStatus ? o.status === filterStatus : true))
      .map((data, index) => this.convertRowData(data, index));
    const showPagination = rowData.length > 10;

    return (
      <Container>
        <TableData columns={columns} dataSource={rowData} pagination={showPagination} />
      </Container>
    );
  }
}

TableList.propTypes = {
  classList: PropTypes.array.isRequired
};

const enhance = compose(
  withRouter,
  withNamespaces("assignmentCard")
);

export default enhance(TableList);
