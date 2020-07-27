import React, { useEffect, useMemo, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { find, get, isEmpty, map, pickBy } from "lodash";
import queryString from "query-string";

import PerfectScrollbar from "react-perfect-scrollbar";
import { Tooltip, Spin } from "antd";

import { IconGroup, IconClass } from "@edulastic/icons";
import { greyThemeDark1 } from "@edulastic/colors";
import { roleuser } from "@edulastic/constants";

import { AutocompleteDropDown } from "../../../../../common/components/widgets/autocompleteDropDown";
import { MultipleSelect } from "../../../../../common/components/widgets/MultipleSelect";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel
} from "../../../../../common/styled";

import { getDropDownData, filteredDropDownData, processTestIds } from "../../utils/transformers";
import { toggleItem } from "../../../../../common/util";

import {
  getReportsMARFilterLoadingState,
  getMARFilterDataRequestAction,
  getReportsMARFilterData,
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getReportsPrevMARFilterData,
  setPrevMARFilterDataAction
} from "../../filterDataDucks";
import { getUserRole, getUser } from "../../../../../../src/selectors/user";

import staticDropDownData from "../../static/staticDropDownData.json";

const SingleAssessmentReportFilters = ({
  loading,
  MARFilterData,
  filters,
  testIds,
  user,
  role,
  style,
  getMARFilterDataRequest,
  setFilters: _setFilters,
  setTestId: _setTestId,
  onGoClick: _onGoClick,
  location,
  history,
  setPrevMARFilterData,
  prevMARFilterData,
  performanceBandRequired,
  extraFilter,
  showApply,
  setShowApply
}) => {
  const testDataOverflow = get(MARFilterData, "data.result.testDataOverflow", false);
  const profiles = get(MARFilterData, "data.result.bandInfo", []);

  const schoolYear = useMemo(() => {
    let _schoolYear = [];
    const arr = get(user, "orgData.terms", []);
    if (arr.length) {
      _schoolYear = arr.map(item => ({ key: item._id, title: item.name }));
    }
    return _schoolYear;
  });

  useEffect(() => {
    if (MARFilterData !== prevMARFilterData) {
      const search = queryString.parse(location.search);
      const termId =
        search.termId || get(user, "orgData.defaultTermId", "") || (schoolYear.length ? schoolYear[0].key : "");
      const q = {
        termId
      };
      getMARFilterDataRequest(q);
    }
  }, []);

  let processedTestIds;
  let dropDownData;

  if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
    const search = queryString.parse(location.search, { arrayFormat: "index" });
    /**
     * TODO: modify this to save all filters
     *
     * // get assessment type from filter data
     * search.assessmentType = get(MARFilterData, "data.result.reportFilters.assessmentType");
     * // select common assessment as default if assessment type is not set for admins
     * if (role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN) {
     *   search.assessmentType = search.assessmentType || "common assessment";
     * }
     */
    dropDownData = getDropDownData(MARFilterData, user);
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
    if (role !== roleuser.TEACHER) {
      urlSchoolId = dropDownData.schools.find(item => item.key === search.schoolId) || {
        key: "All",
        title: "All Schools"
      };
      urlTeacherId = dropDownData.teachers.find(item => item.key === search.teacherId) || {
        key: "All",
        title: "All Teachers"
      };
    }
    const urlAssessmentType = staticDropDownData.assessmentType.find(item => item.key === search.assessmentType) || {
      key: "All",
      title: "All Assignment Types"
    };

    const testIdsArr = [].concat(search.testIds?.split(",") || []);

    const urlTestIds = testIdsArr
      .map(key => find(dropDownData.testIdArr, test => test.key == key))
      .filter(item => item);

    const obtainedFilters = {
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grade: urlGrade.key,
      courseId: urlCourseId.key,
      classId: urlClassId.key,
      groupId: urlGroupId.key,
      schoolId: urlSchoolId.key,
      teacherId: urlTeacherId.key,
      assessmentType: urlAssessmentType.key,
      testIds: urlTestIds.length ? urlTestIds.join(",") : ""
    };

    dropDownData = filteredDropDownData(MARFilterData, user, obtainedFilters);

    processedTestIds = processTestIds(dropDownData, obtainedFilters, "", role);

    const urlParams = { ...obtainedFilters };

    if (role === roleuser.TEACHER) {
      delete urlParams.schoolId;
      delete urlParams.teacherId;
    }

    _setFilters(urlParams);
    _setTestId(urlTestIds);

    if (prevMARFilterData === null) {
      _onGoClick({
        selectedTest: urlTestIds,
        filters: urlParams
      });
    }

    setPrevMARFilterData(MARFilterData);
  }

  dropDownData = useMemo(() => filteredDropDownData(MARFilterData, user, { ...filters }), [MARFilterData, filters]);

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
        testIds,
        role
      ),
    [MARFilterData, filters, testIds]
  );

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds
    };
    setShowApply(false);
    _onGoClick(settings);
  };

  const setFilters = _filters => {
    setShowApply(true);
    _setFilters(_filters);
  };

  const setTestId = _testIds => {
    setShowApply(true);
    _setTestId(_testIds);
  };

  const updateSchoolYearDropDownCB = selected => {
    const _filters = { ...filters, termId: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateSubjectDropDownCB = selected => {
    const _filters = { ...filters, subject: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const onChangePerformanceBand = selected => {
    const _filters = {
      filters: {
        ...filters,
        profileId: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFilters(_filters);
  };
  const updateGradeDropDownCB = selected => {
    const _filters = { ...filters, grade: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateCourseDropDownCB = selected => {
    const _filters = { ...filters, courseId: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateClassesDropDownCB = selected => {
    const _filters = { ...filters, classId: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateGroupsDropDownCB = selected => {
    const _filters = { ...filters, groupId: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateSchoolsDropDownCB = selected => {
    const _filters = {
      ...filters,
      schoolId: selected.key
    };
    setFilters(_filters);
  };
  const updateTeachersDropDownCB = selected => {
    const _filters = { ...filters, teacherId: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };
  const updateAssessmentTypeDropDownCB = selected => {
    const _filters = { ...filters, assessmentType: selected.key };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterDataRequest(q);
    setFilters(_filters);
  };

  const onSelectTest = test => {
    const items = toggleItem(map(testIds, _test => _test.key), test.key);
    const _testIds = processedTestIds.testIds.filter(_test => !!items.includes(_test.key));
    setTestId(_testIds);
  };

  const onChangeTest = items => {
    if (!items.length) {
      setTestId([]);
    }
  };

  const assessmentNameFilter = (
    <SearchField>
      <FilterLabel>Assessment Name</FilterLabel>
      <MultipleSelect
        containerClassName="single-assessment-report-test-autocomplete"
        data={(processedTestIds.testIds || []).map(t => ({
          ...t,
          title: `${t.title} (ID: ${t.key?.substring(t.key.length - 5) || ""})`
        }))}
        valueToDisplay={
          testIds?.length > 1
            ? { key: "", title: "Multiple Assessment" }
            : (testIds || []).map(t => ({
                ...t,
                title: `${t.title} (ID: ${t.key?.substring(t.key.length - 5) || ""})`
              }))
        }
        by={testIds}
        prefix="Assessment Name"
        onSelect={onSelectTest}
        onChange={onChangeTest}
        placeholder="All Assessments"
      />
    </SearchField>
  );

  return loading ? (
    <StyledFilterWrapper style={style}>
      <Spin />
    </StyledFilterWrapper>
  ) : (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        {showApply && <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>}
      </GoButtonWrapper>
      <PerfectScrollbar>
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
        {role !== roleuser.TEACHER && (
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
          <FilterLabel>Assessment Type</FilterLabel>
          <AutocompleteDropDown
            prefix="Assessment Type"
            by={filters.assessmentType}
            selectCB={updateAssessmentTypeDropDownCB}
            data={staticDropDownData.assessmentType}
          />
        </SearchField>
        {testDataOverflow ? (
          <Tooltip
            title="Year, Grade and Subject filters need to be selected to retrieve all assessments"
            placement="right"
          >
            {assessmentNameFilter}
          </Tooltip>
        ) : (
          assessmentNameFilter
        )}
        {performanceBandRequired && (
          <SearchField>
            <FilterLabel>Performance Band</FilterLabel>
            <ControlDropDown
              by={{ key: filters.profileId }}
              selectCB={onChangePerformanceBand}
              data={profiles.map(p => ({ key: p._id, title: p.name }))}
              prefix="Performance Band"
              showPrefixOnSelected={false}
            />
          </SearchField>
        )}
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
          <FilterLabel>Group</FilterLabel>
          <AutocompleteDropDown
            prefix="Group"
            by={filters.groupId}
            selectCB={updateGroupsDropDownCB}
            data={dropDownData.groups}
            dropdownMenuIcon={<IconGroup width={20} height={19} color={greyThemeDark1} margin="0 7px 0 0" />}
          />
        </SearchField>
        {extraFilter}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  );
};

const enhance = compose(
  connect(
    state => ({
      loading: getReportsMARFilterLoadingState(state),
      MARFilterData: getReportsMARFilterData(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      prevMARFilterData: getReportsPrevMARFilterData(state)
    }),
    {
      getMARFilterDataRequest: getMARFilterDataRequestAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevMARFilterData: setPrevMARFilterDataAction
    }
  )
);

export default enhance(SingleAssessmentReportFilters);
