import { SpinLoader } from "@edulastic/common";
import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getInterestedCurriculumsSelector } from "../../../../src/selectors/user";
import StudentAssignmentModal from "../../../common/components/Popups/studentAssignmentModal";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { getStudentAssignments } from "../../../common/util";
import { getCsvDownloadingState } from "../../../ducks";
import { getFiltersSelector, getSelectedStandardProficiency } from "../common/filterDataDucks";
import { getMaxMasteryScore } from "../standardsPerformance/utils/transformers";
import { SignedStackBarChartContainer } from "./components/charts/signedStackBarChartContainer";
import { TableContainer, UpperContainer } from "./components/styled";
import { StandardsGradebookTable } from "./components/table/standardsGradebookTable";
import {
  getReportsStandardsGradebookLoader,
  getStandardsGradebookRequestAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction
} from "./ducks";
import { getDenormalizedData, getFilteredDenormalizedData, groupedByStandard } from "./utils/transformers";

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const StandardsGradebook = ({
  standardsGradebook,
  getStandardsGradebookRequest,
  isCsvDownloading,
  role,
  settings,
  loading,
  selectedStandardProficiency,
  filters,
  getStudentStandards,
  studentStandardData,
  loadingStudentStandard,
  location,
  pageTitle,
  ddfilter
}) => {
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
      const q = {
        testIds: settings.selectedTest.map(test => test.key).join(),
        ...settings.requestFilters
      };
      getStandardsGradebookRequest(q);
    }
  }, [settings]);

  const denormalizedData = useMemo(() => getDenormalizedData(standardsGradebook), [standardsGradebook]);

  const filteredDenormalizedData = useMemo(() => getFilteredDenormalizedData(denormalizedData, ddfilter, role), [
    denormalizedData,
    ddfilter,
    role
  ]);

  const onBarClickCB = key => {
    const _chartFilter = { ...chartFilter };
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
    getStudentStandards({ ...params, testIds: settings.selectedTest.map(test => test.key).join() });
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
        <SpinLoader position="fixed" />
      ) : (
        <>
          <UpperContainer>
            <StyledCard>
              <Row type="flex" justify="start">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <StyledH3>Mastery Level Distribution Standards</StyledH3>
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
              location={location}
              pageTitle={pageTitle}
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
      loading: getReportsStandardsGradebookLoader(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      isCsvDownloading: getCsvDownloadingState(state),
      selectedStandardProficiency: getSelectedStandardProficiency(state),
      filters: getFiltersSelector(state),
      studentStandardData: getStudentStandardData(state),
      loadingStudentStandard: getStudentStandardLoader(state)
    }),
    {
      getStandardsGradebookRequest: getStandardsGradebookRequestAction,
      getStudentStandards: getStudentStandardsAction
    }
  )
);

export default enhance(StandardsGradebook);

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
