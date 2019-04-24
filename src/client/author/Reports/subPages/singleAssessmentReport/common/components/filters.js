import React, { useEffect, useMemo, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { get, isEmpty, groupBy } from "lodash";
import queryString from "query-string";

import { AutocompleteDropDown } from "../../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../../common/components/widgets/controlDropDown";
import { NormalDropDown } from "../../../../common/components/widgets/normalDropDown";

import { getDropDownTestIds } from "../../../../common/util";
import { getSARFilterDataRequestAction, getReportsSARFilterData } from "../filterDataDucks";
import { getUserRole } from "../../../../../src/selectors/user";
import { getUser } from "../../../../../src/selectors/user";

import staticDropDownData from "../static/staticDropDownData";

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
  user,
  role,
  getSARFilterDataRequestAction,
  onTestIdChange: _onTestIdChange,
  onGoClick: _onGoClick,
  location,
  className,
  style
}) => {
  const [testIds, setTestIds] = useState([]);
  const [selectedTest, setSelectedTest] = useState({ key: "", title: "" });

  const search = queryString.parse(location.search);
  let {
    termId = "",
    subject = "All",
    grade = "All",
    courseId = "All",
    groupId = "All",
    schoolId = "All",
    teacherId = "All",
    assessmentType = "All"
  } = search;

  let defaults;
  if (role !== "teacher") {
    defaults = {
      termId,
      subject,
      grade,
      courseId,
      groupId,
      schoolId,
      teacherId,
      assessmentType
    };
  } else {
    defaults = {
      termId,
      subject,
      grade,
      courseId,
      groupId,
      assessmentType
    };
  }
  const [filters, setFilters] = useState(defaults);

  const getTitleByTestId = testId => {
    let arr = get(SARFilterData, "data.result.testData", []);
    let item = arr.find(o => o.testId === testId);

    if (item) {
      return item.testName;
    }
    return "";
  };

  useEffect(() => {
    getSARFilterDataRequestAction();
  }, []);

  const updateTestIds = (_dropDownData, currentFilter) => {
    let filtered = _dropDownData.orgDataArr.filter((item, index) => {
      if (role !== "teacher") {
        if (
          item.termId === currentFilter.termId &&
          (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
          (item.grade === currentFilter.grade || currentFilter.grade === "All") &&
          (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
          (item.groupId === currentFilter.groupId || currentFilter.groupId === "All") &&
          (item.schoolId === currentFilter.schoolId || currentFilter.schoolId === "All") &&
          (item.teacherId === currentFilter.teacherId || currentFilter.teacherId === "All") &&
          (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All")
        ) {
          return true;
        }
      } else {
        if (
          item.termId === currentFilter.termId &&
          (item.subject === currentFilter.subject || currentFilter.subject === "All") &&
          (item.grade === currentFilter.grade || currentFilter.grade === "All") &&
          (item.courseId === currentFilter.courseId || currentFilter.courseId === "All") &&
          (item.groupId === currentFilter.groupId || currentFilter.groupId === "All") &&
          (item.assessmentType === currentFilter.assessmentType || currentFilter.assessmentType === "All")
        ) {
          return true;
        }
      }
    });

    let groupIdMap = {};
    for (let item of filtered) {
      if (!groupIdMap[item.groupId]) {
        groupIdMap[item.groupId] = item;
      }
    }

    let arr = _dropDownData.testDataArr.filter((item, index) => (groupIdMap[item.groupId] ? true : false));
    let finalTestIds = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      finalTestIds[i] = { key: arr[i].testId, title: arr[i].testName };
    }

    let isPresent = arr.find((item, index) => (item.testId === selectedTest.key ? true : false));

    let selected = selectedTest;
    if (!isPresent && arr.length) {
      selected = finalTestIds[0];
      setSelectedTest(selected);
    } else if (!isPresent && !arr.length) {
      selected = { key: "", title: "" };
      setSelectedTest(selected);
    }

    setTestIds(finalTestIds);

    return { selectedTest: selected, testIds: finalTestIds };
  };

  const dropDownData = useMemo(() => {
    let currentFilter = { ...filters };
    let schoolYear = [];
    let arr = get(user, "orgData.terms", []);
    if (arr.length) {
      schoolYear = arr.map((item, index) => {
        return { key: item._id, title: item.name };
      });
      currentFilter = { ...filters, termId: schoolYear[0].key };
      setFilters(currentFilter);
    }
    // -----|-----||-----|----- //
    const orgDataArr = get(SARFilterData, "data.result.orgData", []);
    const testDataArr = get(SARFilterData, "data.result.testData", []);
    testDataArr.sort((a, b) => {
      return a - b;
    });

    // For Group Id
    let byGroupId = groupBy(orgDataArr.filter((item, index) => (item.groupId ? true : false)), "groupId");
    let groupIdArr = Object.keys(byGroupId).map((item, index) => {
      return {
        key: byGroupId[item][0].groupId,
        title: byGroupId[item][0].groupName
      };
    });
    groupIdArr.unshift({
      key: "All",
      title: "All Classes"
    });

    // For Course Id
    let byCourseId = groupBy(orgDataArr.filter((item, index) => (item.courseId ? true : false)), "courseId");
    let courseIdArr = Object.keys(byCourseId).map((item, index) => {
      return {
        key: byCourseId[item][0].courseId,
        title: byCourseId[item][0].courseName
      };
    });
    courseIdArr.unshift({
      key: "All",
      title: "All Courses"
    });

    // Only For district admin
    // For School Id
    let bySchoolId = groupBy(orgDataArr.filter((item, index) => (item.schoolId ? true : false)), "schoolId");
    let schoolIdArr = Object.keys(bySchoolId).map((item, index) => {
      return {
        key: bySchoolId[item][0].schoolId,
        title: bySchoolId[item][0].schoolName
      };
    });
    schoolIdArr.unshift({
      key: "All",
      title: "All Schools"
    });

    // For Teacher Id
    let byTeacherId = groupBy(orgDataArr.filter((item, index) => (item.teacherId ? true : false)), "teacherId");
    let teacherIdArr = Object.keys(byTeacherId).map((item, index) => {
      return {
        key: byTeacherId[item][0].teacherId,
        title: byTeacherId[item][0].teacherName
      };
    });
    teacherIdArr.unshift({
      key: "All",
      title: "All Teachers"
    });

    let testIdArr = getDropDownTestIds(testDataArr);
    if (testIdArr.length) {
      let o = updateTestIds({ orgDataArr, testDataArr }, currentFilter);
      let testId = getTestIdFromURL(location.pathname);
      if (testId) {
        let searchItem = o.testIds.find(item => {
          if (item.key === testId) {
            return true;
          }
        });
        if (searchItem) {
          let obj = { key: testId, title: getTitleByTestId(testId) };
          setSelectedTest(obj);
          _onTestIdChange(obj, currentFilter);
        } else {
          _onTestIdChange(o.selectedTest, currentFilter);
        }
      } else {
        _onTestIdChange(o.selectedTest, currentFilter);
      }
    }

    return {
      orgDataArr: orgDataArr,
      testDataArr: testDataArr,
      testIdArr: testIdArr,
      groups: groupIdArr,
      courses: courseIdArr,
      schools: schoolIdArr,
      teachers: teacherIdArr,
      schoolYear: schoolYear
    };
  }, [SARFilterData, user]);

  const onTestIdChange = (selected, comData) => {
    setSelectedTest(selected);
  };

  const updateSchoolYearDropDownCB = selected => {
    let obj = {
      ...filters,
      termId: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateSubjectDropDownCB = selected => {
    let obj = {
      ...filters,
      subject: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateGradeDropDownCB = selected => {
    let obj = {
      ...filters,
      grade: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateCourseDropDownCB = selected => {
    let obj = {
      ...filters,
      courseId: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateClassesDropDownCB = selected => {
    let obj = {
      ...filters,
      groupId: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateSchoolsDropDownCB = selected => {
    let obj = {
      ...filters,
      schoolId: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateTeachersDropDownCB = selected => {
    let obj = {
      ...filters,
      teacherId: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };
  const updateAssessmentTypeDropDownCB = selected => {
    let obj = {
      ...filters,
      assessmentType: selected.key
    };
    setFilters(obj);
    updateTestIds(dropDownData, obj);
  };

  const onGoClick = () => {
    let settings = {
      filters: { ...filters },
      selectedTest
    };
    _onGoClick(settings);
  };

  return (
    <div className={className} style={style}>
      <Row type="flex" className="single-assessment-report-top-filter">
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <ControlDropDown
            prefix="School Year:"
            by={filters.termId}
            selectCB={updateSchoolYearDropDownCB}
            data={dropDownData.schoolYear}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <ControlDropDown
            prefix="Subject:"
            by={filters.subject === "All" ? { key: "All", title: "All Subjects" } : filters.subject}
            selectCB={updateSubjectDropDownCB}
            data={staticDropDownData.subjects}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <AutocompleteDropDown
            prefix="Grade"
            className="custom-1-scrollbar"
            by={filters.grade === "All" ? { key: "All", title: "All Grades" } : filters.grade}
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
            prefix="Classes"
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
            by={
              filters.assessmentType === "All" ? { key: "All", title: "All Assessment Types" } : filters.assessmentType
            }
            selectCB={updateAssessmentTypeDropDownCB}
            data={staticDropDownData.assessmentType}
          />
        </Col>
      </Row>
      <Row type="flex" className="single-assessment-report-bottom-filter">
        <Col className="single-assessment-report-test-autocomplete-container">
          <AutocompleteDropDown
            containerClassName="single-assessment-report-test-autocomplete"
            data={testIds}
            by={selectedTest}
            prefix="Assessment Name"
            selectCB={onTestIdChange}
          />
        </Col>
        <Col className={"single-assessment-report-go-button-container"}>
          <Button type="primary" shape="round" onClick={onGoClick}>
            Go
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const enhance = compose(
  connect(
    state => ({
      SARFilterData: getReportsSARFilterData(state),
      role: getUserRole(state),
      user: getUser(state)
    }),
    {
      getSARFilterDataRequestAction: getSARFilterDataRequestAction
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
