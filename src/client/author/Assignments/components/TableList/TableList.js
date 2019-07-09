import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { isEmpty, find } from "lodash";
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
import { getFolderSelector } from "../../../src/selectors/folder";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

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
    .map(item => item.totalNumber || 0)
    .reduce((t, c) => t + c)}`,
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
  status: data.status === "NOT OPEN" && data.startDate && data.startDate < Date.now() ? "IN PROGRESS" : data.status,
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
        title: <Checkbox />,
        dataIndex: "checkbox",
        width: "3%",
        className: "select-row",
        render: () => <GreyFont style={{ display: "block" }} />
      },
      {
        dataIndex: "name",
        width: "20%",
        render: () => <GreyFont style={{ width: "253px", display: "block" }} />
      },
      {
        dataIndex: "class",
        width: "14%",
        render: text => (
          <Tooltip placement="bottom" title={<div>{text}</div>}>
            <GreyFont className="class-column">{text}</GreyFont>
          </Tooltip>
        )
      },
      {
        dataIndex: "testType",
        width: "10%",
        render: (_, row) =>
          row && row.testType === test.type.PRACTICE ? (
            <TypeIcon type="practice">P</TypeIcon>
          ) : row.testType === test.type.ASSESSMENT ? (
            <TypeIcon>A</TypeIcon>
          ) : (
            <TypeIcon>C</TypeIcon>
          )
      },
      {
        dataIndex: "assigned",
        width: "10%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "status",
        width: "10%",
        render: text => (text ? <BtnStatus status={text}>{text}</BtnStatus> : "")
      },
      {
        dataIndex: "submitted",
        width: "10%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "graded",
        width: "13%",
        render: text => <GreyFont>{text}</GreyFont>
      },
      {
        dataIndex: "action",
        width: "10%",
        render: (_, row) => (
          <ActionsWrapper data-cy="PresentationIcon">
            <Tooltip placement="bottom" title="LCB">
              <Link to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
                <Icon src={presentationIcon} alt="Images" />
              </Link>
            </Tooltip>
            <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" groupId={row.classId}>
              <Tooltip placement="bottom" title="Express Grader">
                <Link to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}>
                  <Icon src={additemsIcon} alt="Images" />
                </Link>
              </Tooltip>
            </FeaturesSwitch>
            <FeaturesSwitch inputFeatures="standardBasedReport" actionOnInaccessible="hidden" groupId={row.classId}>
              <Tooltip placement="bottom" title="Reports">
                <Link to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}>
                  <Icon src={piechartIcon} alt="Images" />
                </Link>
              </Tooltip>
            </FeaturesSwitch>
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
      onSelectRow,
      selectedRows,
      folderData,
      showPreviewModal
    } = this.props;

    const { details } = this.state;
    const columns = [
      {
        title: "Assignment Name",
        dataIndex: "name",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.name.localeCompare(b.name, "fr", { ignorePunctuation: true }),
        width: "20%",
        className: "assignment-name",
        render: (text, row) => (
          <Tooltip placement="bottom" title={<div>{text}</div>}>
            <FlexContainer style={{ marginLeft: 0 }}>
              <div>
                <TestThumbnail src={row.thumbnail} />
              </div>
              <AssignmentTD>{text}</AssignmentTD>
            </FlexContainer>
          </Tooltip>
        )
      },
      {
        title: "Class",
        dataIndex: "class",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.class - b.class,
        width: "14%",
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
        sorter: (a, b) => a.testType.localeCompare(b.testType),
        width: "10%",
        render: (text = test.type.ASSESSMENT) => <TitleCase>{text}</TitleCase>
      },
      {
        title: "Assigned by",
        dataIndex: "assigned",
        sortDirections: ["descend", "ascend"],
        width: "10%",
        render: text => <GreyFont> {text} </GreyFont>
      },
      {
        title: "Status",
        dataIndex: "status",
        sortDirections: ["descend", "ascend"],
        width: "10%",
        render: () => <GreyFont>{t("common.assigned")} </GreyFont>
      },
      {
        title: "Submitted",
        dataIndex: "submitted",
        sortDirections: ["descend", "ascend"],
        width: "10%",
        render: text => <GreyFont> {text} </GreyFont>
      },
      {
        title: "Graded",
        dataIndex: "graded",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.graded - b.graded,
        width: "13%",
        render: text => <GreyFont> {text} </GreyFont>
      },
      {
        title: renderFilter(),
        dataIndex: "action",
        width: "10%",
        render: (_, row) => (
          <ActionDiv>
            <Dropdown
              overlay={ActionMenu(onOpenReleaseScoreSettings, row.currentAssignment, history, showPreviewModal)}
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

    const rowSelection = {
      selectedRowKeys: selectedRows.map(({ key }) => key),
      onChange: (_, rows) => {
        if (onSelectRow) {
          onSelectRow(rows);
        }
      }
    };

    let data = tests.map((testItem, i) => convertTableData(testItem, getAssignmentsByTestId(testItem._id), i));

    if (!isEmpty(folderData)) {
      const { content } = folderData;

      const tempData = [];
      content.forEach(({ _id }) => {
        const temp = find(data, ({ testId }) => testId === _id);
        if (temp) {
          tempData.push(temp);
        }
      });
      data = tempData;
    }

    return (
      <Container>
        <TableData
          columns={columns}
          rowSelection={rowSelection}
          expandIconAsCell={false}
          expandIconColumnIndex={-1}
          expandedRowRender={this.expandedRowRender}
          dataSource={data}
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
  folderData: PropTypes.object.isRequired,
  onSelectRow: PropTypes.func,
  selectedRows: PropTypes.array.isRequired,
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
  withNamespaces("assignmentCard"),
  connect(
    state => ({
      folderData: getFolderSelector(state)
    }),
    {}
  )
);

export default enhance(TableList);
