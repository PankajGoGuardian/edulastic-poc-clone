import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { get, filter } from "lodash";
import { Row, Col, Icon } from "antd";
import { StyledCard } from "../../../common/styled";
import { Placeholder } from "../../../common/components/loader";
import StudentAssignmentModal from "../../../common/components/Popups/studentAssignmentModal";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import StudentMasteryTable from "./common/components/table/StudentMasteryTable";
import StudentPerformanceSummary from "./common/components/table/StudentPerformanceSummary";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction,
  getStudentStandardsAction,
  getStudentStandardData,
  getStudentStandardLoader
} from "./ducks";
import { getCsvDownloadingState } from "../../../ducks";
import {
  getReportsSPRFilterData,
  getSelectedStandardProficiency,
  getFiltersSelector,
  getStudentSelector
} from "../common/filterDataDucks";
import { useGetStudentMasteryData } from "../common/hooks";
import { getDomainOptions } from "./common/utils/transformers";
import { toggleItem, downloadCSV, getStudentAssignments } from "../../../common/util";
import { getGrades, getStudentName } from "../common/utils/transformers";

const usefilterRecords = (records, domain) => {
  return useMemo(() => filter(records, record => domain === "All" || record.domainId === domain), [records, domain]);
};

const getTooltip = payload => {
  if (payload && payload.length) {
    const { masteryName = "", percentage = 0 } = payload[0].payload;
    return (
      <div>
        <BarTooltipRow title={`${masteryName} : `} value={`${percentage}%`} />
      </div>
    );
  }
  return false;
};

const StudentMasteryProfile = ({
  match,
  settings,
  loading,
  SPRFilterData,
  isCsvDownloading,
  studentMasteryProfile,
  getStudentMasteryProfileRequestAction,
  selectedStandardProficiency,
  filters,
  getStudentStandardsAction,
  studentStandardData,
  selectedStudent,
  loadingStudentStandard
}) => {
  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(studentMasteryProfile, "data.result", {});
  const scaleInfo = selectedStandardProficiency;

  const [selectedDomain, setSelectedDomain] = useState({ key: "All", title: "All" });
  const [selectedMastery, setSelectedMastery] = useState([]);

  const studentAssignmentsData = useMemo(() => getStudentAssignments(scaleInfo, studentStandardData), [
    scaleInfo,
    studentStandardData
  ]);

  const [studentStandards, studentDomains] = useGetStudentMasteryData(metricInfo, skillInfo, scaleInfo);

  const filteredStandards = usefilterRecords(studentStandards, selectedDomain.key);
  const filteredDomains = usefilterRecords(studentDomains, selectedDomain.key);
  const domainOptions = getDomainOptions(studentDomains);

  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(false);
  const [clickedStandard, setClickedStandard] = useState(undefined);

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
      getStudentMasteryProfileRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  useEffect(() => {
    setSelectedMastery([]);
  }, [selectedDomain.key]);

  const onDomainSelect = (_, selected) => setSelectedDomain(selected);
  const onSectionClick = item => setSelectedMastery(toggleItem(selectedMastery, item.masteryLabel));

  if (loading) {
    return (
      <>
        <Placeholder />
        <Placeholder />
        <Placeholder />
      </>
    );
  }

  const studentInformation = studInfo[0] || {};
  const studentName = getStudentName(selectedStudent, studentInformation);

  const onCsvConvert = data =>
    downloadCSV(`Standard Performance Details-${studentName}-${studentInformation.subject}.csv`, data);

  const handleOnClickStandard = (params, standard) => {
    getStudentStandardsAction(params);
    setClickedStandard(standard);
    setStudentAssignmentModal(true);
  };

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false);
    setClickedStandard(undefined);
  };

  return (
    <>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
            <StyledIcon type="user" />
          </Col>
          <Col xs={24} sm={24} md={5} lg={5} xl={5}>
            <p>
              <b>Name</b>: {studentName}
            </p>
            <p>
              <b>Grade</b>: {getGrades(studentInformation.grades)}
            </p>
            <p>
              <b>Subject</b>: {studentInformation.subject}
            </p>
          </Col>
          <DropdownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
            <StyledLabel>Domain(s)</StyledLabel>
            <ControlDropDown
              showPrefixOnSelected={false}
              by={selectedDomain}
              selectCB={onDomainSelect}
              data={domainOptions}
              prefix="Domain(s)"
            />
          </DropdownContainer>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={8} lg={11} xl={8}>
            <StudentPerformancePie
              selectedMastery={selectedMastery}
              data={filteredStandards}
              scaleInfo={scaleInfo}
              onSectionClick={onSectionClick}
              getTooltip={getTooltip}
            />
          </Col>
          <Col xs={24} sm={24} md={16} lg={13} xl={16}>
            <StudentPerformanceSummary data={filteredDomains} selectedMastery={selectedMastery} />
          </Col>
        </Row>
      </StyledCard>
      <StudentMasteryTable
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={filteredStandards}
        selectedMastery={selectedMastery}
        handleOnClickStandard={handleOnClickStandard}
        filters={filters}
      />
      {showStudentAssignmentModal && (
        <StudentAssignmentModal
          showModal={showStudentAssignmentModal}
          closeModal={closeStudentAssignmentModal}
          studentAssignmentsData={studentAssignmentsData}
          studentName={studentName}
          standardName={clickedStandard}
          loadingStudentStandard={loadingStudentStandard}
        />
      )}
    </>
  );
};

const enhance = connect(
  state => ({
    studentMasteryProfile: getReportsStudentMasteryProfile(state),
    SPRFilterData: getReportsSPRFilterData(state),
    loading: getReportsStudentMasteryProfileLoader(state),
    isCsvDownloading: getCsvDownloadingState(state),
    selectedStandardProficiency: getSelectedStandardProficiency(state),
    filters: getFiltersSelector(state),
    studentStandardData: getStudentStandardData(state),
    selectedStudent: getStudentSelector(state),
    loadingStudentStandard: getStudentStandardLoader(state)
  }),
  {
    getStudentMasteryProfileRequestAction,
    getStudentStandardsAction
  }
);

export default enhance(StudentMasteryProfile);

const StyledIcon = styled(Icon)`
  font-size: 45px;
`;

const DropdownContainer = styled(Col)`
  .control-dropdown {
    .ant-btn {
      width: 100%;
    }
  }
`;

const StyledLabel = styled.span`
  padding: 5px;
  font-weight: 600;
`;
