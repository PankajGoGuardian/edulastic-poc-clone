import React, { useEffect, useMemo } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import { get, find, isEmpty, pickBy } from "lodash";
import qs from "qs";

import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import StudentAutoComplete from "./StudentAutoComplete";
import ClassAutoComplete from "./ClassAutoComplete";
import { getUserRole, getOrgDataSelector, getCurrentTerm } from "../../../../../../src/selectors/user";
import { receiveStudentsListAction, getStudentsListSelector } from "../../../../../../Student/ducks";
import {
  getFiltersSelector,
  getSelectedClassSelector,
  getStudentSelector,
  getReportsPrevSPRFilterData,
  setPrevSPRFilterDataAction,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData,
  setSelectedClassAction,
  setStudentAction
} from "../../filterDataDucks";
import { getFilterOptions } from "../../utils/transformers";
import { getFullNameFromAsString } from "../../../../../../../common/utils/helpers";
import {
  StyledFilterWrapper,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel
} from "../../../../../common/styled";

import staticDropDownData from "../../../../singleAssessmentReport/common/static/staticDropDownData.json";

const { subjects: subjectOptions, grades: gradeOptions } = staticDropDownData;

const StudentProfileReportsFilters = ({
  style,
  onGoClick: _onGoClick,
  SPRFilterData,
  prevSPRFilterData,
  location,
  orgData,
  getSPRFilterDataRequest,
  setPrevSPRFilterData,
  filters,
  student,
  performanceBandRequired,
  standardProficiencyRequired,
  setFilters,
  setStudent,
  selectedClass,
  setSelectedClass,
  defaultTerm,
  history
}) => {
  const splittedPath = location.pathname.split("/");
  const urlStudentId = splittedPath[splittedPath.length - 1];
  const parsedQuery = queryString.parse(location.search);

  const { termId: urlTermId, courseId: urlCourseId, grade: urlGrade, subject: urlSubject } = parsedQuery;

  const { studentClassData = [] } = get(SPRFilterData, "data.result", {});
  const { terms = [] } = orgData;
  const { termOptions = [], courseOptions = [] } = useMemo(() => getFilterOptions(studentClassData, terms), [
    SPRFilterData,
    terms
  ]);
  const coursesForTerm = useMemo(() => courseOptions.filter(c => c.termId === filters.termId), [
    courseOptions,
    filters.termId
  ]);

  const defaultTermOption = useMemo(() => find(termOptions, term => term.key === defaultTerm), [
    termOptions,
    defaultTerm
  ]);

  const selectedTerm = useMemo(() => find(termOptions, term => term.key === urlTermId) || defaultTermOption || {}, [
    termOptions
  ]);
  const selectedCourse = useMemo(
    () => find(coursesForTerm, course => course.key === urlCourseId) || coursesForTerm[0] || {},
    [coursesForTerm]
  );

  const selectedGrade = useMemo(() => find(gradeOptions, g => g.key === urlGrade) || gradeOptions[0], [urlGrade]);

  const selectedSubject = useMemo(() => find(subjectOptions, s => s.key === urlSubject) || subjectOptions[0], [
    urlSubject
  ]);

  const selectedClasses = useMemo(() => (selectedClass.key ? [selectedClass.key] : []), [selectedClass]);

  const profiles = get(SPRFilterData, "data.result.bandInfo", []);
  const scales = get(SPRFilterData, "data.result.scaleInfo", []);
  const standardProficiencyList = useMemo(() => scales.map(s => ({ key: s._id, title: s.name })), [scales]);

  useEffect(() => {
    if (SPRFilterData !== prevSPRFilterData) {
      if (urlStudentId && urlTermId) {
        const q = {
          termId: urlTermId,
          studentId: urlStudentId
        };
        getSPRFilterDataRequest(q);
        setStudent({ key: urlStudentId });
      }
    }
  }, []);

  if (SPRFilterData !== prevSPRFilterData && !isEmpty(SPRFilterData)) {
    setPrevSPRFilterData(SPRFilterData);

    if (studentClassData.length) {
      // if there is no student name for the selected name extract it from the class data
      if (!student.title) {
        const classRecord = studentClassData[0];
        setStudent({
          ...student,
          title: getFullNameFromAsString(classRecord)
        });
      }
    }

    const _filters = {
      ...filters,
      termId: selectedTerm.key,
      courseId: selectedCourse.key,
      grade: selectedGrade.key,
      subject: selectedSubject.key
      // uncomment after making changes to chart files
      // performanceBandProfileId: selectedProfile,
      // standardsProficiencyProfileId: selectedScale
    };
    const _student = { ...student };
    setFilters(_filters);
    _onGoClick({ filters: _filters, selectedStudent: _student });
  }

  const onStudentSelect = item => {
    if (item && item.key) {
      setStudent(item);
      const _reportPath = splittedPath.slice(0, splittedPath.length - 1).join("/");
      const _filters = { ...filters, ...pickBy(parsedQuery, f => f !== "All" && !isEmpty(f)) };
      history.push(`${_reportPath}/${item.key}?${qs.stringify(_filters)}`);
      getSPRFilterDataRequest({
        termId: filters.termId,
        studentId: item.key
      });
    }
  };

  const handleFilterChange = (field, { key }) => {
    const obj = {
      ...filters,
      [field]: key
    };
    setFilters(obj);
    const settings = {
      filters: obj,
      selectedStudent: student
    };
    _onGoClick(settings);
  };

  const handleTermChange = ({ key }) => {
    const _coursesForTerm = courseOptions.filter(c => c.termId === key);
    const _course = find(_coursesForTerm, c => c.key === filters.courseId) || _coursesForTerm[0] || {};
    const obj = {
      ...filters,
      termId: key,
      courseId: _course.key
    };
    setFilters(obj);
    const settings = {
      filters: obj,
      selectedStudent: student
    };
    _onGoClick(settings);
  };

  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
      </GoButtonWrapper>
      <SearchField>
        <FilterLabel>School Year</FilterLabel>
        <ControlDropDown
          by={filters.termId}
          selectCB={handleTermChange}
          data={termOptions}
          prefix="School Year"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Course</FilterLabel>
        <ControlDropDown
          by={filters.courseId}
          selectCB={value => handleFilterChange("courseId", value)}
          data={coursesForTerm}
          prefix="Courses"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Grade</FilterLabel>
        <ControlDropDown
          by={filters.grade}
          selectCB={value => handleFilterChange("grade", value)}
          data={gradeOptions}
          prefix="Grade"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Subject</FilterLabel>
        <ControlDropDown
          by={filters.subject}
          selectCB={value => handleFilterChange("subject", value)}
          data={subjectOptions}
          prefix="Subject"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Class</FilterLabel>
        <ClassAutoComplete selectedClass={selectedClass} selectCB={setSelectedClass} />
      </SearchField>
      <SearchField>
        <FilterLabel>Student</FilterLabel>
        <StudentAutoComplete selectCB={onStudentSelect} selectedStudent={student} selectedClasses={selectedClasses} />
      </SearchField>
      {performanceBandRequired && (
        <SearchField>
          <FilterLabel>Performance Band</FilterLabel>
          <ControlDropDown
            by={filters.performanceBandProfileId}
            selectCB={value => handleFilterChange("performanceBandProfileId", value)}
            data={profiles.map(p => ({ key: p._id, title: p.name }))}
            prefix="Performance Band"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
      {standardProficiencyRequired && (
        <SearchField>
          <FilterLabel>Standard Proficiency</FilterLabel>
          <ControlDropDown
            by={filters.standardsProficiencyProfileId}
            selectCB={value => handleFilterChange("standardsProficiencyProfileId", value)}
            data={standardProficiencyList}
            prefix="Standard Proficiency"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
    </StyledFilterWrapper>
  );
};

const enhance = connect(
  state => ({
    SPRFilterData: getReportsSPRFilterData(state),
    filters: getFiltersSelector(state),
    student: getStudentSelector(state),
    selectedClass: getSelectedClassSelector(state),
    role: getUserRole(state),
    prevSPRFilterData: getReportsPrevSPRFilterData(state),
    loading: getReportsSPRFilterLoadingState(state),
    orgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state),
    defaultTerm: getCurrentTerm(state)
  }),
  {
    getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    setPrevSPRFilterData: setPrevSPRFilterDataAction,
    receiveStudentsListAction,
    setFilters: setFiltersAction,
    setStudent: setStudentAction,
    setSelectedClass: setSelectedClassAction
  }
);

export default enhance(StudentProfileReportsFilters);
