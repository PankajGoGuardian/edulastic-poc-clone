import React, { useEffect, useMemo, Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { find, get, isEmpty, map, pickBy } from "lodash";
import queryString from "query-string";

import PerfectScrollbar from "react-perfect-scrollbar";
import { Tooltip, Spin } from "antd";

import { notification } from "@edulastic/common";
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
  setShowApply,
  firstLoad,
  setFirstLoad
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
      const search = pickBy(queryString.parse(location.search), f => f !== "All" && !isEmpty(f));
      const termId =
        search.termId || get(user, "orgData.defaultTermId", "") || (schoolYear.length ? schoolYear[0].key : "");
      const q = { ...search, termId };
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true;
      }
      if (get(user, "role", "") === roleuser.SCHOOL_ADMIN) {
        Object.assign(q, { schoolIds: get(user, "institutionIds", []).join(",") });
      }
      getMARFilterDataRequest(q);
    }
  }, []);

  const getMARFilterData = _filters => {
    let schoolIds = "";
    if (get(user, "role", "") === roleuser.SCHOOL_ADMIN) {
      schoolIds = get(user, "institutionIds", []).join(",");
    }
    getMARFilterDataRequest({ ..._filters, schoolIds });
  };
  let processedTestIds;
  let dropDownData;

  if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
    let search = queryString.parse(location.search, { arrayFormat: "index" });

    // get saved filters from backend
    const savedFilters = get(MARFilterData, "data.result.reportFilters");
    // select common assessment as default if assessment type is not set for admins
    if (user.role === roleuser.DISTRICT_ADMIN || user.role === roleuser.SCHOOL_ADMIN) {
      savedFilters.assessmentType = search.assessmentType || savedFilters.assessmentType || "common assessment";
    }

    if (firstLoad) {
      search = { ...savedFilters, ...search };
    }

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
    const urlClassId = dropDownData.classes.find(item => item.key === search.classId) || {
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

    let urlTestIds = testIdsArr.map(key => find(dropDownData.testIdArr, test => test.key == key)).filter(item => item);

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

    if (firstLoad) {
      urlTestIds = urlTestIds?.filter(t => t).length ? urlTestIds : (processedTestIds?.testIds || []).slice(0, 10);
    }

    _setFilters(urlParams);
    _setTestId(urlTestIds);

    if (firstLoad) {
      setFirstLoad(false);
      _onGoClick({ selectedTest: urlTestIds, filters: urlParams });
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

  const updateFilterDropdownCB = (selected, keyName) => {
    const _filters = {
      ...filters,
      [keyName]: selected.key
    };
    history.push(`${location.pathname}?${queryString.stringify(_filters)}`);
    const q = pickBy(_filters, f => f !== "All" && !isEmpty(f));
    getMARFilterData(q);
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

  const onSelectTest = test => {
    const testIdsKeys = map(testIds, _t => _t.key);
    const items = toggleItem(testIdsKeys, test.key);
    const _testIds = processedTestIds.testIds.filter(_t => !!items.includes(_t.key));
    if (_testIds.length !== 0) {
      const doNotUpdate =
        testIds.length === _testIds.length && isEmpty(_testIds.filter(_t => !testIdsKeys.includes(_t.key)));
      if (!doNotUpdate) {
        setTestId(_testIds);
      }
    } else {
      notification({ type: "warn", msg: `Selection cannot be empty` });
    }
  };

  const onChangeTest = items => {
    if (!items.length) {
      notification({ type: "warn", msg: `Selection cannot be empty` });
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
            selectCB={e => updateFilterDropdownCB(e, "termId")}
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
            selectCB={e => updateFilterDropdownCB(e, "grade")}
            data={staticDropDownData.grades}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Subject</FilterLabel>
          <ControlDropDown
            by={filters.subject}
            selectCB={e => updateFilterDropdownCB(e, "subject")}
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
                selectCB={e => updateFilterDropdownCB(e, "schoolId")}
                data={dropDownData.schools}
              />
            </SearchField>
            <SearchField>
              <FilterLabel>Teacher</FilterLabel>
              <AutocompleteDropDown
                prefix="Teacher"
                by={filters.teacherId}
                selectCB={e => updateFilterDropdownCB(e, "teacherId")}
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
            selectCB={e => updateFilterDropdownCB(e, "assessmentType")}
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
            selectCB={e => updateFilterDropdownCB(e, "courseId")}
            data={dropDownData.courses}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Class</FilterLabel>
          <AutocompleteDropDown
            prefix="Class"
            by={filters.classId}
            selectCB={e => updateFilterDropdownCB(e, "classId")}
            data={dropDownData.classes}
            dropdownMenuIcon={<IconClass width={13} height={14} color={greyThemeDark1} margin="0 10px 0 0" />}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Group</FilterLabel>
          <AutocompleteDropDown
            prefix="Group"
            by={filters.groupId}
            selectCB={e => updateFilterDropdownCB(e, "groupId")}
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
