import React, { useEffect, useMemo, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { find, get, isEmpty, map } from "lodash";
import queryString from "query-string";
import { IconGroup, IconClass } from "@edulastic/icons";
import { greyThemeDark1 } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AutocompleteDropDown } from "../../../../../common/components/widgets/autocompleteDropDown";
import { MultipleSelect } from "../../../../../common/components/widgets/MultipleSelect";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import { getDropDownData, filteredDropDownData, processTestIds } from "../../utils/transformers";
import { toggleItem } from "../../../../../common/util";
import {
  getMARFilterDataRequestAction,
  getReportsMARFilterData,
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getReportsPrevMARFilterData,
  setPrevMARFilterDataAction,
  getReportsMARFilterLoadingState
} from "../../filterDataDucks";
import { getUserRole, getUser } from "../../../../../../src/selectors/user";

import staticDropDownData from "../../static/staticDropDownData.json";
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel
} from "../../../../../common/styled";

const SingleAssessmentReportFilters = ({
  MARFilterData,
  filters,
  testIds,
  user,
  role,
  style,
  getMARFilterDataRequest,
  setFilters,
  setTestId,
  onGoClick: _onGoClick,
  location,
  history,
  setPrevMARFilterData,
  prevMARFilterData,
  performanceBandRequired,
  extraFilter
}) => {
  const profiles = MARFilterData?.data?.result?.bandInfo || [];

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
    if (role !== "teacher") {
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

    if (role === "teacher") {
      delete urlParams.schoolId;
      delete urlParams.teacherId;
    }

    setFilters(urlParams);
    setTestId(urlTestIds);

    _onGoClick({
      selectedTest: urlTestIds,
      filters: urlParams
    });

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

  const updateSchoolYearDropDownCB = selected => {
    const pathname = location.pathname;
    const _filters = { ...filters };
    _filters.termId = selected.key;
    history.push(`${pathname}?${queryString.stringify(_filters)}`);

    const q = {
      termId: selected.key
    };

    getMARFilterDataRequest(q);
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

  const onChangePerformanceBand = selected => {
    const obj = {
      filters: {
        ...filters,
        profileId: selected.key
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

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds
    };
    _onGoClick(settings);
  };

  const onSelectTest = test => {
    const items = toggleItem(map(testIds, _test => _test.key), test.key);
    setTestId(processedTestIds.testIds.filter(_test => !!items.includes(_test.key)));
  };

  const onChangeTest = items => {
    if (!items.length) {
      setTestId([]);
    }
  };

  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
      </GoButtonWrapper>
      <PerfectScrollbar>
        <SearchField>
          <FilterLabel>Assessment Name</FilterLabel>
          <MultipleSelect
            containerClassName="single-assessment-report-test-autocomplete"
            data={processedTestIds.testIds ? processedTestIds.testIds : []}
            valueToDisplay={testIds.length > 1 ? { key: "", title: "Multiple Assessment" } : testIds}
            by={testIds}
            prefix="Assessment Name"
            onSelect={onSelectTest}
            onChange={onChangeTest}
            placeholder="All Assessments"
          />
        </SearchField>
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
          <FilterLabel>Assessment Type</FilterLabel>
          <AutocompleteDropDown
            prefix="Assessment Type"
            by={filters.assessmentType}
            selectCB={updateAssessmentTypeDropDownCB}
            data={staticDropDownData.assessmentType}
          />
        </SearchField>
        {extraFilter}
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
      MARFilterData: getReportsMARFilterData(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      prevMARFilterData: getReportsPrevMARFilterData(state),
      loading: getReportsMARFilterLoadingState(state)
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
