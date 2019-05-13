import React, { useEffect, useMemo, useState, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { get, isEmpty, keyBy } from "lodash";
import qs from "qs";

import { AutocompleteDropDown } from "../../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../../common/components/widgets/controlDropDown";

import { getUserRole, getUser, getInterestedCurriculumsSelector } from "../../../../../src/selectors/user";

import {
  getFiltersSelector,
  getTestIdSelector,
  setFiltersAction,
  setTestIdAction,
  getStandardsGradebookBrowseStandardsRequestAction,
  getReportsStandardsGradebookBrowseStandards,
  getStandardsGradebookFiltersRequestAction,
  getReportsStandardsGradebookFilters
} from "../ducks";

import filtersDropDownData from "../static/json/filtersDropDownData";

const StandardsGradebookFilters = ({
  filters,
  testId,
  standardsGradebookFilters,
  browseStandards,
  user,
  role,
  interestedCurriculums,
  getStandardsGradebookBrowseStandardsRequestAction,
  getStandardsGradebookFiltersRequestAction,
  setFiltersAction,
  setTestIdAction,
  onGoClick: _onGoClick,
  location,
  className,
  style
}) => {
  const firstRender = useRef(true);
  const browseStandardsReceiveCount = useRef(0);
  const standardsGradebookFilteresReceiveCount = useRef(0);

  const [prevBorwseStandards, setPrevBorwseStandards] = useState(null);
  const [prevStandardsGradebookFilters, setPrevStandardsGradebookFilters] = useState(null);

  const [domains, setDomains] = useState([{ key: "All", title: "All Domains" }]);
  const [testIds, setTestIds] = useState([{ key: "All", title: "All Assessments" }]);

  const getTitleByTestId = testId => {
    let arr = get(standardsGradebookFilters, "result.testData", []);
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
  }, [user]);

  const curriculums = useMemo(() => {
    let curriculums = [];
    if (interestedCurriculums.length) {
      curriculums = interestedCurriculums.map((item, index) => {
        return { key: item._id, title: item.name };
      });
    }
    return curriculums;
  }, [interestedCurriculums]);

  if (prevBorwseStandards !== browseStandards && !isEmpty(browseStandards)) {
    // domainIds Received
    const search = qs.parse(location.search.substring(1));
    setPrevBorwseStandards(browseStandards);

    let tempArr = get(browseStandards, "data.result", []);
    let _domains = [{ key: "All", title: "All Domains" }];
    let arr = [];
    if (tempArr.length) {
      let uniqueMap = {};
      tempArr = tempArr.filter((item, index) => {
        if (!uniqueMap[item.tloId]) {
          uniqueMap[item.tloId] = true;
          return true;
        }
      });
      arr = tempArr.map((item, index) => {
        return { key: item.tloId, title: item.tloIdentifier };
      });
    }

    _domains = _domains.concat(arr);
    setDomains(_domains);
    // check if domainId in url is in the array if not select the first one

    const domainIdsKeys = keyBy(search.domainIds);
    let urlDomainId = _domains.filter((item, index) => domainIdsKeys[item.key]);
    if (!urlDomainId.length) {
      urlDomainId = [..._domains];
      if (urlDomainId.length > 1) urlDomainId.shift();
    }

    let _filters = {
      ...filters,
      domainIds: urlDomainId.map((item, index) => item.key)
    };

    setFiltersAction(_filters);

    let settings = {
      filters: { ..._filters },
      selectedTest: { key: testId, title: getTitleByTestId(testId) }
    };
    if (browseStandardsReceiveCount.current === 0 && standardsGradebookFilteresReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    browseStandardsReceiveCount.current++;
  }

  if (prevStandardsGradebookFilters != standardsGradebookFilters && !isEmpty(standardsGradebookFilters)) {
    // testIds Received
    const search = qs.parse(location.search.substring(1));
    setPrevStandardsGradebookFilters(standardsGradebookFilters);

    let tempArr = get(standardsGradebookFilters, "result.testData", []);
    let arr = [{ key: "All", title: "All Assessments" }];
    let uniqueMap = [];
    for (let item of tempArr) {
      if (!uniqueMap[item.testId]) {
        uniqueMap[item.testId] = true;
        arr.push({
          key: item.testId,
          title: item.testName
        });
      }
    }
    let _testIds = arr;
    setTestIds(_testIds);

    // now check if testId in url is in the array if not select the first one
    let urlTestId = _testIds.find((item, index) => {
      if (item.key === search.testId) {
        return true;
      }
    });

    let _testId = testId;
    if (!urlTestId && _testIds.length) {
      _testId = _testIds[0].key;
      setTestIdAction(_testId);
    } else if (!urlTestId) {
      _testId = "";
      setTestIdAction(_testId);
    }

    let settings = {
      filters: { ...filters },
      selectedTest: { key: testId, title: getTitleByTestId(_testId) }
    };

    if (standardsGradebookFilteresReceiveCount.current === 0 && browseStandardsReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    standardsGradebookFilteresReceiveCount.current++;
  }

  if (firstRender.current === true) {
    const search = qs.parse(location.search.substring(1));

    const urlSchoolYear =
      schoolYear.find((item, index) => item.key === search.termId) ||
      (schoolYear[0] ? schoolYear[0] : { key: "", title: "" });
    const urlSubject =
      curriculums.find((item, index) => item.key === search.subject) ||
      (curriculums[0] ? curriculums[0] : { key: "", title: "" });

    const gradesKeys = keyBy(search.grades);
    let urlGrade = filtersDropDownData.grades.filter((item, index) => gradesKeys[item.key]);
    if (!urlGrade.length) {
      urlGrade = [filtersDropDownData.grades[0]];
    }

    setFiltersAction({
      ...filters,
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grades: urlGrade.map((item, index) => item.key)
    });

    let q = {
      curriculumId: urlSubject.key,
      grades: urlGrade.map((item, index) => item.key)
    };
    getStandardsGradebookBrowseStandardsRequestAction(q);

    let _q = {
      termId: urlSchoolYear.key
    };
    getStandardsGradebookFiltersRequestAction(_q);
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //

  const updateSchoolYearDropDownCB = selected => {
    let obj = {
      ...filters,
      termId: selected.key
    };
    setFiltersAction(obj);

    let q = {
      termId: selected.key
    };
    getStandardsGradebookFiltersRequestAction(q);
  };
  const updateSubjectDropDownCB = selected => {
    let obj = {
      ...filters,
      subject: selected.key
    };
    setFiltersAction(obj);

    let q = {
      curriculumId: selected.key,
      grades: obj.grade
    };
    getStandardsGradebookBrowseStandardsRequestAction(q);
  };
  const updateGradeDropDownCB = selected => {
    let obj = {
      ...filters,
      grades: [selected.key]
    };
    setFiltersAction(obj);

    let q = {
      curriculumId: obj.subject,
      grades: [selected.key]
    };
    getStandardsGradebookBrowseStandardsRequestAction(q);
  };
  const updateDomainDropDownCB = selected => {
    if (selected.key === "All") {
      let tempArr = domains.map((item, index) => item.key);
      tempArr.shift();
      let obj = {
        ...filters,
        domainIds: tempArr
      };
      setFiltersAction(obj);
    } else {
      let obj = {
        ...filters,
        domainIds: [selected.key]
      };
      setFiltersAction(obj);
    }
  };

  // const updateClassSectionDropDownCB = selected => {
  //   let obj = {
  //     ...filters,
  //     groupId: selected.key
  //   };
  //   setFiltersAction(obj);
  // };

  // const updateAssessmentTypeDropDownCB = selected => {
  //   let obj = {
  //     ...filters,
  //     assessmentType: selected.key
  //   };
  //   setFiltersAction(obj);
  // };

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

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  firstRender.current = false;

  return (
    <div className={className} style={style}>
      <Row type="flex" className="standards-gradebook-top-filter">
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <ControlDropDown
            by={filters.termId}
            selectCB={updateSchoolYearDropDownCB}
            data={schoolYear}
            prefix="School Year"
            showPrefixOnSelected={false}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <ControlDropDown
            by={filters.subject}
            selectCB={updateSubjectDropDownCB}
            data={curriculums}
            prefix="Subject"
            showPrefixOnSelected={false}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <AutocompleteDropDown
            prefix="Grade"
            className="custom-1-scrollbar"
            by={filters.grades[0]}
            selectCB={updateGradeDropDownCB}
            data={filtersDropDownData.grades}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <AutocompleteDropDown
            prefix="Domain"
            by={filters.domainIds.length > 1 ? domains[0] : filters.domainIds[0]}
            selectCB={updateDomainDropDownCB}
            data={domains}
          />
        </Col>
        {/* <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <AutocompleteDropDown
            prefix="Class Section"
            by={filters.groupId}
            selectCB={updateClassSectionDropDownCB}
            data={dropDownData.classSections}
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4} xl={4}>
          <ControlDropDown
            prefix="Assessment Type"
            by={filters.assessmentType}
            selectCB={updateAssessmentTypeDropDownCB}
            data={filtersDropDownData.assessmentType}
          />
        </Col> */}
      </Row>
      <Row type="flex" className="standards-gradebook-bottom-filter">
        <Col className="standards-gradebook-domain-autocomplete-container">
          <AutocompleteDropDown
            containerClassName="standards-gradebook-domain-autocomplete"
            data={testIds}
            by={testId}
            prefix="Assessment Name"
            selectCB={onTestIdChange}
          />
        </Col>
        <Col className={"standards-gradebook-go-button-container"}>
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
      browseStandards: getReportsStandardsGradebookBrowseStandards(state),
      standardsGradebookFilters: getReportsStandardsGradebookFilters(state),
      filters: getFiltersSelector(state),
      testId: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state)
    }),
    {
      getStandardsGradebookBrowseStandardsRequestAction: getStandardsGradebookBrowseStandardsRequestAction,
      getStandardsGradebookFiltersRequestAction: getStandardsGradebookFiltersRequestAction,
      setFiltersAction: setFiltersAction,
      setTestIdAction: setTestIdAction
    }
  )
);

const StyledStandardsGradebookFilters = styled(StandardsGradebookFilters)`
  padding: 10px;
  .standards-gradebook-top-filter {
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

  .standards-gradebook-go-button-container {
    padding: 5px;
  }

  .standards-gradebook-bottom-filter {
    .standards-gradebook-domain-autocomplete-container {
      flex: 1;
    }
    .standards-gradebook-domain-autocomplete {
      margin: 0px;
      padding: 5px;
      width: 100%;
      .ant-select-show-search {
        width: 100%;
      }
    }
  }
`;

export default enhance(StyledStandardsGradebookFilters);
