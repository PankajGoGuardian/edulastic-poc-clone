import React, { useEffect, useMemo, useState } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { Row, Col } from "antd";
import { get, find, groupBy } from "lodash";
import { StyledFilterWrapper, PrintablePrefix, StyledGoButton } from "../../../../../common/styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import { getUserRole } from "../../../../../../src/selectors/user";
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
import { getStandardsBrowseStandardsRequestAction } from "../../../../standardsMasteryReport/common/filterDataDucks";

const StudentProfileReportsFilters = ({
  style,
  className,
  onGoClick,
  SARFilterData,
  location,
  loading,
  getSPRFilterDataRequestAction,
  getStandardsBrowseStandardsRequestAction
}) => {
  const [termId, setTermId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState({ key: "5d11b3a138a00c59ea7be6db" });

  const { studentClassData = [] } = get(SARFilterData, "data.result", {});
  const { termOptions = [], courseOptions = [] } = useMemo(() => {
    return getFilterOptions(studentClassData);
  }, [SARFilterData]);

  const selectedTerm = useMemo(() => find(termOptions, term => term.key === termId) || termOptions[0] || {}, [
    termId,
    termOptions
  ]);

  const selectedCourse = useMemo(
    () => find(courseOptions, course => course.key === courseId) || courseOptions[0] || {},
    [courseId, courseOptions]
  );

  useEffect(() => {
    if (studentClassData.length) {
      const groupedGrades = groupBy(studentClassData, "grades");

      const q = {
        curriculumId: "4f9d3dc42b3fdb5c48389ed1",
        grades: Object.keys(groupedGrades)
      };

      getStandardsBrowseStandardsRequestAction(q);
    }
  }, [studentClassData]);

  useEffect(() => {
    const parsedQuery = qs.parse(location.search);
    const { termId, courseId } = parsedQuery;

    if (termId || courseId) {
      setTermId(termId);
      setCourseId(courseId);
      onGoClick({ requestFilters: parsedQuery, selectedStudent });
    }
  }, []);

  const fetchFilters = () => {
    const q = {
      termId,
      courseId,
      studentId: selectedStudent.key
    };
    getSPRFilterDataRequestAction(q);
  };

  useEffect(() => {
    fetchFilters();
  }, [selectedStudent.key, termId]);

  const onFilterApply = () => {
    onGoClick({ requestFilters: { termId, courseId }, selectedStudent });
  };

  const onUpdateTerm = ({ key }) => setTermId(key);
  const onUpdateCourse = ({ key }) => setCourseId(key);

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
        <Row type="flex" className="single-assessment-report-top-filter">
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <ControlDropDown
              by={selectedTerm}
              selectCB={onUpdateTerm}
              data={termOptions}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Subject</PrintablePrefix>
            <ControlDropDown
              by={selectedCourse}
              selectCB={onUpdateCourse}
              data={courseOptions}
              prefix="Courses"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col>
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
    loading: getReportsSPRFilterLoadingState(state)
  }),
  {
    getSPRFilterDataRequestAction,
    getStandardsBrowseStandardsRequestAction,
    setFiltersAction
  }
);

export default enhance(StudentProfileReportsFilters);
