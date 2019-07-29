import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { get, filter } from "lodash";
import { Row, Col, Icon } from "antd";
import { Pie, PieChart, Cell } from "recharts";
import { StyledCard, StyledH3 } from "../../../common/styled";
import { Placeholder } from "../../../common/components/loader";
import { ControlDropDown } from "../../../common/components/widgets/controlDropDown";
import StudentMasteryTable from "./common/components/table/StudentMasteryTable";
import StudentPerformanceSummary from "./common/components/table/StudentPerformanceSummary";
import StudentPerformancePie from "./common/components/chart/StudentPerformancePie";
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction
} from "./ducks";
import { getReportsSPRFilterData } from "../common/filterDataDucks";
import { getDomains, getDomainOptions } from "./common/utils/transformers";

const StudentMasteryProfile = ({
  match,
  settings,
  loading,
  SARFilterData,
  studentMasteryProfile,
  getStudentMasteryProfileRequestAction
}) => {
  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(studentMasteryProfile, "data.result", {});
  const { scaleInfo = [] } = get(SARFilterData, "data.result", {});
  const { selectedStudent = {} } = settings;

  const [selectedDomain, setSelectedDomain] = useState({ key: "All", title: "All" });

  const [studentDomains, studentStandards] = useMemo(() => {
    return getDomains(metricInfo, skillInfo, scaleInfo);
  }, [metricInfo, skillInfo, scaleInfo]);

  const filteredStandards = useMemo(() => {
    if (selectedDomain.key == "All") {
      return studentStandards;
    } else {
      return filter(studentStandards, standard => standard.domainId === selectedDomain.key);
    }
  }, [selectedDomain.key, studentStandards]);

  const filteredDomains = useMemo(() => {
    if (selectedDomain.key == "All") {
      return studentDomains;
    } else {
      return filter(studentDomains, domain => domain.domainId === selectedDomain.key);
    }
  }, [selectedDomain.key, studentDomains]);

  useEffect(() => {
    const { selectedStudent, requestFilters } = settings;
    if (selectedStudent.key && requestFilters.termId) {
      getStudentMasteryProfileRequestAction({
        ...requestFilters,
        studentId: selectedStudent.key
      });
    }
  }, [settings]);

  const onDomainSelect = (_, selected) => setSelectedDomain(selected);

  const domainOptions = getDomainOptions(studentDomains);

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

  return (
    <>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
            <StyledIcon type="user" />
          </Col>
          <Col xs={24} sm={24} md={5} lg={5} xl={5}>
            <p>Name: {selectedStudent.title}</p>
            <p>Grade: {studentInformation.grades}</p>
            <p>Subject: {studentInformation.subject}</p>
          </Col>
          <DropdownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
            <ControlDropDown by={selectedDomain} selectCB={onDomainSelect} data={domainOptions} prefix="Domain(s) - " />
          </DropdownContainer>
        </Row>
      </StyledCard>
      <StyledCard>
        <Row type="flex">
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <StudentPerformancePie data={filteredStandards} scaleInfo={scaleInfo} />
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <StudentPerformanceSummary data={filteredDomains} />
          </Col>
        </Row>
      </StyledCard>
      <StudentMasteryTable data={filteredStandards} />
    </>
  );
};

const enhance = connect(
  state => ({
    studentMasteryProfile: getReportsStudentMasteryProfile(state),
    SARFilterData: getReportsSPRFilterData(state),
    loading: getReportsStudentMasteryProfileLoader(state)
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
