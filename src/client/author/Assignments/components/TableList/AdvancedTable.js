import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { find, isEmpty, get } from "lodash";
import { withRouter } from "react-router-dom";
import { Dropdown, Tooltip } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import { FlexContainer } from "@edulastic/common";
import { receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";
import { getAssignmentsSummary } from "../../../src/selectors/assignments";
import { getFolderSelector } from "../../../src/selectors/folder";
import ActionMenu from "../ActionMenu/ActionMenu";

import { Container, TableData, AssignmentTD, BtnAction, ActionDiv, TitleCase, TestThumbnail } from "./styled";

class AdvancedTable extends Component {
  state = {
    enableRowClick: true,
    perPage: 20,
    pageNo: 1,
    current: 1
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const { assignmentsSummary, loadAssignmentsSummary, districtId, filtering, filters } = nextProps;
    const { perPage, pageNo } = preState;
    if (assignmentsSummary.length === perPage && pageNo === 1) {
      loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo: pageNo + 1 } });
      return { pageNo: pageNo + 1 };
    }

    if (filtering) {
      return { pageNo: 1, current: 1 };
    }

    return {};
  }

  componentDidMount() {
    const { assignmentsSummary } = this.props;
    if (isEmpty(assignmentsSummary)) {
      this.fetchSummary();
    }
  }

  fetchSummary = () => {
    const { loadAssignmentsSummary, districtId, filters } = this.props;
    const { pageNo } = this.state;
    loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo } });
  };

  enableRowClick = () => this.setState({ enableRowClick: true });

  disableRowClick = () => this.setState({ enableRowClick: false });

  goToAdvancedView = row => {
    const { history, districtId } = this.props;
    const { enableRowClick } = this.state;
    if (enableRowClick) {
      history.push(`/author/assignments/${districtId}/${row.testId}`);
    }
  };

  handlePagination = (page, pageSize) => {
    const { assignmentsSummary } = this.props;
    if (page * pageSize >= assignmentsSummary.length) {
      this.setState(preState => ({ pageNo: preState.pageNo + 1 }), this.fetchSummary);
    }
    this.setState({ current: page });
  };

  render() {
    const {
      onSelectRow,
      assignmentsSummary,
      history,
      onOpenReleaseScoreSettings,
      selectedRows,
      folderData,
      showPreviewModal
    } = this.props;
    const { perPage, current } = this.state;
    const columns = [
      {
        title: "ASSESSMENT NAME",
        dataIndex: "title",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.title.localeCompare(b.title, "en", { ignorePunctuation: true }),
        width: "22%",
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
        title: "Type",
        dataIndex: "testType",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.testType.localeCompare(b.testType),
        width: "11%",
        render: (text = test.type.ASSESSMENT) => <TitleCase>{text}</TitleCase>
      },
      {
        title: "Classes",
        dataIndex: "total",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.total - b.total,
        width: "11%",
        render: text => <div>{text}</div>
      },
      {
        title: "Not started",
        dataIndex: "notStarted",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.notStarted - b.notStarted,
        width: "15%",
        render: text => <div> {text} </div>
      },
      {
        title: "In progress",
        dataIndex: "inProgress",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.inProgress - b.inProgress,
        width: "12%",
        render: text => <div>{text} </div>
      },
      {
        title: "Submitted",
        dataIndex: "inGrading",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.inGrading - b.inGrading,
        width: "16%",
        render: (text, row) => <div> {text + row.graded} </div>
      },
      {
        title: "Graded",
        dataIndex: "graded",
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => a.graded - b.graded,
        width: "14%",
        render: text => <div> {text} </div>
      },
      {
        title: "",
        dataIndex: "action",
        width: "14%",
        render: (_, row) => (
          <ActionDiv>
            <Dropdown
              overlay={ActionMenu(onOpenReleaseScoreSettings, row, history, showPreviewModal)}
              placement="bottomCenter"
              trigger={["click"]}
            >
              <BtnAction>ACTIONS</BtnAction>
            </Dropdown>
          </ActionDiv>
        ),
        onCell: () => ({
          onMouseEnter: this.disableRowClick,
          onMouseLeave: this.enableRowClick
        })
      }
    ];

    const rowSelection = {
      selectedRowKeys: selectedRows.map(({ testId }) => testId),
      onChange: (_, rows) => {
        if (onSelectRow) {
          onSelectRow(rows);
        }
      }
    };

    let data = assignmentsSummary;
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
          rowKey="testId"
          rowSelection={rowSelection}
          dataSource={data}
          onRow={row => ({
            onClick: () => this.goToAdvancedView(row)
          })}
          pagination={{
            pageSize: perPage,
            onChange: this.handlePagination,
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
      folderData: getFolderSelector(state)
    }),
    {
      loadAssignmentsSummary: receiveAssignmentsSummaryAction
    }
  )
);

export default enhance(AdvancedTable);
