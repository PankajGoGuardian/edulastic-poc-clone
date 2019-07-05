import React, { useEffect, useMemo, useState, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { get, isEmpty, keyBy, uniqBy } from "lodash";
import qs from "qs";

import { AutocompleteDropDown } from "../../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../../common/components/widgets/controlDropDown";

import { getUserRole, getUser, getInterestedCurriculumsSelector } from "../../../../../src/selectors/user";

import {
  getFiltersSelector,
  getTestIdSelector,
  setFiltersAction,
  setTestIdAction,
  getStandardsBrowseStandardsRequestAction,
  getReportsStandardsBrowseStandards,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters
} from "../filterDataDucks";

import filtersDropDownData from "../static/json/filtersDropDownData";
import { getDomains } from "../../common/utils";

const StandardsFilters = ({
  filters,
  testId,
  standardsFilters,
  browseStandards,
  user,
  role,
  interestedCurriculums,
  getStandardsBrowseStandardsRequestAction,
  getStandardsFiltersRequestAction,
  setFiltersAction,
  setTestIdAction,
  onGoClick: _onGoClick,
  location,
  className,
  style
}) => {
  const firstRender = useRef(true);
  const browseStandardsReceiveCount = useRef(0);
  const standardsFilteresReceiveCount = useRef(0);

  const [prevBorwseStandards, setPrevBorwseStandards] = useState(null);
  const [prevStandardsFilters, setPrevStandardsFilters] = useState(null);

  const [domains, setDomains] = useState([{ key: "All", title: "All Domains" }]);
  const [testIds, setTestIds] = useState([{ key: "All", title: "All Assessments" }]);

  const getTitleByTestId = testId => {
    let arr = get(standardsFilters, "result.testData", []);
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
      tempArr = getDomains(tempArr);
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
      urlDomainId = _domains.filter((item, index) => index > 0);
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
    if (browseStandardsReceiveCount.current === 0 && standardsFilteresReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    browseStandardsReceiveCount.current++;
  }

  if (prevStandardsFilters != standardsFilters && !isEmpty(standardsFilters)) {
    // testIds Received
    const search = qs.parse(location.search.substring(1));
    setPrevStandardsFilters(standardsFilters);

    let tempArr = get(standardsFilters, "result.testData", []);
    let arr = [{ key: "All", title: "All Assessments" }];
    tempArr = uniqBy(tempArr.filter(item => item.testId), "testId");
    tempArr = tempArr.map((item, index) => {
      return {
        key: item.testId,
        title: item.testName
      };
    });
    arr = arr.concat(tempArr);

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

    if (standardsFilteresReceiveCount.current === 0 && browseStandardsReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    standardsFilteresReceiveCount.current++;
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
    getStandardsBrowseStandardsRequestAction(q);

    let _q = {
      termId: urlSchoolYear.key
    };
    getStandardsFiltersRequestAction(_q);
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
    getStandardsFiltersRequestAction(q);
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
    getStandardsBrowseStandardsRequestAction(q);
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
    getStandardsBrowseStandardsRequestAction(q);
  };
  const updateDomainDropDownCB = selected => {
    if (selected.key === "All") {
      let tempArr = domains.filter((item, index) => index > 0);
      tempArr = tempArr.map(item => item.key);
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

  // IMPORTANT: To be implemented later
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
        {/* // IMPORTANT: To be implemented later */}
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
      browseStandards: getReportsStandardsBrowseStandards(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      testId: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state)
    }),
    {
      getStandardsBrowseStandardsRequestAction: getStandardsBrowseStandardsRequestAction,
      getStandardsFiltersRequestAction: getStandardsFiltersRequestAction,
      setFiltersAction: setFiltersAction,
      setTestIdAction: setTestIdAction
    }
  )
);

const StyledStandardsFilters = styled(StandardsFilters)`
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

export default enhance(StyledStandardsFilters);
