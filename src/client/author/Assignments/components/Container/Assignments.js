import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";

import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";

import {
  receiveAssignmentsAction,
  receiveAssignmentByIdAction,
  updateReleaseScoreSettingsAction,
  toggleReleaseScoreSettingsAction
} from "../../../src/actions/assignments";
import {
  getAssignmentsByTestSelector,
  getTestsSelector,
  getCurrentAssignmentSelector,
  getToggleReleaseGradeStateSelector
} from "../../../src/selectors/assignments";

import FilterBar from "../FilterBar/FilterBar";
import TableList from "../TableList/TableList";
import ReleaseGradeSettingsModal from "../ReleaseGradeSettings/ReleaseGradeSetting";
import MobileTableList from "../MobileTableList/MobileTableList";
import ListHeader from "../../../src/components/common/ListHeader";
import { Container, Main, StyledCard } from "./styled";

const { releaseGradeLabels } = test;
class Assignments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchStr: "",
      blockStyle: "tile",
      isShowFilter: false
    };
  }

  componentDidMount() {
    const { loadAssignments } = this.props;
    loadAssignments();
  }

  handleCreate = () => {
    const { history } = this.props;
    history.push("/author/assessments/create");
  };

  onOpenReleaseScoreSettings = (testId, assignmentId) => {
    const { loadAssignmentById } = this.props;
    loadAssignmentById({ testId, assignmentId });
  };

  onUpdateReleaseScoreSettings = releaseScore => {
    const { updateReleaseScoreSettings, currentEditableAssignment, toggleReleaseGradePopUp } = this.props;
    if (releaseScore != releaseGradeLabels.DONT_RELEASE) {
      const updateReleaseScore = { ...currentEditableAssignment, releaseScore };
      updateReleaseScoreSettings(updateReleaseScore);
    } else {
      toggleReleaseGradePopUp(false);
    }
  };

  renderFilter = () => {
    const { windowWidth, windowHeight } = this.props;
    return <FilterBar windowWidth={windowWidth} windowHeight={windowHeight} />;
  };

  render() {
    const { assignmentsByTestId, tests, creating, t, isShowReleaseSettingsPopup, toggleReleaseGradePopUp } = this.props;

    const tabletWidth = 768;

    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          title={t("common.assignmentsTitle")}
          btnTitle="NEW ASSESSMENT"
        />
        <Container>
          <FlexContainer>
            <Main>
              {window.innerWidth >= tabletWidth && (
                <StyledCard>
                  <TableList
                    assignmentsByTestId={assignmentsByTestId}
                    tests={tests}
                    renderFilter={this.renderFilter}
                    onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                  />
                </StyledCard>
              )}
              {window.innerWidth < tabletWidth && (
                <MobileTableList
                  assignmentsByTestId={assignmentsByTestId}
                  tests={tests}
                  onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                />
              )}
            </Main>
          </FlexContainer>
        </Container>
        {isShowReleaseSettingsPopup && (
          <ReleaseGradeSettingsModal
            showReleaseGradeSettings={isShowReleaseSettingsPopup}
            onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
            updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
          />
        )}
      </div>
    );
  }
}

Assignments.propTypes = {
  assignmentsByTestId: PropTypes.array.isRequired,
  loadAssignments: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      assignmentsByTestId: getAssignmentsByTestSelector(state),
      tests: getTestsSelector(state),
      currentEditableAssignment: getCurrentAssignmentSelector(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state)
    }),
    {
      loadAssignments: receiveAssignmentsAction,
      loadAssignmentById: receiveAssignmentByIdAction,
      updateReleaseScoreSettings: updateReleaseScoreSettingsAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction
    }
  )
);

export default enhance(Assignments);
