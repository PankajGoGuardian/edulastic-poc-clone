import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { find, isEmpty } from "lodash";
import { Dropdown } from "antd";
import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { authorAssignment } from "@edulastic/colors";
import { receiveAssignmentClassList, receiveAssignmentsSummaryAction } from "../../../src/actions/assignments";

import { getAssignmentsSummary, getAssignmentClassList } from "../../../src/selectors/assignments";
import ListHeader from "../../../src/components/common/ListHeader";
import ActionMenu from "../../../Assignments/components/ActionMenu/ActionMenu";
import {
  Container,
  PaginationInfo,
  AnchorLink,
  Anchor,
  Breadcrumbs,
  ActionDiv,
  BtnAction,
  StyledCard,
  TableWrapper
} from "./styled";
import { Breadcrumb } from "../Breadcrumb";
import TableList from "../TableList";

const { assignmentStatusBg } = authorAssignment;

class AssignmentAdvanced extends Component {
  state = {
    filterStatus: ""
  };

  componentDidMount() {
    const { match } = this.props;
    const { districtId, testId } = match.params;
    const { loadAssignmentsClassList, loadAssignmentsSummary, assignmentsSummary } = this.props;
    if (isEmpty(assignmentsSummary)) {
      loadAssignmentsSummary({ districtId });
    }
    loadAssignmentsClassList({ districtId, testId });
  }

  handleCreate = () => {};

  onOpenReleaseScoreSettings = () => {};

  renderBreadcrumbs = (assingment, history) => (
    <FlexContainer>
      <Breadcrumbs>
        <Breadcrumb
          handleClick={() => this.setState({ filterStatus: "NOT OPEN" })}
          first
          color={assignmentStatusBg.NOT_OPEN}
        >
          <span>{assingment.notStarted || 0}</span>Not Open
        </Breadcrumb>
        <Breadcrumb
          handleClick={() => this.setState({ filterStatus: "IN PROGRESS" })}
          color={assignmentStatusBg.IN_PROGRESS}
        >
          <span>{assingment.inProgress || 0}</span>In Progress
        </Breadcrumb>
        <Breadcrumb
          handleClick={() => this.setState({ filterStatus: "IN GRADING" })}
          color={assignmentStatusBg.IN_GRADING}
        >
          <span>{assingment.inGrading || 0}</span>In Grading
        </Breadcrumb>
        <Breadcrumb handleClick={() => this.setState({ filterStatus: "DONE" })} color={assignmentStatusBg.DONE}>
          <span>{assingment.graded || 0}</span>Done
        </Breadcrumb>
      </Breadcrumbs>
      <ActionDiv>
        <Dropdown
          overlay={ActionMenu(this.onOpenReleaseScoreSettings, assingment, history)}
          placement="bottomCenter"
          trigger={["click"]}
        >
          <BtnAction>Actions</BtnAction>
        </Dropdown>
      </ActionDiv>
    </FlexContainer>
  );

  render() {
    const { classList, assignmentsSummary, match, history } = this.props;
    const { testId } = match.params;
    const { filterStatus } = this.state;
    const assingment = find(assignmentsSummary, item => item.testId === testId) || {};

    return (
      <div>
        <ListHeader title={assingment.title || "Loading..."} hasButton={false} />
        <Container>
          <FlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to="/author/assignments">Assignments</AnchorLink> / <Anchor>{assingment.title}</Anchor>
            </PaginationInfo>
            {this.renderBreadcrumbs(assingment, history)}
          </FlexContainer>
          <TableWrapper>
            <StyledCard>
              <TableList classList={classList} filterStatus={filterStatus} rowKey={recode => recode.assignmentId} />
            </StyledCard>
          </TableWrapper>
        </Container>
      </div>
    );
  }
}

AssignmentAdvanced.propTypes = {
  match: PropTypes.object.isRequired,
  loadAssignmentsClassList: PropTypes.func.isRequired,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  assignmentsSummary: PropTypes.array.isRequired,
  classList: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      assignmentsSummary: getAssignmentsSummary(state),
      classList: getAssignmentClassList(state)
    }),
    {
      loadAssignmentsClassList: receiveAssignmentClassList,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction
    }
  )
);

export default enhance(AssignmentAdvanced);
