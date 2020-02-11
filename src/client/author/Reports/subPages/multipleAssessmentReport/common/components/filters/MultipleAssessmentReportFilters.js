import React, { useEffect, useMemo, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { find, get, isEmpty, map } from "lodash";
import queryString from "query-string";

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
import { getUserRole } from "../../../../../../src/selectors/user";
import { getUser } from "../../../../../../src/selectors/user";

import staticDropDownData from "../../static/staticDropDownData";
import school from "@edulastic/api/src/school";
import { StyledFilterWrapper, StyledGoButton } from "../../../../../common/styled";

const SingleAssessmentReportFilters = ({
  MARFilterData,
  filters,
  testIds,
  user,
  role,
  getMARFilterDataRequestAction,
  setFiltersAction,
  setTestIdAction,
  onGoClick: _onGoClick,
  location,
  className,
  history,
  style,
  setPrevMARFilterDataAction,
  prevMARFilterData,
  loading,
  performanceBandRequired
}) => {
  const profiles = MARFilterData?.data?.result?.bandInfo || [];
  const getTitleByTestId = testId => {
    let arr = get(MARFilterData, "data.result.testData", []);
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
    if (MARFilterData !== prevMARFilterData) {
      const search = queryString.parse(location.search);
      const termId =
        search.termId || get(user, "orgData.defaultTermId", "") || (schoolYear.length ? schoolYear[0].key : "");
      let q = {
        termId
      };
      getMARFilterDataRequestAction(q);
    }
  }, []);

  let processedTestIds;
  let dropDownData;

  if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
    const search = queryString.parse(location.search, { arrayFormat: "index" });

    dropDownData = getDropDownData(MARFilterData, user);
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
        title: "All Teachers"
      };
    }
    const urlAssessmentType = staticDropDownData.assessmentType.find(
      (item, index) => item.key === search.assessmentType
    ) || {
      key: "All",
      title: "All Assignment Types"
    };

    const testIdsArr = [].concat(search.testIds?.split(",") || []);

    let urlTestIds = testIdsArr.map(key => find(dropDownData.testIdArr, test => test.key == key)).filter(item => item);

    let obtainedFilters = {
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grade: urlGrade.key,
      courseId: urlCourseId.key,
      groupId: urlGroupId.key,
      schoolId: urlSchoolId.key,
      teacherId: urlTeacherId.key,
      assessmentType: urlAssessmentType.key,
      testIds: urlTestIds.length ? urlTestIds.join(",") : ""
    };

    dropDownData = filteredDropDownData(MARFilterData, user, obtainedFilters);

    processedTestIds = processTestIds(dropDownData, obtainedFilters, "", role);

    let urlParams = { ...obtainedFilters };

    if (role === "teacher") {
      delete urlParams.schoolId;
      delete urlParams.teacherId;
    }

    setFiltersAction(urlParams);
    setTestIdAction(urlTestIds);

    _onGoClick({
      selectedTest: urlTestIds,
      filters: urlParams
    });

    setPrevMARFilterDataAction(MARFilterData);
  }

  dropDownData = useMemo(() => filteredDropDownData(MARFilterData, user, { ...filters }), [MARFilterData, filters]);

  processedTestIds = useMemo(() => {
    return processTestIds(
      dropDownData,
      {
        termId: filters.termId,
        subject: filters.subject,
        grade: filters.grade,
        courseId: filters.courseId,
        groupId: filters.groupId,
        schoolId: filters.schoolId,
        teacherId: filters.teacherId,
        assessmentType: filters.assessmentType
      },
      testIds,
      role
    );
  }, [MARFilterData, filters, testIds]);

  const updateSchoolYearDropDownCB = selected => {
    let pathname = location.pathname;
    let _filters = { ...filters };
    _filters.termId = selected.key;
    history.push(pathname + "?" + queryString.stringify(_filters));

    let q = {
      termId: selected.key
    };

    getMARFilterDataRequestAction(q);
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

  const onChangePerformanceBand = selected => {
    let obj = {
      filters: {
        ...filters,
        profileId: selected.key
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

  const onGoClick = () => {
    let settings = {
      filters: { ...filters },
      selectedTest: testIds
    };
    _onGoClick(settings);
  };

  const onSelectTest = test => {
    const items = toggleItem(map(testIds, test => test.key), test.key);
    setTestIdAction(processedTestIds.testIds.filter(test => !!items.includes(test.key)));
  };

  const onChangeTest = items => {
    if (!items.length) {
      setTestIdAction([]);
    }
  };

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
        <Row type="flex" className="single-assessment-report-top-filter">
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <ControlDropDown
              by={filters.termId}
              selectCB={updateSchoolYearDropDownCB}
              data={dropDownData.schoolYear}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <ControlDropDown
              by={filters.subject}
              selectCB={updateSubjectDropDownCB}
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <AutocompleteDropDown
              prefix="Grade"
              className="custom-1-scrollbar"
              by={filters.grade}
              selectCB={updateGradeDropDownCB}
              data={staticDropDownData.grades}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <AutocompleteDropDown
              prefix="Course"
              by={filters.courseId}
              selectCB={updateCourseDropDownCB}
              data={dropDownData.courses}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <AutocompleteDropDown
              prefix="Class"
              by={filters.groupId}
              selectCB={updateClassesDropDownCB}
              data={dropDownData.groups}
            />
          </Col>
          {role !== "teacher" ? (
            <>
              <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                <AutocompleteDropDown
                  prefix="School"
                  by={filters.schoolId}
                  selectCB={updateSchoolsDropDownCB}
                  data={dropDownData.schools}
                />
              </Col>
              <Col xs={12} sm={12} md={8} lg={4} xl={4}>
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
            <AutocompleteDropDown
              prefix="Assessment Type"
              by={filters.assessmentType}
              selectCB={updateAssessmentTypeDropDownCB}
              data={staticDropDownData.assessmentType}
            />
          </Col>
          {performanceBandRequired ? (
            <Col xs={12} sm={12} md={8} lg={4} xl={4}>
              <ControlDropDown
                by={{ key: filters.profileId }}
                selectCB={onChangePerformanceBand}
                data={profiles.map(p => ({ key: p._id, title: p.name }))}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </Col>
          ) : null}
          <Col xs={12} sm={12} md={10} lg={6} xl={6} className="single-assessment-report-test-autocomplete-container">
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
          </Col>
          <Col className={"single-assessment-report-go-button-container"}>
            <StyledGoButton type="primary" shape="round" onClick={onGoClick}>
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
      MARFilterData: getReportsMARFilterData(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      prevMARFilterData: getReportsPrevMARFilterData(state),
      loading: getReportsMARFilterLoadingState(state)
    }),
    {
      getMARFilterDataRequestAction: getMARFilterDataRequestAction,
      setFiltersAction: setFiltersAction,
      setTestIdAction: setTestIdAction,
      setPrevMARFilterDataAction
    }
  )
);

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
`;

export default enhance(StyledSingleAssessmentReportFilters);
