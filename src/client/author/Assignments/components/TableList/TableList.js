import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { isEmpty, find, get } from "lodash";
import { Link, withRouter } from "react-router-dom";
import { Dropdown, Tooltip, Spin } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { test as testConstants, roleuser } from "@edulastic/constants";

import { FlexContainer, withWindowSizes, EduButton, CheckboxLabel } from "@edulastic/common";

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
  TypeIcon,
  ExpandDivdier,
  StatusLabel,
  ActionDiv,
  GreyFont,
  ExpandedTable,
  ActionsWrapper,
  TitleCase,
  TimedTestIndicator,
  TypeWrapper,
  IndicatorText
} from "./styled";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import WithDisableMessage from "../../../src/components/common/ToggleDisable";
import { getUserIdSelector, getUserRole, getGroupList } from "../../../src/selectors/user";
import { getAssignmentTestsSelector } from "../../../src/selectors/assignments";
import { ReactComponent as TimerIcon } from "./assets/timer.svg";
import { canEditTest } from "../../utils";

const convertTableData = (data, assignments = [], index, userId) => ({
  name: data.title,
  thumbnail: data.thumbnail,
  key: index.toString(),
  rowIndex: index.toString(),
  testId: data._id,
  class: assignments.length,
  assigned: "",
  status: "status",
  submitted: `${assignments
    .map(item => (item.submittedCount || 0) + (item.gradedCount || 0))
    .reduce((t, c) => t + c, 0) || 0} of ${assignments.map(item => item.totalNumber || 0).reduce((t, c) => t + c, 0)}`,
  graded: `${assignments.map(item => item.gradedCount).reduce((t, c) => t + c, 0) || 0}`,
  action: "",
  classId: assignments[0]?.classId,
  currentAssignment: assignments[0],
  testType: data.testType,
  hasAutoSelectGroups: data.hasAutoSelectGroups,
  assignmentVisibility: assignments.map(
    item => item.testContentVisibility || testConstants.testContentVisibility.ALWAYS
  ),
  canEdit: canEditTest(data, userId),
  hasAdminAssignments: assignments.some(
    item => item.assignedBy.role === roleuser.SCHOOL_ADMIN || item.assignedBy.role === roleuser.DISTRICT_ADMIN
  )
});

const convertExpandTableData = (data, testItem, index) => ({
  name: testItem.title,
  key: index,
  assignmentId: data._id,
  class: data.className,
  assigned: data.assignedBy.name,
  status:
    data.status === "NOT OPEN" && data.startDate && data.startDate < Date.now()
      ? `IN PROGRESS${data.isPaused ? " (PAUSED)" : ""}`
      : `${data.status}${data.isPaused && data.status !== "DONE" ? " (PAUSED)" : ""}`,
  submitted: `${(data.submittedCount || 0) + (data.gradedCount || 0)} of ${data.totalNumber || 0}`,
  graded: data.gradedCount,
  action: "",
  classId: data.classId,
  testType: data.testType,
  timedAssignment: data.timedAssignment && data.allowedTime,
  hasAutoSelectGroups: testItem.hasAutoSelectGroups
});

const TableList = ({
  assignmentsByTestId = {},
  tests = [],
  onOpenReleaseScoreSettings,
  history,
  renderFilter,
  t,
  onSelectRow,
  selectedRows,
  loading,
  toggleEditModal,
  folderData,
  showPreviewModal,
  showFilter,
  windowWidth,
  toggleDeleteModal,
  userId = "",
  status = "",
  assignmentTests,
  togglePrintModal,
  userRole,
  userClassList
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [details, setdetails] = useState(true);
  // Show first three rows opened in every re-render
  useEffect(() => {
    setExpandedRows(["0", "1", "2"]);
  }, []);
  const expandedRowRender = parentData => {
    const columns = [
      {
        title: <CheckboxLabel />,
        dataIndex: "checkbox",
        width: "10%",
        className: "select-row",
        render: () => <GreyFont daya-cy={parentData.testId} style={{ display: "block" }} />
      },
      {
        dataIndex: "class",
        width: "25%",
        render: (text, row) => (
          <GreyFont
            className="class-column"
            onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}
          >
            <Tooltip placement="bottom" title={text}>
              <span data-cy="class">{text}</span>
            </Tooltip>
          </GreyFont>
        )
      },
      {
        dataIndex: "testType",
        width: "14%",
        render: (_, row) => (
          <TypeWrapper onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}>
            {row && row.testType === testConstants.type.PRACTICE ? (
              <TypeIcon data-cy="type" type="p">
                P
              </TypeIcon>
            ) : row.testType === testConstants.type.ASSESSMENT ? (
              <TypeIcon data-cy="type">A</TypeIcon>
            ) : (
              <TypeIcon data-cy="type" type="c">
                C
              </TypeIcon>
            )}
            <TimedTestIndicator data-cy="type" type="p">
              {row.timedAssignment && (
                <Tooltip
                  title={<IndicatorText> Time Limit: {row.timedAssignment / (60 * 1000)} min</IndicatorText>}
                  placement="right"
                >
                  <TimerIcon />
                </Tooltip>
              )}
            </TimedTestIndicator>
          </TypeWrapper>
        )
      },
      {
        dataIndex: "assigned",
        width: "11%",
        render: (text, row) => (
          <Tooltip title={text} placement="top">
            <GreyFont
              data-cy="assigned"
              showEllipsis={text.length > 15}
              onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}
            >
              {text}
            </GreyFont>
          </Tooltip>
        )
      },
      {
        dataIndex: "status",
        width: "14%",
        render: (text, row) =>
          text ? (
            <StatusLabel
              onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}
              data-cy="status"
              status={text}
            >
              {text}
            </StatusLabel>
          ) : (
            ""
          )
      },
      {
        dataIndex: "submitted",
        width: "8%",
        render: (text, row) => (
          <GreyFont
            onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}
            data-cy="submitted"
          >
            {text}
          </GreyFont>
        )
      },
      {
        dataIndex: "graded",
        width: "8%",
        render: (text, row) => (
          <GreyFont
            onClick={() => history.push(`/author/classboard/${row.assignmentId}/${row.classId}`)}
            data-cy="graded"
          >
            {text}
          </GreyFont>
        )
      },
      {
        dataIndex: "action",
        width: "10%",
        render: (_, row) => (
          <ActionsWrapper data-cy="PresentationIcon" data-test={row.assignmentId}>
            <Tooltip placement="bottom" title="Live Class Board">
              <Link data-cy="lcb" to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
                <Icon src={presentationIcon} alt="Images" />
              </Link>
            </Tooltip>
            <FeaturesSwitch inputFeatures="expressGrader" actionOnInaccessible="hidden" groupId={row.classId}>
              <WithDisableMessage
                disabled={row.hasAutoSelectGroups}
                errMessage="This assignment has random items for every student."
              >
                <Tooltip placement="bottom" title="Express Grader">
                  <Link
                    data-cy="eg"
                    to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}
                    disabled={row.hasAutoSelectGroups}
                  >
                    <Icon src={additemsIcon} alt="Images" />
                  </Link>
                </Tooltip>
              </WithDisableMessage>
            </FeaturesSwitch>
            <Tooltip placement="bottom" title="Standard Based Report">
              <Link data-cy="sbr" to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}>
                <Icon src={piechartIcon} alt="Images" />
              </Link>
            </Tooltip>
          </ActionsWrapper>
        )
      }
    ];
    const expandTableList = [];
    let filterData = assignmentsByTestId?.[parentData.testId] || [];
    let getInfo;
    if (status) {
      filterData = filterData.filter(assignment => assignment.status === status);
    }
    filterData.forEach((assignment, index) => {
      if (!assignment.redirect) {
        getInfo = convertExpandTableData(assignment, parentData, index);
        expandTableList.push(getInfo);
      }
    });

    return (
      <ExpandedTable
        data-cy={parentData.testId}
        columns={columns}
        dataSource={expandTableList}
        pagination={false}
        class="expandTable"
      />
    );
  };

  const enableExtend = () => setdetails(false);

  const disableExtend = () => setdetails(true);

  const handleExpandedRowsChange = rowIndex => {
    setExpandedRows(state => {
      if (state.includes(rowIndex)) {
        return state.filter(item => item !== rowIndex);
      }
      return [...state, rowIndex];
    });
  };

  const columns = [
    {
      title: "Assignment Name",
      dataIndex: "name",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.localeCompare(b.name, "en", { ignorePunctuation: true }),
      width: "20%",
      className: "assignment-name",
      render: (text, row) => (
        <Tooltip placement="bottom" title={<div>{text}</div>}>
          <FlexContainer style={{ marginLeft: 0 }} justifyContent="left">
            <div>
              <TestThumbnail src={row.thumbnail} />
            </div>
            <AssignmentTD data-cy="assignmentName" data-test={row.testId} showFilter={showFilter}>
              {text}
            </AssignmentTD>
          </FlexContainer>
        </Tooltip>
      )
    },
    {
      title: "Class",
      dataIndex: "class",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.class - b.class,
      width: "10%",
      render: (text, row) => (
        <ExpandDivdier data-cy="ButtonToShowAllClasses">
          <IconArrowDown
            onclick={() => false}
            src={arrowUpIcon}
            style={{ transform: expandedRows.includes(`${row.key}`) ? "rotate(180deg)" : "" }}
          />
          {text}
        </ExpandDivdier>
      )
    },
    {
      title: "Type",
      dataIndex: "testType",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        // Handling the undefined testtype however All the test should have test type.
        if (!a.testType || !b.testType) return false;
        return a.testType.localeCompare(b.testType);
      },
      width: "14%",
      render: (text = testConstants.type.ASSESSMENT) => <TitleCase data-cy="testType">{text}</TitleCase>
    },
    {
      title: "Assigned by",
      dataIndex: "assigned",
      sortDirections: ["descend", "ascend"],
      width: "11%",
      render: text => <GreyFont data-cy="assignedBy"> {text} </GreyFont>
    },
    {
      title: "Status",
      dataIndex: "status",
      sortDirections: ["descend", "ascend"],
      width: "14%",
      render: () => <GreyFont data-cy="testStatus">{t("common.assigned")} </GreyFont>
    },
    {
      title: "Submitted",
      dataIndex: "submitted",
      sortDirections: ["descend", "ascend"],
      width: "8%",
      render: text => <GreyFont data-cy="testSubmitted"> {text} </GreyFont>
    },
    {
      title: "Graded",
      dataIndex: "graded",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.graded - b.graded,
      width: "8%",
      render: text => <GreyFont data-cy="testGraded"> {text} </GreyFont>
    },
    {
      title: renderFilter(),
      dataIndex: "action",
      width: "10%",
      render: (_, row) => {
        const assignmentTest = assignmentTests.find(at => at._id === row.testId);
        return (
          <ActionDiv onClick={e => e.stopPropagation()}>
            <Dropdown
              overlay={ActionMenu({
                onOpenReleaseScoreSettings,
                currentAssignment: row?.currentAssignment || {},
                history,
                showPreviewModal,
                toggleEditModal,
                toggleDeleteModal,
                row,
                userId,
                assignmentTest,
                togglePrintModal,
                canEdit: row.canEdit && !(row.hasAdminAssignments && userRole === roleuser.TEACHER),
                userClassList
              })}
              placement="bottomRight"
              trigger={["click"]}
            >
              <EduButton height="28px" width="100%" isGhost data-cy="actions">
                ACTIONS
              </EduButton>
            </Dropdown>
          </ActionDiv>
        );
      },
      onCell: () => ({
        onMouseEnter: () => enableExtend(),
        onMouseLeave: () => disableExtend()
      })
    }
  ];

  const getAssignmentsByTestId = Id => (assignmentsByTestId[Id] || []).filter(item => !item.redirect);

  const rowSelection = {
    selectedRowKeys: selectedRows.map(({ key }) => key),
    onChange: (_, rows) => {
      if (onSelectRow) {
        onSelectRow(rows);
      }
    }
  };

  let data = tests.map((testItem, i) => convertTableData(testItem, getAssignmentsByTestId(testItem._id), i, userId));

  if (!isEmpty(folderData)) {
    const { content } = folderData;

    const tempData = [];
    content.forEach(({ _id }) => {
      const temp = find(tests, ({ _id: testId }) => testId === _id);
      if (temp) {
        tempData.push(temp);
      }
    });
    data = tempData.map((testItem, i) => convertTableData(testItem, getAssignmentsByTestId(testItem._id), i, userId));
  }

  if (status) {
    data = data.filter(d => getAssignmentsByTestId(d.testId).find(assignment => assignment.status === status));
  }

  if (loading) {
    return <Spin size="large" />;
  }

  const NoDataMessage = (
    <>
      <p>There are no assignments found for the filter options selected.</p>
      <p>Something Wrong? Check the filters including the school year selected.</p>
    </>
  );

  if (data.length < 1) {
    return (
      <NoDataNotification style={{ width: "auto" }} heading="Assignments not available" description={NoDataMessage} />
    );
  }

  return (
    <Container>
      <TableData
        columns={columns}
        rowSelection={rowSelection}
        expandIconAsCell={false}
        expandIconColumnIndex={-1}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        expandRowByClick={details}
        onRow={record => ({
          onClick: () => handleExpandedRowsChange(record.rowIndex)
        })}
        expandedRowKeys={expandedRows}
        scroll={{ x: windowWidth <= 1023 ? 1023 : false }}
      />
    </Container>
  );
};

TableList.propTypes = {
  assignmentsByTestId: PropTypes.object.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  folderData: PropTypes.object.isRequired,
  onSelectRow: PropTypes.func,
  showPreviewModal: PropTypes.func,
  selectedRows: PropTypes.array.isRequired,
  renderFilter: PropTypes.func,
  history: PropTypes.object,
  tests: PropTypes.array,
  showFilter: PropTypes.bool,
  t: PropTypes.func.isRequired,
  togglePrintModal: PropTypes.func
};

TableList.defaultProps = {
  onOpenReleaseScoreSettings: () => {},
  renderFilter: () => {},
  onSelectRow: () => {},
  showPreviewModal: () => {},
  history: {},
  tests: [],
  showFilter: false,
  togglePrintModal: () => {}
};

const enhance = compose(
  withWindowSizes,
  withRouter,
  withNamespaces("assignmentCard"),
  connect(
    state => ({
      loading: get(state, "author_assignments.loading"),
      folderData: getFolderSelector(state),
      userId: getUserIdSelector(state),
      assignmentTests: getAssignmentTestsSelector(state),
      userRole: getUserRole(state),
      userClassList: getGroupList(state)
    }),
    {}
  )
);

export default enhance(TableList);
