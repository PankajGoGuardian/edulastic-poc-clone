import React, { useEffect, useState, useMemo, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import next from "immer";
import queryString from "query-string";

import { StyledH3, StyledCard } from "../../../common/styled";
import { FilterDropDownWithDropDown } from "../../../common/components/widgets/filterDropDownWithDropDown";
import StudentAssignmentModal from "../../../common/components/Popups/studentAssignmentModal";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { Placeholder } from "../../../common/components/loader";

import { UpperContainer, TableContainer } from "./components/styled";
import { SignedStackBarChartContainer } from "./components/charts/signedStackBarChartContainer";
import {
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters,
  getSelectedStandardProficiency,
  getFiltersSelector,
  getReportsStandardsBrowseStandards
} from "../common/filterDataDucks";

import {
  getStandardsGradebookRequestAction,
  getReportsStandardsGradebook,
  getReportsStandardsGradebookLoader,
  getStudentStandardsAction,
  getStudentStandardData,
  getStudentStandardLoader
} from "./ducks";

import { getCsvDownloadingState } from "../../../ducks";

import {
  getFilterDropDownData,
  getDenormalizedData,
  getFilteredDenormalizedData,
  groupedByStandard
} from "./utils/transformers";

import { getMaxMasteryScore } from "../standardsPerformance/utils/transformers";

import dropDownFormat from "./static/json/dropDownFormat.json";
import { getUserRole, getUser, getInterestedCurriculumsSelector } from "../../../../src/selectors/user";
import { StandardsGradebookTable } from "./components/table/standardsGradebookTable";
import { getStudentAssignments } from "../../../common/util";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  standardsGradebook,
  standardsFilters,
  getStandardsGradebookRequestAction,
  isCsvDownloading,
  role,
  user,
  settings,
  history,
  location,
  match,
  loading,
  selectedStandardProficiency,
  filters,
  getStudentStandardsAction,
  studentStandardData,
  loadingStudentStandard
}) => {
  const [ddfilter, setDdFilter] = useState({
    schoolId: "all",
    teacherId: "all",
    groupId: "all",
    gender: "all",
    frlStatus: "all",
    ellStatus: "all",
    iepStatus: "all",
    race: "all"
  });

  const [chartFilter, setChartFilter] = useState({});

  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(false);
  const [clickedStandard, setClickedStandard] = useState(undefined);
  const [clickedStudentName, setClickedStudentName] = useState(undefined);

  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(selectedStandardProficiency, studentStandardData),
    [selectedStandardProficiency, studentStandardData]
  );

  useEffect(() => {
    if (settings.requestFilters.termId && settings.requestFilters.domainIds) {
      let q = {
        testIds: settings.selectedTest.map(test => test.key).join(),
        ...settings.requestFilters
      };
      getStandardsGradebookRequestAction(q);
    }
  }, [settings]);

  const denormalizedData = useMemo(() => {
    return getDenormalizedData(standardsGradebook);
  }, [standardsGradebook]);

  const filteredDenormalizedData = useMemo(() => getFilteredDenormalizedData(denormalizedData, ddfilter, role), [
    denormalizedData,
    ddfilter,
    role
  ]);

  let filterDropDownData = dropDownFormat.filterDropDownData;
  filterDropDownData = useMemo(() => {
    let _standardsGradebook = get(standardsGradebook, "data.result", {});
    if (!isEmpty(_standardsGradebook)) {
      let ddTeacherInfo = _standardsGradebook.teacherInfo;
      let temp = next(dropDownFormat.filterDropDownData, arr => {});
      return getFilterDropDownData(ddTeacherInfo, role).concat(temp);
    } else {
      return dropDownFormat.filterDropDownData;
    }
  }, [standardsGradebook]);

  const filterDropDownCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      [comData]: selected.key
    });
  };

  const onBarClickCB = key => {
    let _chartFilter = { ...chartFilter };
    if (_chartFilter[key]) {
      delete _chartFilter[key];
    } else {
      _chartFilter[key] = true;
    }
    setChartFilter(_chartFilter);
  };

  const masteryScale = selectedStandardProficiency || {};
  const maxMasteryScore = getMaxMasteryScore(masteryScale);

  const standardsData = useMemo(() => groupedByStandard(filteredDenormalizedData, maxMasteryScore, masteryScale), [
    filteredDenormalizedData,
    maxMasteryScore,
    masteryScale
  ]);

  const handleOnClickStandard = (params, standard, studentName) => {
    getStudentStandardsAction({ ...params, testIds: settings.selectedTest.map(test => test.key).join() });
    setClickedStandard(standard);
    setStudentAssignmentModal(true);
    setClickedStudentName(studentName);
  };

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false);
    setClickedStandard(undefined);
    setClickedStudentName(undefined);
  };

  return (
    <div>
      {loading ? (
        <div>
          <Row type="flex">
            <Placeholder />
          </Row>
          <Row type="flex">
            <Placeholder />
          </Row>
        </div>
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StyledH3>Mastery Level Distribution Standards</StyledH3>
                </Col>
                <Col className="dropdown-container" xs={24} sm={24} md={12} lg={12} xl={12}>
                  <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={filterDropDownData} />
                </Col>
              </Row>
              <Row>
                <SignedStackBarChartContainer
                  filteredDenormalizedData={filteredDenormalizedData}
                  filters={ddfilter}
                  chartFilter={chartFilter}
                  masteryScale={masteryScale}
                  role={role}
                  onBarClickCB={onBarClickCB}
                />
              </Row>
            </StyledCard>
          </UpperContainer>
          <TableContainer>
            <StandardsGradebookTable
              filteredDenormalizedData={filteredDenormalizedData}
              masteryScale={masteryScale}
              chartFilter={chartFilter}
              isCsvDownloading={isCsvDownloading}
              role={role}
              filters={filters}
              handleOnClickStandard={handleOnClickStandard}
              standardsData={standardsData}
            />
          </TableContainer>
          {showStudentAssignmentModal && (
            <StudentAssignmentModal
              showModal={showStudentAssignmentModal}
              closeModal={closeStudentAssignmentModal}
              studentAssignmentsData={studentAssignmentsData}
              studentName={clickedStudentName}
              standardName={clickedStandard}
              loadingStudentStandard={loadingStudentStandard}
            />
          )}
        </>
      )}
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      standardsGradebook: getReportsStandardsGradebook(state),
      standardsFilters: getReportsStandardsFilters(state),
      loading: getReportsStandardsGradebookLoader(state),
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      isCsvDownloading: getCsvDownloadingState(state),
      selectedStandardProficiency: getSelectedStandardProficiency(state),
      filters: getFiltersSelector(state),
      studentStandardData: getStudentStandardData(state),
      loadingStudentStandard: getStudentStandardLoader(state)
    }),
    {
      getStandardsGradebookRequestAction: getStandardsGradebookRequestAction,
      getStandardsFiltersRequestAction,
      getStudentStandardsAction
    }
  )
);

export default enhance(StandardsGradebook);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
