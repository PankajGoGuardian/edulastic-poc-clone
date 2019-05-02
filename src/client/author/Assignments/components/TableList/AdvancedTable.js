import React, { Component } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { Dropdown, Checkbox } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import { FlexContainer } from "@edulastic/common";

import ActionMenu from "../ActionMenu/ActionMenu";

import { Container, TableData, AssignmentTD, BtnAction, ActionDiv, TitleCase, TestThumbnail } from "./styled";

class AdvancedTable extends Component {
  state = {
    enableRowClick: true
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

  render() {
    const { onSelectRow, assignmentsSummary, history, onOpenReleaseScoreSettings } = this.props;

    const columns = [
      {
        title: <Checkbox />,
        dataIndex: "checkbox",
        width: "5%",
        className: "select-row",
        render: (_, row) => <Checkbox onChange={e => onSelectRow(row, e.target.checked)} />,
        onCell: () => ({
          onMouseEnter: this.disableRowClick,
          onMouseLeave: this.enableRowClick
        })
      },
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
        dataIndex: "assigned",
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

    return (
      <Container>
        <TableData
          columns={columns}
          rowKey="testId"
          dataSource={assignmentsSummary}
          onRow={row => ({
            onClick: () => this.goToAdvancedView(row)
          })}
        />
      </Container>
    );
  }
}

AdvancedTable.propTypes = {
  assignmentsSummary: PropTypes.array.isRequired,
  districtId: PropTypes.string.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
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
  withNamespaces("assignmentCard")
);

export default enhance(AdvancedTable);
