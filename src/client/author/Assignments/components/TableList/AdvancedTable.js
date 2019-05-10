import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { Dropdown } from "antd";
import { isEmpty, get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import { FlexContainer } from "@edulastic/common";
import { receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";
import { getAssignmentsSummary } from "../../../src/selectors/assignments";
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
    const { onSelectRow, assignmentsSummary, history, onOpenReleaseScoreSettings } = this.props;
    const { perPage, current } = this.state;
    const columns = [
      {
        title: "ASSESSMENT NAME",
        dataIndex: "title",
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
        title: "Type",
        dataIndex: "testType",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "11%",
        render: (text = test.type.ASSESSMENT) => <TitleCase>{text}</TitleCase>
      },
      {
        title: "Classes",
        dataIndex: "total",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "11%",
        render: text => <div>{text}</div>
      },
      {
        title: "Not started",
        dataIndex: "notStarted",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "15%",
        render: text => <div> {text} </div>
      },
      {
        title: "In progress",
        dataIndex: "inProgress",
        sortDirections: ["descend", "ascend"],
        sorter: true,
        width: "12%",
        render: text => <div>{text} </div>
      },
      {
        title: "Submitted",
        dataIndex: "inGrading",
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
        title: "",
        dataIndex: "action",
        width: "14%",
        render: (_, row) => (
          <ActionDiv>
            <Dropdown
              overlay={ActionMenu(onOpenReleaseScoreSettings, row, history)}
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
      // selectedRowKeys: selectedClasses,
      onChange: (_, rows) => {
        if (onSelectRow) {
          onSelectRow(rows);
        }
      }
    };

    return (
      <Container>
        <TableData
          columns={columns}
          rowKey="testId"
          rowSelection={rowSelection}
          dataSource={assignmentsSummary}
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
  districtId: PropTypes.string.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  filters: PropTypes.object.isRequired,
  onSelectRow: PropTypes.func,
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
      filtering: get(state, "author_assignments.filtering")
    }),
    {
      loadAssignmentsSummary: receiveAssignmentsSummaryAction
    }
  )
);

export default enhance(AdvancedTable);
