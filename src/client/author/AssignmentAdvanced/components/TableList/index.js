import React, { Component } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";

import { Link, withRouter } from "react-router-dom";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import presentationIcon from "../../assets/presentation.svg";
import additemsIcon from "../../assets/add-items.svg";
import piechartIcon from "../../assets/pie-chart.svg";

import { Container, Icon, TableData, TypeIcon, BtnStatus, ActionsWrapper } from "./styled";

const columns = [
  {
    title: "Class",
    dataIndex: "class",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "16%",
    render: text => <div>{text}</div>
  },
  {
    title: "Type",
    dataIndex: "type",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "8%",
    render: (text = test.type.ASSESSMENT) => <TypeIcon>{text.charAt(0)}</TypeIcon>
  },
  {
    title: "Assigned by",
    dataIndex: "assigned",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "Status",
    dataIndex: "status",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "16%",
    render: text => (text ? <BtnStatus status={text}>{text}</BtnStatus> : "")
  },
  {
    title: "Submitted",
    dataIndex: "submitted",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "Graded",
    dataIndex: "graded",
    sortDirections: ["descend", "ascend"],
    sorter: true,
    width: "16%",
    render: text => <div> {text} </div>
  },
  {
    title: "",
    dataIndex: "action",
    width: "5%",
    render: (_, row) => (
      <ActionsWrapper>
        <Link to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
          <Icon src={presentationIcon} alt="Images" />
        </Link>
        <Link to="/author/expressgrader">
          <Icon src={additemsIcon} alt="Images" />
        </Link>
        <Link to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}>
          <Icon src={piechartIcon} alt="Images" />
        </Link>
      </ActionsWrapper>
    )
  }
];
class TableList extends Component {
  static propTypes = {};

  convertRowData = (data, index) => ({
    class: data.name,
    type: data.testType,
    status: data.status,
    assigned: data.assignedBy.name,
    submitted: `${data.inGradingNumber}/${data.assignedCount}`,
    graded: data.gradedNumber,
    action: "",
    assignmentId: data.assignmentId,
    classId: data.classId,
    key: index
  });

  render() {
    const { classList } = this.props;
    const rowData = classList.map((data, index) => this.convertRowData(data, index));
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
