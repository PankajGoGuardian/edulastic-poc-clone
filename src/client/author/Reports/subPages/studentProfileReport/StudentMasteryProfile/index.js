import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { get, filter, includes, map } from "lodash";
import { Row, Col, Icon } from "antd";
import { Pie, PieChart, Cell } from "recharts";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { Placeholder } from "../../../common/components/loader";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import StudentMasteryTable from "./common/components/table/StudentMasteryTable";
import StudentPerformanceSummary from "./common/components/table/StudentPerformanceSummary";
import StudentPerformancePie from "../common/components/charts/StudentPerformancePie";
import BarTooltipRow from "../../../common/components/tooltip/BarTooltipRow";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction
} from "./ducks";
import { getCsvDownloadingState } from "../../../ducks";
import { getReportsSPRFilterData } from "../common/filterDataDucks";
import { augmentStandardMetaInfo } from "../common/utils/transformers.js";
import { useGetStudentMasteryData } from "../common/hooks";
import { getDomainOptions } from "./common/utils/transformers";
import { toggleItem, downloadCSV } from "../../../common/util";
import { getGrades } from "../common/utils/transformers";

const usefilterRecords = (records, domain) => {
  return useMemo(() => filter(records, record => domain == "All" || record.domainId == domain), [records, domain]);
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
  SARFilterData,
  isCsvDownloading,
  studentMasteryProfile,
  getStudentMasteryProfileRequestAction
}) => {
  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(studentMasteryProfile, "data.result", {});
  const { scaleInfo = [] } = get(SARFilterData, "data.result", {});
  const { selectedStudent = {} } = settings;

  const [selectedDomain, setSelectedDomain] = useState({ key: "All", title: "All" });
  const [selectedMastery, setSelectedMastery] = useState([]);

  const [studentStandards, studentDomains] = useGetStudentMasteryData(metricInfo, skillInfo, scaleInfo);

  const filteredStandards = usefilterRecords(studentStandards, selectedDomain.key);
  const filteredDomains = usefilterRecords(studentDomains, selectedDomain.key);
  const domainOptions = getDomainOptions(studentDomains);

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

  const onCsvConvert = data =>
    downloadCSV(`Standard Performance Details-${selectedStudent.title}-${studentInformation.subject}.csv`, data);

  return (
    <>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
            <StyledIcon type="user" />
          </Col>
          <Col xs={24} sm={24} md={5} lg={5} xl={5}>
            <p>
              <b>Name</b>: {selectedStudent.title}
            </p>
            <p>
              <b>Grade</b>: {getGrades(studentInformation.grades)}
            </p>
            <p>
              <b>Subject</b>: {studentInformation.subject}
            </p>
          </Col>
          <DropdownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
            <ControlDropDown by={selectedDomain} selectCB={onDomainSelect} data={domainOptions} prefix="Domain(s) - " />
          </DropdownContainer>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <StudentPerformancePie
              selectedMastery={selectedMastery}
              data={filteredStandards}
              scaleInfo={scaleInfo}
              onSectionClick={onSectionClick}
              getTooltip={getTooltip}
            />
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <StudentPerformanceSummary data={filteredDomains} selectedMastery={selectedMastery} />
          </Col>
        </Row>
      </StyledCard>
      <StudentMasteryTable
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        data={filteredStandards}
        selectedMastery={selectedMastery}
      />
    </>
  );
};

const enhance = connect(
  state => ({
    studentMasteryProfile: getReportsStudentMasteryProfile(state),
    SARFilterData: getReportsSPRFilterData(state),
    loading: getReportsStudentMasteryProfileLoader(state),
    isCsvDownloading: getCsvDownloadingState(state)
  }),
  {
    getStudentMasteryProfileRequestAction
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
