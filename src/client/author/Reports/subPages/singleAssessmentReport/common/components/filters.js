import React, { useEffect, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col } from "antd";
import { get, isEmpty } from "lodash";
import queryString from "query-string";
import qs from "qs";

import { IconGroup, IconClass } from "@edulastic/icons";
import { greyThemeDark1 } from "@edulastic/colors";

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
import { getUserRole, getUserOrgId } from "../../../../../src/selectors/user";
import { getUser } from "../../../../../src/selectors/user";
import { receivePerformanceBandAction } from "../../../../../PerformanceBand/ducks";
import { receiveStandardsProficiencyAction } from "../../../../../StandardsProficiency/ducks";

import staticDropDownData from "../static/staticDropDownData";
import school from "@edulastic/api/src/school";
import { StyledFilterWrapper, StyledGoButton } from "../../../../common/styled";

const getTestIdFromURL = url => {
  if (url.length > 16) {
    let _url = url.substring(16);
    let index = _url.indexOf("test/");
    if (index >= 0) {
      let testId = _url.substring(index + 5);
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
  getSARFilterDataRequestAction,
  setFiltersAction,
  setTestIdAction,
  onGoClick: _onGoClick,
  location,
  className,
  style,
  history,
  setPrevSARFilterDataAction,
  prevSARFilterData,
  loading,
  loadPerformanceBand,
  loadStandardProficiency,
  districtId,
  performanceBandLoading,
  standardProficiencyLoading,
  setPerformanceBand,
  setStandardsProficiency,
  performanceBandRequired,
  isStandardProficiencyRequired = false
}) => {
  const performanceBandProfiles = get(SARFilterData, "data.result.bandInfo", []);
  const standardProficiencyProfiles = get(SARFilterData, "data.result.scaleInfo", []);
  const getTitleByTestId = testId => {
    let arr = get(SARFilterData, "data.result.testData", []);
    let item = arr.find(o => o.testId === testId);

    if (item) {
      return item.testName;
    }
    return "";
  };

  const schoolYear = useMemo(() => {
    let schoolYear = [];
    let arr = get(user, "orgData.terms", []);
    if (arr.length) {
      schoolYear = arr.map((item, index) => {
        return { key: item._id, title: item.name };
      });
    }
    return schoolYear;
  });

  useEffect(() => {
    if (SARFilterData !== prevSARFilterData) {
      const search = queryString.parse(location.search);
      const termId =
        search.termId || get(user, "orgData.defaultTermId", "") || (schoolYear.length ? schoolYear[0].key : "");
      let q = {
        termId
      };
      getSARFilterDataRequestAction(q);
    }
  }, []);

  let processedTestIds;
  let dropDownData;
  if (SARFilterData !== prevSARFilterData && !isEmpty(SARFilterData)) {
    const search = queryString.parse(location.search);
    search.testId = getTestIdFromURL(location.pathname);
    dropDownData = getDropDownData(SARFilterData, user);

    const defaultTermId = get(user, "orgData.defaultTermId", "");
    const urlSchoolYear =
      schoolYear.find((item, index) => item.key === search.termId) ||
      schoolYear.find((item, index) => item.key === defaultTermId) ||
      (schoolYear[0] ? schoolYear[0] : { key: "", title: "" });
    const urlSubject = staticDropDownData.subjects.find((item, index) => item.key === search.subject) || {
      key: "All",
      title: "All Subjects"
    };
    const urlGrade = staticDropDownData.grades.find((item, index) => item.key === search.grade) || {
      key: "All",
      title: "All Grades"
    };
    const urlCourseId = dropDownData.courses.find((item, index) => item.key === search.courseId) || {
      key: "All",
      title: "All Courses"
    };
    const urlClassId = dropDownData.classes.find((item, index) => item.key === search.groupId) || {
      key: "All",
      title: "All Classes"
    };
    const urlGroupId = dropDownData.groups.find((item, index) => item.key === search.groupId) || {
      key: "All",
      title: "All Groups"
    };
    let urlSchoolId = { key: "All", title: "All Schools" };
    let urlTeacherId = { key: "All", title: "All Teachers" };
    if (role !== "teacher") {
      urlSchoolId = dropDownData.schools.find((item, index) => item.key === search.schoolId) || {
        key: "All",
        title: "All Schools"
      };
      urlTeacherId = dropDownData.teachers.find((item, index) => item.key === search.teacherId) || {
        key: "All",
        title: "All Schools"
      };
    }
    const urlAssessmentType = staticDropDownData.assessmentType.find(
      (item, index) => item.key === search.assessmentType
    ) || {
      key: "All",
      title: "All Assignment Types"
    };
    const urlTestId = dropDownData.testIdArr.find((item, index) => item.key === search.testId) || {
      key: "",
      title: ""
    };

    let obtainedFilters = {
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

    dropDownData = filteredDropDownData(SARFilterData, user, obtainedFilters);

    processedTestIds = processTestIds(dropDownData, obtainedFilters, urlTestId.key, role);

    let urlParams = { ...obtainedFilters };
    let filteredUrlTestId = urlTestId.key;
    if (urlTestId.key !== processedTestIds.validTestId || urlTestId.key === "") {
      filteredUrlTestId = processedTestIds.testIds.length ? processedTestIds.testIds[0].key : "";
    }
    if (role === "teacher") {
      delete urlParams.schoolId;
      delete urlParams.teacherId;
    }
    setFiltersAction(urlParams);
    setTestIdAction(filteredUrlTestId);

    _onGoClick({
      selectedTest: { key: filteredUrlTestId, title: getTitleByTestId(filteredUrlTestId) },
      filters: urlParams
    });

    setPrevSARFilterDataAction(SARFilterData);
  }

  dropDownData = useMemo(() => filteredDropDownData(SARFilterData, user, { ...filters }), [SARFilterData, filters]);

  processedTestIds = useMemo(() => {
    return processTestIds(
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
      role
    );
  }, [SARFilterData, filters, testId]);

  if (!processedTestIds.validTestId && processedTestIds.testIds.length) {
    setTestIdAction(processedTestIds.testIds[0].key ? processedTestIds.testIds[0].key : "");
  }

  const updateSchoolYearDropDownCB = selected => {
    let pathname = location.pathname;
    let splitted = pathname.split("/");
    splitted.splice(splitted.length - 1);
    let newPathname = splitted.join("/") + "/";
    let _filters = { ...filters };
    _filters.termId = selected.key;
    history.push(newPathname + "?" + qs.stringify(_filters));

    let q = {
      termId: selected.key
    };
    getSARFilterDataRequestAction(q);
  };
  const updateSubjectDropDownCB = selected => {
    let obj = {
      filters: {
        ...filters,
        subject: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFiltersAction(obj);
  };

  const updateGradeDropDownCB = selected => {
    let obj = {
      filters: {
        ...filters,
        grade: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFiltersAction(obj);
  };
  const updateCourseDropDownCB = selected => {
    let obj = {
      filters: {
        ...filters,
        courseId: selected.key
      },
      orgDataArr: dropDownData.orgDataArr
    };
    setFiltersAction(obj);
  };
  const updateClassesDropDownCB = selected => {
    let obj = {
      ...filters,
      classId: selected.key
    };
    setFiltersAction(obj);
  };
  const updateGroupsDropDownCB = selected => {
    let obj = {
      ...filters,
      groupId: selected.key
    };
    setFiltersAction(obj);
  };
  const updateSchoolsDropDownCB = selected => {
    let obj = {
      ...filters,
      schoolId: selected.key
    };
    setFiltersAction(obj);
  };
  const updateTeachersDropDownCB = selected => {
    let obj = {
      ...filters,
      teacherId: selected.key
    };
    setFiltersAction(obj);
  };
  const updateAssessmentTypeDropDownCB = selected => {
    let obj = {
      ...filters,
      assessmentType: selected.key
    };
    setFiltersAction(obj);
  };

  const onTestIdChange = (selected, comData) => {
    setTestIdAction(selected.key);
  };

  const onGoClick = () => {
    let settings = {
      filters: { ...filters },
      selectedTest: { key: testId, title: getTitleByTestId(testId) }
    };
    _onGoClick(settings);
  };

  const standardProficiencyList = useMemo(() => standardProficiencyProfiles.map(s => ({ key: s._id, title: s.name })), [
    standardProficiencyProfiles
  ]);

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
        <Row type="flex" className="single-assessment-report-top-filter">
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>School Year</PrintablePrefix>
            <ControlDropDown
              by={filters.termId}
              selectCB={updateSchoolYearDropDownCB}
              data={dropDownData.schoolYear}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Subject</PrintablePrefix>
            <ControlDropDown
              by={filters.subject}
              selectCB={updateSubjectDropDownCB}
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Grade</PrintablePrefix>
            <AutocompleteDropDown
              prefix="Grade"
              className="custom-1-scrollbar"
              by={filters.grade}
              selectCB={updateGradeDropDownCB}
              data={staticDropDownData.grades}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Course</PrintablePrefix>
            <AutocompleteDropDown
              prefix="Course"
              by={filters.courseId}
              selectCB={updateCourseDropDownCB}
              data={dropDownData.courses}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Class</PrintablePrefix>
            <AutocompleteDropDown
              prefix="Class"
              by={filters.classId}
              selectCB={updateClassesDropDownCB}
              data={dropDownData.classes}
              dropdownMenuIcon={<IconClass width={13} height={14} color={greyThemeDark1} margin="0 10px 0 0" />}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Group</PrintablePrefix>
            <AutocompleteDropDown
              prefix="Group"
              by={filters.groupId}
              selectCB={updateGroupsDropDownCB}
              data={dropDownData.groups}
              dropdownMenuIcon={<IconGroup width={20} height={19} color={greyThemeDark1} margin="0 7px 0 0" />}
            />
          </Col>
          {role !== "teacher" ? (
            <>
              <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                <PrintablePrefix>School</PrintablePrefix>
                <AutocompleteDropDown
                  prefix="School"
                  by={filters.schoolId}
                  selectCB={updateSchoolsDropDownCB}
                  data={dropDownData.schools}
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                <PrintablePrefix>Teacher</PrintablePrefix>
                <AutocompleteDropDown
                  prefix="Teacher"
                  by={filters.teacherId}
                  selectCB={updateTeachersDropDownCB}
                  data={dropDownData.teachers}
                />
              </Col>
            </>
          ) : null}
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <PrintablePrefix>Assessment Type</PrintablePrefix>
            <AutocompleteDropDown
              prefix="Assessment Type"
              by={filters.assessmentType}
              selectCB={updateAssessmentTypeDropDownCB}
              data={staticDropDownData.assessmentType}
            />
          </Col>
          {performanceBandRequired ? (
            <Col xs={12} sm={12} md={10} lg={6} xl={6}>
              <PrintablePrefix>Performance Band </PrintablePrefix>
              <ControlDropDown
                by={{ key: filters.performanceBandProfile || performanceBandProfiles[0]?._id }}
                selectCB={({ key }) => setPerformanceBand(key)}
                data={performanceBandProfiles.map(profile => ({ key: profile._id, title: profile.name }))}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </Col>
          ) : null}
          {isStandardProficiencyRequired && (
            <Col xs={12} sm={12} md={8} lg={4} xl={4}>
              <PrintablePrefix>Standard Proficiency</PrintablePrefix>
              <ControlDropDown
                by={filters.standardsProficiencyProfile || standardProficiencyProfiles[0]?._id}
                selectCB={({ key }) => setStandardsProficiency(key)}
                data={standardProficiencyList}
                prefix="Standard Proficiency"
                showPrefixOnSelected={false}
              />
            </Col>
          )}
          <Col xs={12} sm={12} md={10} lg={6} xl={6} className="single-assessment-report-test-autocomplete-container">
            <div>
              <PrintablePrefix>Assessment Name</PrintablePrefix>
            </div>
            <AutocompleteDropDown
              containerClassName="single-assessment-report-test-autocomplete"
              data={processedTestIds.testIds ? processedTestIds.testIds : []}
              by={testId}
              prefix="Assessment Name"
              selectCB={onTestIdChange}
            />
          </Col>
          <Col className={"single-assessment-report-go-button-container"}>
            <StyledGoButton type="primary" onClick={onGoClick}>
              Go
            </StyledGoButton>
          </Col>
        </Row>
      </StyledFilterWrapper>
    </div>
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
      getSARFilterDataRequestAction: getSARFilterDataRequestAction,
      loadPerformanceBand: receivePerformanceBandAction,
      loadStandardProficiency: receiveStandardsProficiencyAction,
      setFiltersAction: setFiltersAction,
      setTestIdAction: setTestIdAction,
      setPrevSARFilterDataAction,
      setPerformanceBand: setPerformanceBandProfileFilterAction,
      setStandardsProficiency: setStandardsProficiencyProfileFilterAction
    }
  )
);

const PrintablePrefix = styled.b`
  display: none;
  padding-left: 5px;
  float: left;

  @media print {
    display: block;
  }
`;

const StyledSingleAssessmentReportFilters = styled(SingleAssessmentReportFilters)`
  padding: 10px;
  .single-assessment-report-top-filter {
    .control-dropdown {
      margin: 0px;
      padding: 5px;

      button {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .autocomplete-dropdown {
      margin: 0px;
      padding: 5px;
      .ant-select-auto-complete {
        width: 100%;
      }
    }
  }

  .single-assessment-report-go-button-container {
    padding: 5px;
  }

  .single-assessment-report-bottom-filter {
    .single-assessment-report-test-autocomplete-container {
      flex: 1;
    }
    .single-assessment-report-test-autocomplete {
      margin: 0px;
      padding: 5px;
      width: 100%;
      .ant-select-show-search {
        width: 100%;
      }
    }
  }

  @media print {
    .control-dropdown,
    .autocomplete-dropdown {
      display: inline-block !important;
      padding: 0px 0px 0px 10px !important;
      width: auto !important;
    }

    .single-assessment-report-test-autocomplete {
      display: block !important;
    }

    .ant-dropdown-trigger,
    .ant-select-selection,
    .ant-input {
      border-color: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
      padding: 0px !important;
      height: auto !important;
    }

    .ant-select {
      height: 20px;
    }

    .ant-select-auto-complete.ant-select .ant-select-search--inline {
      margin-top: -5px;
    }
  }
`;

export default enhance(StyledSingleAssessmentReportFilters);
