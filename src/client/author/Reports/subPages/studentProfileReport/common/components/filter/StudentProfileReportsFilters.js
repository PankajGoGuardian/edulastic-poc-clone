import React, { useEffect, useMemo, useState, useRef } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import { Row, Col, AutoComplete } from "antd";
import { get, find, groupBy, map, isEmpty } from "lodash";
import { StyledFilterWrapper, PrintablePrefix, StyledGoButton } from "../../../../../common/styled";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import StudentAutoComplete from "./StudentAutoComplete";
import { getUserRole, getOrgDataSelector } from "../../../../../../src/selectors/user";
import { receiveStudentsListAction, getStudentsListSelector } from "../../../../../../Student/ducks.js";
import {
  getFiltersSelector,
  getStudentSelector,
  getReportsPrevSPRFilterData,
  setPrevSPRFilterDataAction,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData,
  setPbIdAction,
  setSpIdAction,
  setStudentAction
} from "../../filterDataDucks";
import { getFilterOptions } from "../../utils/transformers";
import { getFullNameFromAsString } from "../../../../../../../common/utils/helpers";

const StudentProfileReportsFilters = ({
  style,
  className,
  onGoClick: _onGoClick,
  SPRFilterData,
  prevSPRFilterData,
  location,
  loading,
  orgData,
  studentList,
  getSPRFilterDataRequestAction,
  setPrevSPRFilterDataAction,
  receiveStudentsListAction,
  filters,
  student,
  performanceBandRequired,
  standardProficiencyRequired,
  setFiltersAction,
  setStudentAction,
  setPerformanceBand,
  setStandardsProficiency
}) => {
  const firstPlot = useRef(true);
  const splittedPath = location.pathname.split("/");
  const urlStudentId = splittedPath[splittedPath.length - 1];
  const parsedQuery = queryString.parse(location.search);

  const {
    termId: urlTermId,
    courseId: urlCourseId,
    performanceBandProfileId: urlPerformanceBandProfileId,
    standardsProficiencyProfileId: urlStandardsProficiencyProfileId
  } = parsedQuery;

  const { studentClassData = [] } = get(SPRFilterData, "data.result", {});
  const { terms = [] } = orgData;
  const { termOptions = [], courseOptions = [] } = useMemo(() => getFilterOptions(studentClassData, terms), [
    SPRFilterData,
    terms
  ]);
  const selectedTerm = useMemo(() => find(termOptions, term => term.key === urlTermId) || termOptions[0] || {}, [
    termOptions
  ]);
  const selectedCourse = useMemo(
    () => find(courseOptions, course => course.key === urlCourseId) || courseOptions[0] || {},
    [courseOptions]
  );

  const profiles = get(SPRFilterData, "data.result.bandInfo", []);
  const scales = get(SPRFilterData, "data.result.scaleInfo", []);
  const standardProficiencyList = useMemo(() => scales.map(s => ({ key: s._id, title: s.name })), [scales]);
  const selectedProfile = useMemo(() => find(profiles, item => item._id === urlPerformanceBandProfileId), [profiles]);
  const selectedScale = useMemo(() => find(scales, item => item._id === urlStandardsProficiencyProfileId), [scales]);

  useEffect(() => {
    if (SPRFilterData !== prevSPRFilterData) {
      if (urlStudentId && urlTermId) {
        const q = {
          termId: urlTermId,
          studentId: urlStudentId
        };
        getSPRFilterDataRequestAction(q);
        setStudentAction({ key: urlStudentId });
      }
    }
  }, []);

  if (SPRFilterData !== prevSPRFilterData && !isEmpty(SPRFilterData)) {
    setPrevSPRFilterDataAction(SPRFilterData);

    if (studentClassData.length) {
      // if there is no student name for the selected name extract it from the class data
      if (!student.title) {
        const classRecord = studentClassData[0];
        setStudentAction({
          ...student,
          title: getFullNameFromAsString(classRecord)
        });
      }

      let _filters = {
        ...filters,
        termId: selectedTerm.key,
        courseId: selectedCourse.key
        // uncomment after making changes to chart files
        // performanceBandProfileId: selectedProfile,
        // standardsProficiencyProfileId: selectedScale
      };
      let _student = { ...student };
      setFiltersAction(_filters);

      if (firstPlot.current) {
        _onGoClick({ filters: { ..._filters }, selectedStudent: _student });
      }
    }

    firstPlot.current = false;
  }

  const onStudentSelect = item => {
    if (item && item.key) {
      setStudentAction(item);

      const q = {
        termId: filters.termId,
        studentId: item.key
      };
      getSPRFilterDataRequestAction(q);

      _onGoClick({ filters: { ...filters }, selectedStudent: item });
    }
  };

  const onUpdateTerm = ({ key }) => {
    let obj = {
      ...filters,
      termId: key
    };
    setFiltersAction(obj);
  };
  const onUpdateCourse = ({ key }) => {
    let obj = {
      ...filters,
      courseId: key
    };
    setFiltersAction(obj);
  };

  const onChangePerformanceBand = ({ key }) => setPerformanceBand(key);
  const onChangeStandardsProficiency = ({ key }) => setStandardsProficiency(key);

  const onGoClick = () => {
    let settings = {
      filters: { ...filters },
      selectedStudent: student
    };
    _onGoClick(settings);
  };

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
        <Row type="flex" className="single-assessment-report-top-filter">
          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <StudentAutoComplete selectCB={onStudentSelect} selectedStudent={student} />
          </Col>
          <Col xs={12} sm={12} md={7} lg={7} xl={7}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <ControlDropDown
              by={filters.termId}
              selectCB={onUpdateTerm}
              data={termOptions}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={8} xl={8}>
            <PrintablePrefix>Subject</PrintablePrefix>
            <ControlDropDown
              by={filters.courseId}
              selectCB={onUpdateCourse}
              data={courseOptions}
              prefix="Courses"
              showPrefixOnSelected={false}
            />
          </Col>
          {performanceBandRequired ? (
            <Col xs={12} sm={12} md={8} lg={4} xl={4}>
              <ControlDropDown
                by={filters.performanceBandProfileId}
                selectCB={onChangePerformanceBand}
                data={profiles.map(p => ({ key: p._id, title: p.name }))}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </Col>
          ) : null}
          {standardProficiencyRequired && (
            <Col xs={12} sm={12} md={8} lg={4} xl={4}>
              <PrintablePrefix>Standard Proficiency</PrintablePrefix>
              <ControlDropDown
                by={filters.standardsProficiencyProfileId}
                selectCB={onChangeStandardsProficiency}
                data={standardProficiencyList}
                prefix="Standard Proficiency"
                showPrefixOnSelected={false}
              />
            </Col>
          )}
          <Col xs={12} sm={12} md={1} lg={1} xl={1} style={{ padding: "5px" }}>
            <StyledGoButton type="primary" onClick={onGoClick}>
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
    SPRFilterData: getReportsSPRFilterData(state),
    filters: getFiltersSelector(state),
    student: getStudentSelector(state),
    role: getUserRole(state),
    prevSPRFilterData: getReportsPrevSPRFilterData(state),
    loading: getReportsSPRFilterLoadingState(state),
    orgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state)
  }),
  {
    getSPRFilterDataRequestAction,
    setPrevSPRFilterDataAction,
    receiveStudentsListAction,
    setFiltersAction,
    setStudentAction,
    setPerformanceBand: setPbIdAction,
    setStandardsProficiency: setSpIdAction
  }
);

export default enhance(StudentProfileReportsFilters);
