import React, { Component } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";

import { Link, withRouter } from "react-router-dom";
import { Dropdown, Checkbox, Tooltip } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import { FlexContainer } from "@edulastic/common";

import arrowUpIcon from "../../assets/arrow-up.svg";
import presentationIcon from "../../assets/presentation.svg";
import additemsIcon from "../../assets/add-items.svg";
import piechartIcon from "../../assets/pie-chart.svg";
import ActionMenu from "../ActionMenu/ActionMenu";

import {
  Container,
  Icon,
  TableData,
  TestThumbnail,
  AssignmentTD,
  IconArrowDown,
  BtnAction,
  TypeIcon,
  ExpandDivdier,
  BtnStatus,
  ActionDiv,
  GreyFont,
  ExpandedTable,
  ActionsWrapper,
  TitleCase
} from "./styled";

const convertTableData = (data, assignments, index) => ({
  name: data.title,
  thumbnail: data.thumbnail,
  key: index.toString(),
  testId: data._id,
  class: assignments.length,
  assigned: "",
  status: "status",
  submitted: `${assignments.map(item => item.submittedCount).reduce((t, c) => t + c) || 0} of ${assignments
    .map(item => item.totalNumber)
    .reduce((t, c) => t + c) || 0}`,
  graded: `${assignments.map(item => item.gradedCount).reduce((t, c) => t + c) || 0}`,
  action: "",
  classId: assignments[0].classId,
  currentAssignment: assignments[0],
  testType: data.testType
});

const convertExpandTableData = (data, testItem, index) => ({
  name: testItem.title,
  key: index,
  assignmentId: data._id,
  class: data.className,
  assigned: data.assignedBy.name,
  status: data.status,
  submitted: `${data.submittedCount || 0} of ${data.totalNumber || 0}`,
  graded: data.gradedCount,
  action: "",
  classId: data.classId,
  testType: data.testType
});

class TableList extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  };

  state = {
    details: true
  };

  expandedRowRender = parentData => {
    const columns = [
      {
        dataIndex: "name",
        width: "22%",
        render: () => <GreyFont style={{ width: "253px", display: "block" }} />
      },
      {
        dataIndex: "class",
        width: "11%",
        render: text => (
          <Tooltip placement="bottom" title={<div>{text}</div>}>
            <GreyFont>{text}</GreyFont>
          </Tooltip>
        )
      },
      {
        dataIndex: "testType",
        width: "11%",
        render: (_, row) =>
          row && row.testType === test.type.PRACTICE ? <TypeIcon type="practice">P</TypeIcon> : <TypeIcon>A</TypeIcon>
      },
      {
        dataIndex: "assigned",
        width: "15%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "status",
        width: "12%",
        render: text => (text ? <BtnStatus status={text}>{text}</BtnStatus> : "")
      },
      {
        dataIndex: "submitted",
        width: "16%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "graded",
        width: "14%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "action",
        width: "14%",
        render: (_, row) => (
          <ActionsWrapper data-cy="PresentationIcon">
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

    const { assignmentsByTestId } = this.props;
    const expandTableList = [];
    let getInfo;
    assignmentsByTestId[parentData.testId].forEach((assignment, index) => {
      if (!assignment.redirect) {
        getInfo = convertExpandTableData(assignment, parentData, index);
        expandTableList.push(getInfo);
      }
    });

    return <ExpandedTable columns={columns} dataSource={expandTableList} pagination={false} class="expandTable" />;
  };

  enableExtend = () => this.setState({ details: false });

  disableExtend = () => this.setState({ details: true });

  render() {
    const {
      assignmentsByTestId = {},
      tests = [],
      onOpenReleaseScoreSettings,
      history,
      renderFilter,
      t,
      onSelectRow
    } = this.props;
    const { details } = this.state;
    const columns = [
      {
        title: <Checkbox />,
        dataIndex: "checkbox",
        width: "5%",
        className: "select-row",
        render: (_, row) => <Checkbox onChange={e => onSelectRow(row, e.target.checked)} />,
        onCell: () => ({
          onMouseEnter: () => this.enableExtend(),
          onMouseLeave: () => this.disableExtend()
        })
      },
      {
        title: "Assignment Name",
        dataIndex: "name",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "22%",
        className: "assignment-name",
        render: (text, row) => (
          <FlexContainer style={{ marginLeft: 0 }}>
            <div>
              <TestThumbnail src={row.thumbnail} />
            </div>
            <AssignmentTD>{text}</AssignmentTD>
          </FlexContainer>
        )
      },
      {
        title: "Class",
        dataIndex: "class",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "11%",
        render: text => (
          <ExpandDivdier data-cy="ButtonToShowAllClasses">
            <IconArrowDown onclick={() => false} src={arrowUpIcon} />
            {text}
          </ExpandDivdier>
        )
      },
      {
        title: "Type",
        dataIndex: "testType",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "11%",
        render: (text = test.type.ASSESSMENT) => <TitleCase>{text}</TitleCase>
      },
      {
        title: "Assigned by",
        dataIndex: "assigned",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "15%",
        render: text => <div> {text} </div>
      },
      {
        title: "Status",
        dataIndex: "status",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "12%",
        render: () => <div>{t("common.assigned")} </div>
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
        width: "14%",
        render: text => <div> {text} </div>
      },
      {
        title: renderFilter(),
        dataIndex: "action",
        width: "14%",
        render: (_, row) => (
          <ActionDiv>
            <Dropdown
              overlay={ActionMenu(onOpenReleaseScoreSettings, row.currentAssignment, history)}
              placement="bottomCenter"
              trigger={["click"]}
              onClick={e => e.stopPropagation()}
            >
              <BtnAction>ACTIONS</BtnAction>
            </Dropdown>
          </ActionDiv>
        ),
        onCell: () => ({
          onMouseEnter: () => this.enableExtend(),
          onMouseLeave: () => this.disableExtend()
        })
      }
    ];

    const getAssignmentsByTestId = Id => assignmentsByTestId[Id].filter(item => !item.redirect);

    return (
      <Container>
        <TableData
          columns={columns}
          expandIconAsCell={false}
          expandIconColumnIndex={-1}
          expandedRowRender={this.expandedRowRender}
          dataSource={tests.map((testItem, i) => convertTableData(testItem, getAssignmentsByTestId(testItem._id), i))}
          expandRowByClick={details}
          defaultExpandedRowKeys={["0", "1", "2"]}
        />
      </Container>
    );
  }
}

TableList.propTypes = {
  assignmentsByTestId: PropTypes.object.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  onSelectRow: PropTypes.func,
  renderFilter: PropTypes.func,
  history: PropTypes.object,
  tests: PropTypes.array
};

TableList.defaultProps = {
  onOpenReleaseScoreSettings: () => {},
  renderFilter: () => {},
  onSelectRow: () => {},
  history: {},
  tests: []
};

const enhance = compose(
  withRouter,
  withNamespaces("assignmentCard")
);

export default enhance(TableList);
