import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { remove, clone } from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";
import { IconFilter } from "@edulastic/icons";
import { blue, white } from "@edulastic/colors";

import {
  receiveAssignmentsAction,
  receiveAssignmentsSummaryAction,
  receiveAssignmentByIdAction,
  updateReleaseScoreSettingsAction,
  toggleReleaseScoreSettingsAction
} from "../../../src/actions/assignments";
import { receiveFolderAction } from "../../../src/actions/folder";

import {
  getAssignmentsSummary,
  getAssignmentsByTestSelector,
  getTestsSelector,
  getCurrentAssignmentSelector,
  getToggleReleaseGradeStateSelector,
  getDistrictIdSelector
} from "../../../src/selectors/assignments";

import FilterBar from "../FilterBar/FilterBar";
import TableList from "../TableList/TableList";
import AdvancedTable from "../TableList/AdvancedTable";
import ReleaseGradeSettingsModal from "../ReleaseGradeSettings/ReleaseGradeSetting";
import MobileTableList from "../MobileTableList/MobileTableList";
import ListHeader from "../../../src/components/common/ListHeader";
import LeftFilter from "../LeftFilter";
import {
  Container,
  Main,
  StyledCard,
  ViewSwitch,
  TestButton,
  SwitchWrapper,
  SwitchLabel,
  FilterButton,
  TableWrapper
} from "./styled";

const { releaseGradeLabels } = test;

const initialFilterState = {
  grades: [],
  subject: "",
  termId: "",
  testType: "",
  folderId: ""
};
class Assignments extends Component {
  state = {
    showFilter: false,
    isAdvancedView: false,
    selectedRows: [],
    filterState: initialFilterState
  };

  componentDidMount() {
    const { loadAssignments, loadAssignmentsSummary, districtId, loadFolders } = this.props;
    loadAssignments();
    loadFolders();
    loadAssignmentsSummary({ districtId, filters: { pageNo: 1 } });
  }

  setFilterState = filterState => {
    this.setState({ filterState });
  };

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
    if (releaseScore !== releaseGradeLabels.DONT_RELEASE) {
      const updateReleaseScore = { ...currentEditableAssignment, releaseScore };
      updateReleaseScoreSettings(updateReleaseScore);
    } else {
      toggleReleaseGradePopUp(false);
    }
  };

  SwitchView = checked => {
    this.setState({ isAdvancedView: checked, selectedRows: [], filterState: initialFilterState });
  };

  renderFilter = () => {
    const { windowWidth, windowHeight } = this.props;
    return <FilterBar windowWidth={windowWidth} windowHeight={windowHeight} />;
  };

  renderSwitch = isAdvancedView => (
    <SwitchWrapper>
      <SwitchWrapper>
        <SwitchLabel>TEACHER</SwitchLabel>
        <ViewSwitch size="small" onChange={this.SwitchView} />
        <SwitchLabel>ADVANCED</SwitchLabel>
      </SwitchWrapper>
      <TestButton onClick={() => {}} color="secondary" variant="test" shadow="none">
        {isAdvancedView ? "CREATE TEST" : "AUTHOR TEST"}
      </TestButton>
    </SwitchWrapper>
  );

  toggleFilter = () => {
    const { showFilter } = this.state;
    this.setState({ showFilter: !showFilter });
  };

  onSelectRow = (selected, checked) => {
    const { selectedRows } = this.state;
    remove(selectedRows, r => r.testId === selected.testId);
    if (checked) {
      selectedRows.push(selected);
    }
    this.setState({ selectedRows: clone(selectedRows) });
  };

  render() {
    const {
      assignmentsByTestId,
      tests,
      t,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      assignmentsSummary,
      districtId
    } = this.props;
    const { showFilter, isAdvancedView, selectedRows, filterState } = this.state;
    const tabletWidth = 768;

    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          title={t("common.assignmentsTitle")}
          btnTitle="NEW ASSESSMENT"
          renderFilter={this.renderSwitch}
          isAdvancedView={isAdvancedView}
        />
        <Container>
          <FlexContainer>
            <Main>
              {window.innerWidth >= tabletWidth && (
                <>
                  {(isAdvancedView || showFilter) && (
                    <PerfectScrollbar option={{ suppressScrollX: true }}>
                      <LeftFilter
                        selectedRows={selectedRows}
                        onSetFilter={this.setFilterState}
                        filterState={filterState}
                        isAdvancedView={isAdvancedView}
                      />
                    </PerfectScrollbar>
                  )}
                  <TableWrapper>
                    {!isAdvancedView && (
                      <FilterButton
                        color={showFilter ? "primary" : "secondary"}
                        variant="filter"
                        onClick={this.toggleFilter}
                      >
                        <IconFilter color={showFilter ? white : blue} width={20} height={20} />
                      </FilterButton>
                    )}
                    <StyledCard>
                      {isAdvancedView ? (
                        <AdvancedTable
                          districtId={districtId}
                          assignmentsSummary={assignmentsSummary}
                          onSelectRow={this.onSelectRow}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          filters={filterState}
                        />
                      ) : (
                        <TableList
                          assignmentsByTestId={assignmentsByTestId}
                          tests={tests}
                          assignmentsSummary={assignmentsSummary}
                          onSelectRow={this.onSelectRow}
                          // renderFilter={this.renderFilter}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                        />
                      )}
                    </StyledCard>
                  </TableWrapper>
                </>
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
  assignmentsSummary: PropTypes.array,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  loadFolders: PropTypes.func.isRequired,
  assignmentsByTestId: PropTypes.object.isRequired,
  loadAssignments: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  loadAssignmentById: PropTypes.func.isRequired,
  updateReleaseScoreSettings: PropTypes.func.isRequired,
  currentEditableAssignment: PropTypes.object.isRequired,
  toggleReleaseGradePopUp: PropTypes.func.isRequired,
  tests: PropTypes.array.isRequired,
  isShowReleaseSettingsPopup: PropTypes.bool.isRequired,
  districtId: PropTypes.string.isRequired
};

Assignments.defaultProps = {
  assignmentsSummary: []
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("header"),
  connect(
    state => ({
      assignmentsSummary: getAssignmentsSummary(state),
      assignmentsByTestId: getAssignmentsByTestSelector(state),
      tests: getTestsSelector(state),
      currentEditableAssignment: getCurrentAssignmentSelector(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      districtId: getDistrictIdSelector(state)
    }),
    {
      loadAssignments: receiveAssignmentsAction,
      loadFolders: receiveFolderAction,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      loadAssignmentById: receiveAssignmentByIdAction,
      updateReleaseScoreSettings: updateReleaseScoreSettingsAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction
    }
  )
);

export default enhance(Assignments);
