import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { find, isEmpty, get } from "lodash";
import { withRouter } from "react-router-dom";
import { Dropdown, Tooltip, Spin } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";
import produce from "immer";
import { FlexContainer } from "@edulastic/common";
import { receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";
import { getAssignmentsSummary } from "../../../src/selectors/assignments";
import { getFolderSelector } from "../../../src/selectors/folder";
import ActionMenu from "../ActionMenu/ActionMenu";

import { Container, TableData, AssignmentTD, BtnAction, ActionDiv, TitleCase, TestThumbnail } from "./styled";
import NoDataNotification from "../../../../common/components/NoDataNotification";

class AdvancedTable extends Component {
  state = {
    enableRowClick: true,
    perPage: 20,
    pageNo: 1,
    current: 1,
    sort: {},
    columns: [
      {
        title: "ASSIGNMENT NAME",
        dataIndex: "title",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "20%",
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 0) };
        },
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
        width: "10%",
        align: "left",
        className: "assignment-name",
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 1) };
        },
        render: (text = test.type.ASSESSMENT) => <TitleCase>{text}</TitleCase>
      },
      {
        title: "Classes",
        dataIndex: "total",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 2) };
        },
        width: "11%",
        render: text => <div>{text}</div>
      },
      {
        title: "Not Open",
        dataIndex: "notStarted",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 3) };
        },
        width: "11%",
        render: text => <div> {text} </div>
      },
      {
        title: "In Progress",
        dataIndex: "inProgress",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 4) };
        },
        width: "11%",
        render: text => <div>{text} </div>
      },
      {
        title: "In Grading",
        dataIndex: "inGrading",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 5) };
        },
        width: "11%",
        render: text => <div> {text} </div>
      },
      {
        title: "Done",
        dataIndex: "graded",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        sortOrder: false,
        onHeaderCell: col => {
          return { onClick: () => this.handleSort(col, 6) };
        },

        width: "10%",
        render: text => <div> {text} </div>
      },
      {
        title: "",
        dataIndex: "action",
        width: "10%",
        render: (_, row) => (
          <ActionDiv data-cy="testActions">
            <Dropdown
              data-cy="actionDropDown"
              overlay={ActionMenu(
                this.props.onOpenReleaseScoreSettings,
                row,
                this.props.history,
                this.props.showPreviewModal,
                this.props.toggleEditModal
              )}
              placement="bottomRight"
              trigger={["click"]}
            >
              <BtnAction data-cy="testActions">ACTIONS</BtnAction>
            </Dropdown>
          </ActionDiv>
        ),
        onCell: () => ({
          onMouseEnter: this.disableRowClick,
          onMouseLeave: this.enableRowClick
        })
      }
    ]
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const { filtering } = nextProps;
    if (filtering) {
      return { pageNo: 1, current: 1 };
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
      draft = draft.map((o, indx) => {
        if (indx === index) o.sortOrder = newSortOrder;
        else if (indx < 7) o.sortOrder = false;
        return o;
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
          heading={"Assignments not available"}
          description={"There are no assignments found for this filter."}
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
  folderData: PropTypes.object.isRequired,
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
      folderData: getFolderSelector(state)
    }),
    {
      loadAssignmentsSummary: receiveAssignmentsSummaryAction
    }
  )
);

export default enhance(AdvancedTable);
