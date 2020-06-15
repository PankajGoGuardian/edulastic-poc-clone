import { EduButton, FlexContainer } from "@edulastic/common";
import { test } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { Dropdown, Spin, Tooltip } from "antd";
import produce from "immer";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import { receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";
import { getAssignmentsSummary, getAssignmentTestsSelector } from "../../../src/selectors/assignments";
import { getUserIdSelector, getUserRole } from "../../../src/selectors/user";
import { canEditTest } from "../../utils";
import ActionMenu from "../ActionMenu/ActionMenu";
import { ActionDiv, AssignmentTD, Container, TableData, TestThumbnail, TypeIcon, TypeWrapper } from "./styled";

class AdvancedTable extends Component {
  state = {
    enableRowClick: true,
    perPage: 20,
    current: 1,
    sort: {},
    columns: [
      {
        title: "ASSIGNMENT NAME",
        dataIndex: "title",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "38%",
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 0) }),
        className: "assignment-name",
        render: (text, row) => (
          <Tooltip placement="bottom" title={<div>{text}</div>}>
            <FlexContainer style={{ marginLeft: 0, justifyContent: "unset" }}>
              <div>
                <TestThumbnail src={row.thumbnail} />
              </div>
              <AssignmentTD>{text}</AssignmentTD>
            </FlexContainer>
          </Tooltip>
        )
      },
      {
        title: "Type",
        dataIndex: "testType",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        width: "6%",
        align: "left",
        className: "assignment-name",
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 1) }),
        render: (_, row) => (
          <TypeWrapper width="100%" float="none" justify="center">
            {row && row.testType === test.type.PRACTICE ? (
              <TypeIcon data-cy="type" type="p">
                P
              </TypeIcon>
            ) : row.testType === test.type.ASSESSMENT ? (
              <TypeIcon data-cy="type">A</TypeIcon>
            ) : (
              <TypeIcon data-cy="type" type="c">
                C
              </TypeIcon>
            )}
          </TypeWrapper>
        )
      },
      {
        title: "Classes",
        dataIndex: "total",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 2) }),
        width: "8%",
        render: text => <div>{text}</div>
      },
      {
        title: "Not Open",
        dataIndex: "notStarted",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 3) }),
        width: "8%",
        render: text => <div> {text} </div>
      },
      {
        title: "In Progress",
        dataIndex: "inProgress",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 4) }),
        width: "8%",
        render: text => <div>{text} </div>
      },
      {
        title: "In Grading",
        dataIndex: "inGrading",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 5) }),
        width: "8%",
        render: text => <div> {text} </div>
      },
      {
        title: "Done",
        dataIndex: "graded",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => ({ onClick: () => this.handleSort(col, 6) }),

        width: "6%",
        render: text => <div> {text} </div>
      },
      {
        title: "",
        dataIndex: "action",
        width: "12%",
        render: (_, row) => {
          const {
            onOpenReleaseScoreSettings,
            history,
            showPreviewModal,
            toggleEditModal,
            toggleDeleteModal,
            userId = "",
            userRole = "",
            assignmentTests,
            togglePrintModal
          } = this.props;
          const canEdit = canEditTest(row, userId);
          const assignmentTest = assignmentTests.find(at => at._id === row.testId);
          return (
            <ActionDiv data-cy="testActions">
              <Dropdown
                data-cy="actionDropDown"
                overlay={ActionMenu({
                  onOpenReleaseScoreSettings,
                  row,
                  history,
                  showPreviewModal,
                  toggleEditModal,
                  toggleDeleteModal,
                  userId,
                  userRole,
                  assignmentTest,
                  canEdit,
                  togglePrintModal
                })}
                placement="bottomRight"
                trigger={["click"]}
              >
                <EduButton height="28px" width="100%" isGhost data-cy="testActions">
                  ACTIONS
                </EduButton>
              </Dropdown>
            </ActionDiv>
          );
        },
        onCell: () => ({
          onMouseEnter: this.disableRowClick,
          onMouseLeave: this.enableRowClick
        })
      }
    ]
  };

  static getDerivedStateFromProps(nextProps) {
    const { filtering } = nextProps;
    if (filtering) {
      return { current: 1 };
    }
    return {};
  }

  componentDidMount() {
    this.fetchSummary(1, {});
  }

  fetchSummary = (pageNo, sort) => {
    const { loadAssignmentsSummary, districtId, filters } = this.props;
    loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo }, sort });
  };

  enableRowClick = () => this.setState({ enableRowClick: true });

  disableRowClick = () => this.setState({ enableRowClick: false });

  goToAdvancedView = row => {
    const { history, districtId } = this.props;
    const { enableRowClick } = this.state;
    if (enableRowClick) {
      history.push(`/author/assignments/${districtId}/${row.testId}?testType=${row.testType}`);
    }
  };

  handlePagination = page => {
    const { sort } = this.state;
    this.fetchSummary(page, sort);
    this.setState({ current: page });
  };

  handleSort = (col, index) => {
    const { columns, current } = this.state;
    const { sortOrder } = col;
    const newSortOrder = sortOrder === false ? "descend" : sortOrder === "descend" ? "ascend" : false;
    const newColumns = produce(columns, draft => {
      draft.forEach((o, indx) => {
        if (indx === index) o.sortOrder = newSortOrder;
        else if (indx < 7) o.sortOrder = false;
      });
    });
    this.setState({
      columns: newColumns,
      sort: newSortOrder ? { sortBy: col.dataIndex, sortOrder: newSortOrder } : {}
    });
    this.fetchSummary(current, newSortOrder ? { sortBy: col.dataIndex, sortOrder: newSortOrder } : {});
  };

  render() {
    const { onSelectRow, assignmentsSummary, selectedRows, totalData, loading } = this.props;
    const { perPage, current, columns } = this.state;

    const rowSelection = {
      selectedRowKeys: selectedRows.map(item => `${item.testId}_${item.testType}`),
      onChange: (_, rows) => {
        if (onSelectRow) {
          onSelectRow(rows);
        }
      }
    };

    if (loading) {
      return <Spin size="large" />;
    }
    if (assignmentsSummary.length < 1) {
      return (
        <NoDataNotification
          heading="Assignments not available"
          description="There are no assignments found for this filter."
        />
      );
    }

    return (
      <Container>
        <TableData
          columns={columns}
          rowSelection={rowSelection}
          dataSource={assignmentsSummary.map(item => ({ ...item, key: `${item.testId}_${item.testType}` }))}
          onRow={row => ({
            onClick: () => this.goToAdvancedView(row)
          })}
          pagination={{
            pageSize: perPage,
            onChange: this.handlePagination,
            total: totalData,
            current
          }}
        />
      </Container>
    );
  }
}

AdvancedTable.propTypes = {
  assignmentsSummary: PropTypes.array.isRequired,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  districtId: PropTypes.string.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  filters: PropTypes.object.isRequired,
  onSelectRow: PropTypes.func,
  selectedRows: PropTypes.array.isRequired,
  history: PropTypes.object
};

AdvancedTable.defaultProps = {
  onOpenReleaseScoreSettings: () => {},
  onSelectRow: () => {},
  history: {}
};

const enhance = compose(
  withRouter,
  withNamespaces("assignmentCard"),
  connect(
    state => ({
      assignmentsSummary: getAssignmentsSummary(state),
      filtering: get(state, "author_assignments.filtering"),
      totalData: get(state, "author_assignments.total", 0),
      loading: get(state, "author_assignments.loading"),
      userId: getUserIdSelector(state),
      userRole: getUserRole(state),
      assignmentTests: getAssignmentTestsSelector(state)
    }),
    {
      loadAssignmentsSummary: receiveAssignmentsSummaryAction
    }
  )
);

export default enhance(AdvancedTable);
