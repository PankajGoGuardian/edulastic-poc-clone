import { secondaryTextColor, themeColor, themeColorLighter } from "@edulastic/colors";
import { SpinLoader, FlexContainer } from "@edulastic/common";
import { IconCollapse2 } from "@edulastic/icons";
import { Avatar, Button } from "antd";
import { filter, get } from "lodash";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import StudentAssignmentModal from "../../../common/components/Popups/studentAssignmentModal";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import { StyledCard } from "../../../common/styled";
import { downloadCSV, getStudentAssignments, toggleItem } from "../../../common/util";
import { getCsvDownloadingState } from "../../../ducks";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import {
  getFiltersSelector,
  getReportsSPRFilterData,
  getSelectedStandardProficiency,
  getStudentSelector
} from "../common/filterDataDucks";
import { useGetStudentMasteryData } from "../common/hooks";
import { getGrades, getStudentName } from "../common/utils/transformers";
import StudentPerformanceSummary from "./common/components/table/StudentPerformanceSummary";
import { getDomainOptions } from "./common/utils/transformers";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction
} from "./ducks";

const usefilterRecords = (records, domain) =>
  // Note: record.domainId could be integer or string
  useMemo(() => filter(records, record => domain === "All" || String(record.domainId) === domain), [records, domain]);

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
  settings,
  loading,
  SPRFilterData,
  isCsvDownloading,
  studentMasteryProfile,
  getStudentMasteryProfileRequest,
  selectedStandardProficiency,
  filters,
  getStudentStandards,
  studentStandardData,
  selectedStudent,
  loadingStudentStandard,
  t
}) => {
  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(studentMasteryProfile, "data.result", {});
  const scaleInfo = selectedStandardProficiency;

  const studentClassData = SPRFilterData?.data?.result?.studentClassData || [];
  const studentClassInformation = studentClassData[0] || {};

  const [selectedDomain, setSelectedDomain] = useState({ key: "All", title: "All" });
  const [selectedMastery, setSelectedMastery] = useState([]);
  const [expandRows, setExpandRows] = useState(false);

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
    const { selectedStudent: _selectedStudent, requestFilters } = settings;
    if (_selectedStudent.key && requestFilters.termId) {
      getStudentMasteryProfileRequest({
        ...requestFilters,
        studentId: _selectedStudent.key
      });
    }
  }, [settings]);

  useEffect(() => {
    setSelectedMastery([]);
  }, [selectedDomain.key]);

  const onDomainSelect = (_, selected) => setSelectedDomain(selected);
  const onSectionClick = item => setSelectedMastery(toggleItem(selectedMastery, item.masteryLabel));

  if (loading) {
    return <SpinLoader position="fixed" />;
  }

  const studentInformation = studInfo[0] || {};
  const studentName = getStudentName(selectedStudent, studentInformation);

  const anonymousString = t("common.anonymous");

  const onCsvConvert = data =>
    downloadCSV(
      `Standard Performance Details-${studentName || anonymousString}-${studentInformation.subject}.csv`,
      data
    );

  const handleOnClickStandard = (params, standard) => {
    getStudentStandards(params);
    setClickedStandard(standard);
    setStudentAssignmentModal(true);
  };

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false);
    setClickedStandard(undefined);
  };

  return (
    <>
      <FlexContainer alignItems="stretch" marginBottom="20px">
        <ReStyledCard flex={1}>
          <FlexContainer justifyContent="flex-start">
            <FlexContainer justifyContent="center" mt="20px" width="180px">
              {studentInformation.thumbnail ? (
                <StyledAatar size={150} src={studentInformation.thumbnail} />
              ) : (
                <StyledAatar size={150} icon="user" />
              )}
            </FlexContainer>
            <FlexContainer flexDirection="column" alignItems="flex-start">
              <StyledP marginTop="30px">
                <StyledName>{studentName || anonymousString}</StyledName>
              </StyledP>
              <StyledP marginTop="12px">
                <StyledText weight="Bold"> Grade: </StyledText>
                <StyledText>{getGrades(studentInformation.grades)}</StyledText>
              </StyledP>
              <StyledP>
                <StyledText weight="Bold"> Subject: </StyledText>
                <StyledText>{studentClassInformation.standardSet}</StyledText>
              </StyledP>
            </FlexContainer>
          </FlexContainer>
        </ReStyledCard>
        <ReStyledCard maxW="300px" ml="20px">
          <StudentPerformancePie
            selectedMastery={selectedMastery}
            data={filteredStandards}
            scaleInfo={scaleInfo}
            onSectionClick={onSectionClick}
            getTooltip={getTooltip}
          />
        </ReStyledCard>
      </FlexContainer>

      <ReStyledCard>
        <FilterRow justifyContent="space-between">
          <DropdownContainer>
            <ControlDropDown
              showPrefixOnSelected={false}
              by={selectedDomain}
              selectCB={onDomainSelect}
              data={domainOptions}
              prefix="Domain(s)"
            />
          </DropdownContainer>
          <StyledButton onClick={() => setExpandRows(!expandRows)}>
            <IconCollapse2 color={themeColor} width={12} height={12} />
            <span className="button-label">{expandRows ? "COLLAPSE" : "EXPAND"} ROWS</span>
          </StyledButton>
        </FilterRow>
        <StudentPerformanceSummary
          data={filteredDomains}
          selectedMastery={selectedMastery}
          expandedRowProps={{
            onCsvConvert,
            isCsvDownloading,
            data: filteredStandards,
            selectedMastery,
            handleOnClickStandard,
            filters,
            termId: settings.requestFilters.termId
          }}
          expandAllRows={expandRows}
          setExpandAllRows={flag => setExpandRows(flag)}
        />
      </ReStyledCard>

      {showStudentAssignmentModal && (
        <StudentAssignmentModal
          showModal={showStudentAssignmentModal}
          closeModal={closeStudentAssignmentModal}
          studentAssignmentsData={studentAssignmentsData}
          studentName={studentName || anonymousString}
          standardName={clickedStandard}
          loadingStudentStandard={loadingStudentStandard}
        />
      )}
    </>
  );
};

const withConnect = connect(
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
    getStudentMasteryProfileRequest: getStudentMasteryProfileRequestAction,
    getStudentStandards: getStudentStandardsAction
  }
);

export default compose(
  withConnect,
  withNamespaces("student")
)(StudentMasteryProfile);

const StyledAatar = styled(Avatar)`
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`;

const FilterRow = styled(FlexContainer)`
  @media print {
    display: none;
  }
`;

const ReStyledCard = styled(StyledCard)`
  margin: 0px;
  padding: 20px;
  border: 1px solid #dadae4;
  max-width: ${({ maxW }) => maxW};
  flex: ${({ flex }) => flex};
  margin-left: ${({ ml }) => ml};
`;

const StyledP = styled.p`
  margin-top: ${props => props.marginTop || "10px"};
  margin-left: 20px;
  margin-right: 20px;
`;

const StyledText = styled.span`
  text-align: left;
  letter-spacing: 0.24px;
  font: 13px/18px Open Sans;
  font-weight: ${props => props.weight || 600};
  color: ${secondaryTextColor};
`;

const StyledName = styled.span`
  padding-top: 20px;
  color: ${themeColorLighter};
  text-align: left;
  letter-spacing: 0.33px;
  font: Bold 18px/24px Open Sans;
`;

const DropdownContainer = styled.div`
  .control-dropdown {
    .ant-btn {
      width: 100%;
    }
  }
`;

const StyledButton = styled(Button)`
  float: right;
  margin: 5px;
  padding-left: 8px;
  padding-right: 0px;
  text-align: center;
  font: 11px/15px Open Sans;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${themeColor};
  border-color: ${themeColor};
  &:hover {
    color: ${themeColor};
  }
  &:focus {
    color: ${themeColor};
  }
  .button-label {
    padding: 0px 20px;
  }
`;
