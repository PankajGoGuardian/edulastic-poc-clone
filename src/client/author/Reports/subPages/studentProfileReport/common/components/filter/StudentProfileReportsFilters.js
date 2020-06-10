import React, { useEffect, useMemo, useRef } from "react";
import queryString from "query-string";
import { connect } from "react-redux";
import { get, find, isEmpty } from "lodash";
import { FieldLabel } from "@edulastic/common";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import StudentAutoComplete from "./StudentAutoComplete";
import { getUserRole, getOrgDataSelector } from "../../../../../../src/selectors/user";
import { receiveStudentsListAction, getStudentsListSelector } from "../../../../../../Student/ducks";
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
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel
} from "../../../../../common/styled";

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
  setPerformanceBand,
  setStandardsProficiency
}) => {
  const firstPlot = useRef(true);
  const splittedPath = location.pathname.split("/");
  const urlStudentId = splittedPath[splittedPath.length - 1];
  const parsedQuery = queryString.parse(location.search);

  const { termId: urlTermId, courseId: urlCourseId } = parsedQuery;

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

      const _filters = {
        ...filters,
        termId: selectedTerm.key,
        courseId: selectedCourse.key
        // uncomment after making changes to chart files
        // performanceBandProfileId: selectedProfile,
        // standardsProficiencyProfileId: selectedScale
      };
      const _student = { ...student };
      setFilters(_filters);

      if (firstPlot.current) {
        _onGoClick({ filters: { ..._filters }, selectedStudent: _student });
      }
    }

    firstPlot.current = false;
  }

  const onStudentSelect = item => {
    if (item && item.key) {
      setStudent(item);

      const q = {
        termId: filters.termId,
        studentId: item.key
      };
      getSPRFilterDataRequest(q);

      _onGoClick({ filters: { ...filters }, selectedStudent: item });
    }
  };

  const onUpdateTerm = ({ key }) => {
    const obj = {
      ...filters,
      termId: key
    };
    setFilters(obj);
  };
  const onUpdateCourse = ({ key }) => {
    const obj = {
      ...filters,
      courseId: key
    };
    setFilters(obj);
  };

  const onChangePerformanceBand = ({ key }) => setPerformanceBand(key);
  const onChangeStandardsProficiency = ({ key }) => setStandardsProficiency(key);

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedStudent: student
    };
    _onGoClick(settings);
  };

  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
      </GoButtonWrapper>
      <SearchField>
        <FieldLabel>Student</FieldLabel>
        <StudentAutoComplete selectCB={onStudentSelect} selectedStudent={student} />
      </SearchField>
      <SearchField>
        <FieldLabel>Subject</FieldLabel>
        <ControlDropDown
          by={filters.courseId}
          selectCB={onUpdateCourse}
          data={courseOptions}
          prefix="Courses"
          showPrefixOnSelected={false}
        />
      </SearchField>
      {performanceBandRequired && (
        <SearchField>
          <FieldLabel>Performance Band</FieldLabel>
          <ControlDropDown
            by={filters.performanceBandProfileId}
            selectCB={onChangePerformanceBand}
            data={profiles.map(p => ({ key: p._id, title: p.name }))}
            prefix="Performance Band"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
      {standardProficiencyRequired && (
        <SearchField>
          <FieldLabel>Standard Proficiency</FieldLabel>
          <ControlDropDown
            by={filters.standardsProficiencyProfileId}
            selectCB={onChangeStandardsProficiency}
            data={standardProficiencyList}
            prefix="Standard Proficiency"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
      <SearchField>
        <FieldLabel>School Year</FieldLabel>
        <ControlDropDown
          by={filters.termId}
          selectCB={onUpdateTerm}
          data={termOptions}
          prefix="School Year"
          showPrefixOnSelected={false}
        />
      </SearchField>
    </StyledFilterWrapper>
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
    getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    setPrevSPRFilterData: setPrevSPRFilterDataAction,
    receiveStudentsListAction,
    setFilters: setFiltersAction,
    setStudent: setStudentAction,
    setPerformanceBand: setPbIdAction,
    setStandardsProficiency: setSpIdAction
  }
);

export default enhance(StudentProfileReportsFilters);
