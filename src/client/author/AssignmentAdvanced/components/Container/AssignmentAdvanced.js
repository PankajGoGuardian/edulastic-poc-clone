import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { find, isEmpty, get } from "lodash";
import { Dropdown } from "antd";
import * as qs from "query-string";
import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { authorAssignment } from "@edulastic/colors";
import { IconMoreVertical } from "@edulastic/icons";
import {
  receiveAssignmentClassList,
  receiveAssignmentsSummaryAction,
  toggleReleaseScoreSettingsAction
} from "../../../src/actions/assignments";

import {
  getAssignmentsSummary,
  getAssignmentClassList,
  getToggleReleaseGradeStateSelector,
  getCurrentTestSelector
} from "../../../src/selectors/assignments";
import ListHeader from "../../../src/components/common/ListHeader";
import ActionMenu from "../../../Assignments/components/ActionMenu/ActionMenu";
import {
  Container,
  PaginationInfo,
  AnchorLink,
  Anchor,
  Breadcrumbs,
  BtnAction,
  StyledCard,
  TableWrapper,
  StyledButton,
  StyledSpan,
  StyledFlexContainer
} from "./styled";
import { Breadcrumb } from "../Breadcrumb";
import TableList from "../TableList";
import TestPreviewModal from "../../../Assignments/components/Container/TestPreviewModal";
import EditTestModal from "../../../src/components/common/EditTestModal";
import ReleaseScoreSettingsModal from "../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import { releaseScoreAction } from "../../../src/actions/classBoard";
import {
  bulkOpenAssignmentAction,
  bulkCloseAssignmentAction,
  bulkPauseAssignmentAction,
  bulkMarkAsDoneAssignmentAction,
  bulkReleaseScoreAssignmentAction,
  bulkUnassignAssignmentAction,
  bulkDownloadGradesAndResponsesAction
} from "../../ducks";
import { toggleDeleteAssignmentModalAction } from "../../../sharedDucks/assignments";
import { getUserId } from "../../../src/selectors/user";
import { canEditTest } from "../../../Assignments/utils";

const { assignmentStatusBg } = authorAssignment;

class AssignmentAdvanced extends Component {
  state = {
    openEditPopup: false,
    isPreviewModalVisible: false,
    filterStatus: ""
  };

  componentDidMount() {
    const { match, location } = this.props;
    const { districtId, testId } = match.params;
    const { loadAssignmentsClassList, loadAssignmentsSummary, assignmentsSummary } = this.props;
    const { testType = "" } = qs.parse(location.search);
    if (isEmpty(assignmentsSummary)) {
      loadAssignmentsSummary({ districtId });
    }
    loadAssignmentsClassList({ districtId, testId, testType });
  }

  handleCreate = () => {};

  onOpenReleaseScoreSettings = testId => {
    const { toggleReleaseGradePopUp } = this.props;
    toggleReleaseGradePopUp(true);
    this.setState({ currentTestId: testId });
  };

  renderBreadcrumbs = assingment => {
    const { filterStatus } = this.state;

    return (
      <FlexContainer>
        <div>
          <StyledSpan>Filter By</StyledSpan>
          <StyledButton type="primary" onClick={() => this.setState({ filterStatus: "" })}>
            All
          </StyledButton>
        </div>
        <Breadcrumbs>
          <Breadcrumb
            handleClick={() => this.setState({ filterStatus: "NOT OPEN" })}
            first
            color={filterStatus === "NOT OPEN" ? "white" : assignmentStatusBg.NOT_OPEN}
            bgColor={filterStatus === "NOT OPEN" && assignmentStatusBg.NOT_OPEN}
          >
            <span>{assingment.notStarted || 0}</span>Not Open
          </Breadcrumb>
          <Breadcrumb
            handleClick={() => this.setState({ filterStatus: "IN PROGRESS" })}
            color={filterStatus === "IN PROGRESS" ? "white" : assignmentStatusBg.IN_PROGRESS}
            bgColor={filterStatus === "IN PROGRESS" && assignmentStatusBg.IN_PROGRESS}
          >
            <span>{assingment.inProgress || 0}</span>In Progress
          </Breadcrumb>
          <Breadcrumb
            handleClick={() => this.setState({ filterStatus: "IN GRADING" })}
            color={filterStatus === "IN GRADING" ? "white" : assignmentStatusBg.IN_GRADING}
            bgColor={filterStatus === "IN GRADING" && assignmentStatusBg.IN_GRADING}
          >
            <span>{assingment.inGrading || 0}</span>In Grading
          </Breadcrumb>
          <Breadcrumb
            handleClick={() => this.setState({ filterStatus: "DONE" })}
            color={filterStatus === "DONE" ? "white" : assignmentStatusBg.DONE}
            bgColor={filterStatus === "DONE" && assignmentStatusBg.DONE}
          >
            <span>{assingment.graded || 0}</span>Done
          </Breadcrumb>
        </Breadcrumbs>
      </FlexContainer>
    );
  };

  onEnableEdit = () => {
    const { history, match } = this.props;
    const { testId } = match.params;
    history.push({
      pathname: `/author/tests/${testId}/editAssigned`,
      state: { showCancelButton: true }
    });
  };

  toggleEditModal = value => {
    this.setState({ openEditPopup: value });
  };

  toggleTestPreviewModal = value => {
    this.setState({ isPreviewModalVisible: !!value });
  };

  onUpdateReleaseScoreSettings = releaseScore => {
    const { currentTestId, filterState } = this.state;
    const { setReleaseScore, toggleReleaseGradePopUp } = this.props;
    setReleaseScore(undefined, undefined, releaseScore, currentTestId, filterState);
    toggleReleaseGradePopUp(false);
  };

  render() {
    const {
      classList,
      assignmentsSummary,
      match,
      history,
      error,
      toggleReleaseGradePopUp,
      isShowReleaseSettingsPopup,
      bulkOpenAssignmentRequest,
      bulkCloseAssignmentRequest,
      bulkPauseAssignmentRequest,
      bulkMarkAsDoneAssignmentRequest,
      bulkReleaseScoreAssignmentRequest,
      bulkUnassignAssignmentRequest,
      bulkDownloadGradesAndResponsesRequest,
      toggleDeleteAssignmentModal,
      location,
      userId,
      test
    } = this.props;
    const { testId } = match.params;
    const { filterStatus, openEditPopup, isPreviewModalVisible } = this.state;
    const assingment = find(assignmentsSummary, item => item.testId === testId) || {};
    const { testType = "" } = qs.parse(location.search);
    return (
      <div>
        <EditTestModal
          visible={openEditPopup}
          isUsed
          onCancel={() => this.toggleEditModal(false)}
          onOk={this.onEnableEdit}
        />

        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={testId}
          error={error}
          closeTestPreviewModal={() => this.toggleTestPreviewModal(false)}
        />

        <ListHeader
          title={assingment.title || "Loading..."}
          hasButton={false}
          renderExtra={() => (
            <Dropdown
              overlay={ActionMenu({
                onOpenReleaseScoreSettings: this.onOpenReleaseScoreSettings,
                row: assingment,
                history,
                showPreviewModal: this.toggleTestPreviewModal,
                toggleEditModal: this.toggleEditModal,
                canEdit: canEditTest(test, userId)
              })}
              placement="bottomLeft"
              trigger={["hover"]}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <BtnAction>
                <IconMoreVertical />
              </BtnAction>
            </Dropdown>
          )}
        />
        <Container>
          <StyledFlexContainer justifyContent="space-between">
            <PaginationInfo>
              &lt; <AnchorLink to="/author/assignments">Assignments</AnchorLink> / <Anchor>{assingment.title}</Anchor>
            </PaginationInfo>
            {this.renderBreadcrumbs(assingment, history)}
          </StyledFlexContainer>
          <TableWrapper>
            <StyledCard>
              <TableList
                classList={classList}
                filterStatus={filterStatus}
                rowKey={recode => recode.assignmentId}
                bulkOpenAssignmentRequest={bulkOpenAssignmentRequest}
                bulkCloseAssignmentRequest={bulkCloseAssignmentRequest}
                bulkPauseAssignmentRequest={bulkPauseAssignmentRequest}
                bulkMarkAsDoneAssignmentRequest={bulkMarkAsDoneAssignmentRequest}
                bulkReleaseScoreAssignmentRequest={bulkReleaseScoreAssignmentRequest}
                bulkUnassignAssignmentRequest={bulkUnassignAssignmentRequest}
                bulkDownloadGradesAndResponsesRequest={bulkDownloadGradesAndResponsesRequest}
                toggleDeleteAssignmentModal={toggleDeleteAssignmentModal}
                testType={testType}
                testName={assingment.title}
              />
            </StyledCard>
          </TableWrapper>
        </Container>
        <ReleaseScoreSettingsModal
          showReleaseGradeSettings={isShowReleaseSettingsPopup}
          onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
          updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
        />
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
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      error: get(state, "test.error", false),
      classList: getAssignmentClassList(state),
      test: getCurrentTestSelector(state),
      userId: getUserId(state)
    }),
    {
      setReleaseScore: releaseScoreAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      loadAssignmentsClassList: receiveAssignmentClassList,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      bulkOpenAssignmentRequest: bulkOpenAssignmentAction,
      bulkCloseAssignmentRequest: bulkCloseAssignmentAction,
      bulkPauseAssignmentRequest: bulkPauseAssignmentAction,
      bulkMarkAsDoneAssignmentRequest: bulkMarkAsDoneAssignmentAction,
      bulkReleaseScoreAssignmentRequest: bulkReleaseScoreAssignmentAction,
      bulkUnassignAssignmentRequest: bulkUnassignAssignmentAction,
      bulkDownloadGradesAndResponsesRequest: bulkDownloadGradesAndResponsesAction,
      toggleDeleteAssignmentModal: toggleDeleteAssignmentModalAction
    }
  )
);

export default enhance(AssignmentAdvanced);
