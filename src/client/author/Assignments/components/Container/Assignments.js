import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { get, find, isEmpty } from "lodash";
import PerfectScrollbar from "react-perfect-scrollbar";

import { withWindowSizes, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";
import { IconFilter } from "@edulastic/icons";
import { white } from "@edulastic/colors";

import {
  receiveAssignmentsAction,
  receiveAssignmentsSummaryAction,
  receiveAssignmentByIdAction,
  updateReleaseScoreSettingsAction,
  toggleReleaseScoreSettingsAction,
  toggleAssignmentViewAction,
  setAssignmentFiltersAction
} from "../../../src/actions/assignments";
import { receiveFolderAction } from "../../../src/actions/folder";
import TestPreviewModal from "./TestPreviewModal";
import {
  getAssignmentsSummary,
  getAssignmentsByTestSelector,
  getTestsSelector,
  getCurrentAssignmentSelector,
  getToggleReleaseGradeStateSelector,
  getDistrictIdSelector,
  getAssignmentViewSelector,
  getAssignmentFilterSelector
} from "../../../src/selectors/assignments";

import FilterBar from "../FilterBar/FilterBar";
import TableList from "../TableList/TableList";
import AdvancedTable from "../TableList/AdvancedTable";
import ReleaseScoreSettingsModal from "../ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import MobileTableList from "../MobileTableList/MobileTableList";
import ListHeader from "../../../src/components/common/ListHeader";
import LeftFilter from "../LeftFilter";
import {
  Container,
  Main,
  StyledCard,
  ViewSwitch,
  SwitchWrapper,
  SwitchLabel,
  FilterButton,
  TableWrapper
} from "./styled";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
import { getUserRole } from "../../../src/selectors/user";

const { releaseGradeLabels, type } = test;

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
    selectedRows: [],
    filterState: initialFilterState,
    defaultFilters: {},
    isPreviewModalVisible: false,
    currentTestId: ""
  };

  componentDidMount() {
    const {
      loadAssignments,
      loadAssignmentsSummary,
      districtId,
      loadFolders,
      userRole,
      defaultFilters,
      orgData
    } = this.props;
    const { terms, defaultTermId } = orgData;
    const { filterState } = this.state;

    let filters = {};

    if (defaultTermId) {
      const defaultTerm = find(terms, ({ _id }) => _id === defaultTermId) || {};
      filters = { termId: defaultTerm._id || "" };
    }
    filters = {
      ...filters,
      testType: userRole !== "teacher" ? "common" : "",
      ...defaultFilters
    };
    loadAssignments({ filters });

    loadFolders();
    loadAssignmentsSummary({ districtId, filters: { ...filters, pageNo: 1 }, filtering: true });
    const newFilterState = {
      ...filterState,
      ...filters
    };

    this.setState({ filterState: newFilterState, defaultFilters: newFilterState });
  }

  setFilterState = filterState => {
    const { setAssignmentFilters } = this.props;
    storeInLocalStorage("filterAssignments", JSON.stringify(filterState));
    setAssignmentFilters(filterState);
    this.setState({ filterState });
  };

  hidePreviewModal = () => {
    this.setState({ isPreviewModalVisible: false });
  };

  showPreviewModal = testId => {
    this.setState({ isPreviewModalVisible: true, currentTestId: testId });
  };

  handleCreate = () => {
    const { history } = this.props;
    history.push("/author/tests/select");
  };

  onOpenReleaseScoreSettings = (testId, assignmentId) => {
    const { loadAssignmentById } = this.props;
    loadAssignmentById({ testId, assignmentId });
  };

  onUpdateReleaseScoreSettings = releaseScore => {
    const { updateReleaseScoreSettings, currentAssignment = { class: [{}] }, toggleReleaseGradePopUp } = this.props;
    if (releaseScore !== releaseGradeLabels.DONT_RELEASE) {
      const { startDate, endDate } = currentAssignment.class[0];
      const updateReleaseScore = { ...currentAssignment, releaseScore, startDate, endDate };
      updateReleaseScoreSettings(updateReleaseScore);
    } else {
      toggleReleaseGradePopUp(false);
    }
  };

  SwitchView = () => {
    const { toggleAssignmentView } = this.props;
    this.setState({ selectedRows: [] }, toggleAssignmentView);
  };

  renderFilter = () => {
    const { windowWidth, windowHeight } = this.props;
    return <FilterBar windowWidth={windowWidth} windowHeight={windowHeight} />;
  };

  renderSwitch = isAdvancedView => (
    <SwitchWrapper>
      <SwitchWrapper>
        <SwitchLabel>TEACHER</SwitchLabel>
        <ViewSwitch checked={isAdvancedView} size="small" onChange={this.SwitchView} />
        <SwitchLabel>ADVANCED</SwitchLabel>
      </SwitchWrapper>
    </SwitchWrapper>
  );

  toggleFilter = () => {
    const { showFilter } = this.state;
    this.setState({ showFilter: !showFilter });
  };

  onSelectRow = selected => {
    this.setState({ selectedRows: selected });
  };

  render() {
    const {
      assignmentsByTestId,
      tests,
      t,
      isShowReleaseSettingsPopup,
      toggleReleaseGradePopUp,
      assignmentsSummary,
      districtId,
      isAdvancedView,
      currentAssignment
    } = this.props;
    const { showFilter, selectedRows, filterState, isPreviewModalVisible, currentTestId } = this.state;
    const tabletWidth = 768;
    const { releaseScore } = currentAssignment;
    return (
      <div>
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
          testId={currentTestId}
          hideModal={this.hidePreviewModal}
        />
        <ListHeader
          onCreate={this.handleCreate}
          createAssignment={true}
          title={t("common.assignmentsTitle")}
          btnTitle="AUTHOR TEST"
          isAdvancedView={isAdvancedView}
        />
        <Container>
          <FlexContainer>
            <Main>
              {window.innerWidth >= tabletWidth && (
                <>
                  {showFilter && (
                    <PerfectScrollbar option={{ suppressScrollX: true }}>
                      <LeftFilter
                        selectedRows={selectedRows}
                        onSetFilter={this.setFilterState}
                        filterState={filterState}
                        isAdvancedView={isAdvancedView}
                        clearSelectedRow={() => this.onSelectRow([])}
                      />
                    </PerfectScrollbar>
                  )}
                  <TableWrapper>
                    <FilterButton showFilter={showFilter} variant="filter" onClick={this.toggleFilter}>
                      <IconFilter color={showFilter ? white : "#00AD50"} width={20} height={20} />
                    </FilterButton>
                    <StyledCard>
                      {isAdvancedView ? (
                        <AdvancedTable
                          districtId={districtId}
                          assignmentsSummary={assignmentsSummary}
                          onSelectRow={this.onSelectRow}
                          selectedRows={selectedRows}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          filters={filterState}
                          showPreviewModal={this.showPreviewModal}
                        />
                      ) : (
                        <TableList
                          assignmentsByTestId={assignmentsByTestId}
                          tests={tests}
                          onSelectRow={this.onSelectRow}
                          selectedRows={selectedRows}
                          onOpenReleaseScoreSettings={this.onOpenReleaseScoreSettings}
                          showPreviewModal={this.showPreviewModal}
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
        <ReleaseScoreSettingsModal
          showReleaseGradeSettings={isShowReleaseSettingsPopup}
          onCloseReleaseScoreSettings={() => toggleReleaseGradePopUp(false)}
          updateReleaseScoreSettings={this.onUpdateReleaseScoreSettings}
          releaseScore={releaseScore}
        />
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
  currentAssignment: PropTypes.object.isRequired,
  toggleReleaseGradePopUp: PropTypes.func.isRequired,
  tests: PropTypes.array.isRequired,
  isShowReleaseSettingsPopup: PropTypes.bool.isRequired,
  districtId: PropTypes.string.isRequired,
  toggleAssignmentView: PropTypes.func.isRequired,
  isAdvancedView: PropTypes.bool.isRequired,
  orgData: PropTypes.object.isRequired
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
      currentAssignment: getCurrentAssignmentSelector(state),
      isShowReleaseSettingsPopup: getToggleReleaseGradeStateSelector(state),
      districtId: getDistrictIdSelector(state),
      isAdvancedView: getAssignmentViewSelector(state),
      userRole: getUserRole(state),
      defaultFilters: getAssignmentFilterSelector(state),
      orgData: get(state, "user.user.orgData", {})
    }),
    {
      loadAssignments: receiveAssignmentsAction,
      loadFolders: receiveFolderAction,
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      loadAssignmentById: receiveAssignmentByIdAction,
      updateReleaseScoreSettings: updateReleaseScoreSettingsAction,
      toggleReleaseGradePopUp: toggleReleaseScoreSettingsAction,
      setAssignmentFilters: setAssignmentFiltersAction,
      toggleAssignmentView: toggleAssignmentViewAction
    }
  )
);

export default enhance(Assignments);
