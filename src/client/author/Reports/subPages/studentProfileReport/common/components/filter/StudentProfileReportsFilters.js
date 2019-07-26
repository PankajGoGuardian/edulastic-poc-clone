import React, { useEffect, useMemo, useState } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { Row, Col, AutoComplete } from "antd";
import { get, find, groupBy, map } from "lodash";
import { StyledFilterWrapper, PrintablePrefix, StyledGoButton } from "../../../../../common/styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import StudentAutoComplete from "./StudentAutoComplete";
import { getUserRole, getOrgDataSelector } from "../../../../../../src/selectors/user";
import { receiveStudentsListAction, getStudentsListSelector } from "../../../../../../Student/ducks.js";
import {
  getFiltersSelector,
  getStudentSelector,
  getReportsPrevSPRFilterData,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData
} from "../../filterDataDucks";
import { getFilterOptions } from "../../utils/transformers";

const StudentProfileReportsFilters = ({
  style,
  className,
  onGoClick,
  SARFilterData,
  location,
  loading,
  orgData,
  studentList,
  getSPRFilterDataRequestAction,
  receiveStudentsListAction
}) => {
  const [termId, setTermId] = useState(orgData.defaultTermId);
  const [courseId, setCourseId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState({ key: "" });

  const { studentClassData = [] } = get(SARFilterData, "data.result", {});
  const { terms = [] } = orgData;
  const { termOptions = [], courseOptions = [] } = useMemo(() => getFilterOptions(studentClassData, terms), [
    SARFilterData,
    terms
  ]);
  const studentOptions = useMemo(() => map(studentList, student => `${student.firstName} ${student.lastName}`), [
    studentList
  ]);

  const selectedTerm = useMemo(() => find(termOptions, term => term.key === termId) || termOptions[0] || {}, [
    termId,
    termOptions
  ]);

  const selectedCourse = useMemo(
    () => find(courseOptions, course => course.key === courseId) || courseOptions[0] || {},
    [courseId, courseOptions]
  );

  useEffect(() => {
    const splittedPath = location.pathname.split("/");
    const studentId = splittedPath[splittedPath.length - 1];

    const parsedQuery = qs.parse(location.search);
    const { termId, courseId } = parsedQuery;

    if (studentId) {
      setTermId(termId);
      setCourseId(courseId);
      setSelectedStudent({ key: studentId });
    }
  }, []);

  useEffect(() => {
    if (studentClassData.length) {
      // if there is no student name for the selected name extract it from the class data
      if (!selectedStudent.title) {
        const classRecord = studentClassData[0];
        setSelectedStudent({
          ...selectedStudent,
          title: `${classRecord.firstName} ${classRecord.lastName}`
        });
      }
    }
  }, [studentClassData]);

  useEffect(() => {
    if (selectedStudent.key) {
      const q = {
        termId,
        studentId: selectedStudent.key
      };
      getSPRFilterDataRequestAction(q);
      onGoClick({ requestFilters: { termId, courseId }, selectedStudent });
    }
  }, [selectedStudent.key]);

  const onFilterApply = () => onGoClick({ requestFilters: { termId, courseId }, selectedStudent });
  const onUpdateTerm = ({ key }) => setTermId(key);
  const onUpdateCourse = ({ key }) => setCourseId(key);
  const onStudentSelect = item => setSelectedStudent(item);

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
        <Row type="flex" className="single-assessment-report-top-filter">
          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <StudentAutoComplete selectCB={onStudentSelect} selectedStudent={selectedStudent} />
          </Col>
          <Col xs={12} sm={12} md={7} lg={7} xl={7}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <ControlDropDown
              by={selectedTerm}
              selectCB={onUpdateTerm}
              data={termOptions}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <PrintablePrefix>Subject</PrintablePrefix>
            <ControlDropDown
              by={selectedCourse}
              selectCB={onUpdateCourse}
              data={courseOptions}
              prefix="Courses"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={1} lg={1} xl={1}>
            <StyledGoButton type="primary" onClick={onFilterApply}>
              Go
            </StyledGoButton>
          </Col>
        </Row>
      </StyledFilterWrapper>
    </div>
  );
};

const enhance = connect(
  state => ({
    SARFilterData: getReportsSPRFilterData(state),
    filters: getFiltersSelector(state),
    student: getStudentSelector(state),
    role: getUserRole(state),
    prevSARFilterData: getReportsPrevSPRFilterData(state),
    loading: getReportsSPRFilterLoadingState(state),
    orgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state)
  }),
  {
    getSPRFilterDataRequestAction,
    receiveStudentsListAction,
    setFiltersAction
  }
);

export default enhance(StudentProfileReportsFilters);
