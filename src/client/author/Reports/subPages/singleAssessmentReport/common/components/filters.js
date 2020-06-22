import React, { useEffect, useMemo, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import queryString from "query-string";
import qs from "qs";
import { IconGroup, IconClass } from "@edulastic/icons";
import { greyThemeDark1 } from "@edulastic/colors";
import { roleuser } from "@edulastic/constants";
import PerfectScrollbar from "react-perfect-scrollbar";

import { AutocompleteDropDown } from "../../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../../common/components/widgets/controlDropDown";

import { getDropDownData, filteredDropDownData, processTestIds } from "../utils/transformers";
import {
  getSARFilterDataRequestAction,
  getReportsSARFilterData,
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getReportsPrevSARFilterData,
  setPrevSARFilterDataAction,
  setPerformanceBandProfileFilterAction,
  setStandardsProficiencyProfileFilterAction,
  getReportsSARFilterLoadingState
} from "../filterDataDucks";
import { getUserRole, getUserOrgId, getUser } from "../../../../../src/selectors/user";

import { receivePerformanceBandAction } from "../../../../../PerformanceBand/ducks";
import { receiveStandardsProficiencyAction } from "../../../../../StandardsProficiency/ducks";

import staticDropDownData from "../static/staticDropDownData.json";
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel
} from "../../../../common/styled";

const getTestIdFromURL = url => {
  if (url.length > 16) {
    const _url = url.substring(16);
    const index = _url.indexOf("test/");
    if (index >= 0) {
      const testId = _url.substring(index + 5);
      return testId;
    }
  }
  return "";
};

const SingleAssessmentReportFilters = ({
  SARFilterData,
  filters,
  testId,
  user,
  role,
  getSARFilterDataRequest,
  setFilters,
  setTestId,
  onGoClick: _onGoClick,
  location,
  style,
  history,
  setPrevSARFilterData,
  prevSARFilterData,
  setPerformanceBand,
  setStandardsProficiency,
  performanceBandRequired,
  isStandardProficiencyRequired = false,
  extraFilters
}) => {
  const performanceBandProfiles = get(SARFilterData, "data.result.bandInfo", []);
  const standardProficiencyProfiles = get(SARFilterData, "data.result.scaleInfo", []);
  const getTitleByTestId = urlTestId => {
    const arr = get(SARFilterData, "data.result.testData", []);
    const item = arr.find(o => o.testId === urlTestId);

    if (item) {
      return item.testName;
    }
    return "";
  };

  const schoolYear = useMemo(() => {
    let schoolYears = [];
    const arr = get(user, "orgData.terms", []);
    if (arr.length) {
      schoolYears = arr.map(item => ({ key: item._id, title: item.name }));
    }
    return schoolYears;
  });

  useEffect(() => {
    if (SARFilterData !== prevSARFilterData) {
      const search = queryString.parse(location.search);
      const termId =
        search.termId || get(user, "orgData.defaultTermId", "") || (schoolYear.length ? schoolYear[0].key : "");
      const q = {
        termId
      };
      getSARFilterDataRequest(q);
    }
  }, []);

  let processedTestIds;
  let dropDownData;
  if (SARFilterData !== prevSARFilterData && !isEmpty(SARFilterData)) {
    const search = queryString.parse(location.search);
    search.testId = getTestIdFromURL(location.pathname);
    // select common assessment as default if assessment type is not set
    search.assessmentType = get(SARFilterData, "data.result.reportFilters.assessmentType", "common assessment");
    dropDownData = getDropDownData(SARFilterData, user);

    const defaultTermId = get(user, "orgData.defaultTermId", "");
    const urlSchoolYear =
      schoolYear.find(item => item.key === search.termId) ||
      schoolYear.find(item => item.key === defaultTermId) ||
      (schoolYear[0] ? schoolYear[0] : { key: "", title: "" });
    const urlSubject = staticDropDownData.subjects.find(item => item.key === search.subject) || {
      key: "All",
      title: "All Subjects"
    };
    const urlGrade = staticDropDownData.grades.find(item => item.key === search.grade) || {
      key: "All",
      title: "All Grades"
    };
    const urlCourseId = dropDownData.courses.find(item => item.key === search.courseId) || {
      key: "All",
      title: "All Courses"
    };
    const urlClassId = dropDownData.classes.find(item => item.key === search.groupId) || {
      key: "All",
      title: "All Classes"
    };
    const urlGroupId = dropDownData.groups.find(item => item.key === search.groupId) || {
      key: "All",
      title: "All Groups"
    };
    let urlSchoolId = { key: "All", title: "All Schools" };
    let urlTeacherId = { key: "All", title: "All Teachers" };
    if (role !== "teacher") {
      urlSchoolId = dropDownData.schools.find(item => item.key === search.schoolId) || {
        key: "All",
        title: "All Schools"
      };
      urlTeacherId = dropDownData.teachers.find(item => item.key === search.teacherId) || {
        key: "All",
        title: "All Schools"
      };
    }
    const urlAssessmentType = staticDropDownData.assessmentType.find(item => item.key === search.assessmentType) || {
      key: "All",
      title: "All Assignment Types"
    };
    const urlTestId = dropDownData.testIdArr.find(item => item.key === search.testId) || {
      key: "",
      title: ""
    };

    const obtainedFilters = {
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grade: urlGrade.key,
      courseId: urlCourseId.key,
      classId: urlClassId.key,
      groupId: urlGroupId.key,
      schoolId: urlSchoolId.key,
      teacherId: urlTeacherId.key,
      assessmentType: urlAssessmentType.key
    };

    if (user.role === roleuser.SCHOOL_ADMIN) {
      obtainedFilters.schoolId = get(user, "orgData.schools", [])[0]?._id;
    }
    dropDownData = filteredDropDownData(SARFilterData, user, obtainedFilters);
    processedTestIds = processTestIds(dropDownData, obtainedFilters, urlTestId.key, role, user);

    const urlParams = { ...obtainedFilters };
    let filteredUrlTestId = urlTestId.key;
    if (urlTestId.key !== processedTestIds.validTestId || urlTestId.key === "") {
      filteredUrlTestId = processedTestIds.testIds.length ? processedTestIds.testIds[0].key : "";
    }
    if (role === "teacher") {
      delete urlParams.schoolId;
      delete urlParams.teacherId;
    }
    setFilters(urlParams);
    setTestId(filteredUrlTestId);

    _onGoClick({
      selectedTest: { key: filteredUrlTestId, title: getTitleByTestId(filteredUrlTestId) },
      filters: urlParams
    });

    setPrevSARFilterData(SARFilterData);
  }

  dropDownData = useMemo(() => filteredDropDownData(SARFilterData, user, { ...filters }), [SARFilterData, filters]);

  processedTestIds = useMemo(
    () =>
      processTestIds(
        dropDownData,
        {
          termId: filters.termId,
          subject: filters.subject,
          grade: filters.grade,
          courseId: filters.courseId,
          classId: filters.classId,
          groupId: filters.groupId,
          schoolId: filters.schoolId,
          teacherId: filters.teacherId,
          assessmentType: filters.assessmentType
        },
        testId,
        role,
        user
      ),
    [SARFilterData, filters, testId]
  );

  if (!processedTestIds.validTestId && processedTestIds.testIds.length) {
    setTestId(processedTestIds.testIds[0].key ? processedTestIds.testIds[0].key : "");
  }

  const updateSchoolYearDropDownCB = selected => {
    const pathname = location.pathname;
    const splitted = pathname.split("/");
    splitted.splice(splitted.length - 1);
    const newPathname = `${splitted.join("/")}/`;
    const _filters = { ...filters };
    _filters.termId = selected.key;
    history.push(`${newPathname}?${qs.stringify(_filters)}`);

    const q = {
      termId: selected.key
    };
    getSARFilterDataRequest(q);
  };
  const updateSubjectDropDownCB = selected => {
    const obj = {
      filters: {
        ...filters,
        subject: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFilters(obj);
  };

  const updateGradeDropDownCB = selected => {
    const obj = {
      filters: {
        ...filters,
        grade: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFilters(obj);
  };
  const updateCourseDropDownCB = selected => {
    const obj = {
      filters: {
        ...filters,
        courseId: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFilters(obj);
  };
  const updateClassesDropDownCB = selected => {
    const obj = {
      ...filters,
      classId: selected.key
    };
    setFilters(obj);
  };
  const updateGroupsDropDownCB = selected => {
    const obj = {
      ...filters,
      groupId: selected.key
    };
    setFilters(obj);
  };
  const updateSchoolsDropDownCB = selected => {
    const obj = {
      ...filters,
      schoolId: selected.key
    };
    setFilters(obj);
  };
  const updateTeachersDropDownCB = selected => {
    const obj = {
      ...filters,
      teacherId: selected.key
    };
    setFilters(obj);
  };
  const updateAssessmentTypeDropDownCB = selected => {
    const obj = {
      ...filters,
      assessmentType: selected.key
    };
    setFilters(obj);
  };

  const onTestIdChange = selected => {
    setTestId(selected.key);
  };

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: { key: testId, title: getTitleByTestId(testId) }
    };
    _onGoClick(settings);
  };

  const standardProficiencyList = useMemo(() => standardProficiencyProfiles.map(s => ({ key: s._id, title: s.name })), [
    standardProficiencyProfiles
  ]);

  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
      </GoButtonWrapper>
      <PerfectScrollbar>
        <SearchField>
          <FilterLabel>Assessment Name</FilterLabel>
          <AutocompleteDropDown
            containerClassName="single-assessment-report-test-autocomplete"
            data={processedTestIds.testIds ? processedTestIds.testIds : []}
            by={testId}
            prefix="Assessment Name"
            selectCB={onTestIdChange}
          />
        </SearchField>
        {isStandardProficiencyRequired && (
          <SearchField>
            <FilterLabel>Standard Proficiency</FilterLabel>
            <ControlDropDown
              by={filters.standardsProficiencyProfile || standardProficiencyProfiles[0]?._id}
              selectCB={({ key }) => setStandardsProficiency(key)}
              data={standardProficiencyList}
              prefix="Standard Proficiency"
              showPrefixOnSelected={false}
            />
          </SearchField>
        )}
        {performanceBandRequired && (
          <SearchField>
            <FilterLabel>Performance Band </FilterLabel>
            <ControlDropDown
              by={{ key: filters.performanceBandProfile || performanceBandProfiles[0]?._id }}
              selectCB={({ key }) => setPerformanceBand(key)}
              data={performanceBandProfiles.map(profile => ({ key: profile._id, title: profile.name }))}
              prefix="Performance Band"
              showPrefixOnSelected={false}
            />
          </SearchField>
        )}
        <SearchField>
          <FilterLabel>Assessment Type</FilterLabel>
          <AutocompleteDropDown
            prefix="Assessment Type"
            by={filters.assessmentType}
            selectCB={updateAssessmentTypeDropDownCB}
            data={staticDropDownData.assessmentType}
          />
        </SearchField>
        {extraFilters}
        {role !== "teacher" && (
          <Fragment>
            <SearchField>
              <FilterLabel>School</FilterLabel>
              <AutocompleteDropDown
                prefix="School"
                by={filters.schoolId}
                selectCB={updateSchoolsDropDownCB}
                data={dropDownData.schools}
              />
            </SearchField>
            <SearchField>
              <FilterLabel>Teacher</FilterLabel>
              <AutocompleteDropDown
                prefix="Teacher"
                by={filters.teacherId}
                selectCB={updateTeachersDropDownCB}
                data={dropDownData.teachers}
              />
            </SearchField>
          </Fragment>
        )}
        <SearchField>
          <FilterLabel>Group</FilterLabel>
          <AutocompleteDropDown
            prefix="Group"
            by={filters.groupId}
            selectCB={updateGroupsDropDownCB}
            data={dropDownData.groups}
            dropdownMenuIcon={<IconGroup width={20} height={19} color={greyThemeDark1} margin="0 7px 0 0" />}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Class</FilterLabel>
          <AutocompleteDropDown
            prefix="Class"
            by={filters.classId}
            selectCB={updateClassesDropDownCB}
            data={dropDownData.classes}
            dropdownMenuIcon={<IconClass width={13} height={14} color={greyThemeDark1} margin="0 10px 0 0" />}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Course</FilterLabel>
          <AutocompleteDropDown
            prefix="Course"
            by={filters.courseId}
            selectCB={updateCourseDropDownCB}
            data={dropDownData.courses}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Grade</FilterLabel>
          <AutocompleteDropDown
            prefix="Grade"
            className="custom-1-scrollbar"
            by={filters.grade}
            selectCB={updateGradeDropDownCB}
            data={staticDropDownData.grades}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Subject</FilterLabel>
          <ControlDropDown
            by={filters.subject}
            selectCB={updateSubjectDropDownCB}
            data={staticDropDownData.subjects}
            prefix="Subject"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>School Year</FilterLabel>
          <ControlDropDown
            by={filters.termId}
            selectCB={updateSchoolYearDropDownCB}
            data={dropDownData.schoolYear}
            prefix="School Year"
            showPrefixOnSelected={false}
          />
        </SearchField>
      </PerfectScrollbar>
    </StyledFilterWrapper>
  );
};

const enhance = compose(
  connect(
    state => ({
      SARFilterData: getReportsSARFilterData(state),
      filters: getFiltersSelector(state),
      testId: getTestIdSelector(state),
      role: getUserRole(state),
      districtId: getUserOrgId(state),
      user: getUser(state),
      prevSARFilterData: getReportsPrevSARFilterData(state),
      loading: getReportsSARFilterLoadingState(state),
      performanceBandProfiles: state?.performanceBandReducer?.profiles || [],
      performanceBandLoading: state?.performanceBandReducer?.loading || false,
      standardProficiencyProfiles: state?.standardsProficiencyReducer?.data || [],
      standardProficiencyLoading: state?.standardsProficiencyReducer?.loading || []
    }),
    {
      getSARFilterDataRequest: getSARFilterDataRequestAction,
      loadPerformanceBand: receivePerformanceBandAction,
      loadStandardProficiency: receiveStandardsProficiencyAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
      setPerformanceBand: setPerformanceBandProfileFilterAction,
      setStandardsProficiency: setStandardsProficiencyProfileFilterAction
    }
  )
);

export default enhance(SingleAssessmentReportFilters);
