import React, { useEffect, useMemo, useState, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col, Button } from "antd";
import { get, isEmpty, keyBy, uniqBy } from "lodash";
import qs from "qs";

import { AutocompleteDropDown } from "../../../../common/components/widgets/autocompleteDropDown";
import { ControlDropDown } from "../../../../common/components/widgets/controlDropDown";
import { MultipleSelect } from "../../../../common/components/widgets/MultipleSelect";
import { toggleItem } from "../../../../common/util";

import { getUserRole, getUser, getInterestedCurriculumsSelector } from "../../../../../src/selectors/user";

import {
  getFiltersSelector,
  getTestIdSelector,
  setFiltersAction,
  setTestIdAction,
  getStandardsBrowseStandardsRequestAction,
  getReportsStandardsBrowseStandards,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters,
  getPrevBrowseStandardsSelector,
  getPrevStandardsFiltersSelector,
  setPrevBrowseStandardsAction,
  setPrevStandardsFiltersAction
} from "../filterDataDucks";

import filtersDropDownData from "../static/json/filtersDropDownData";
import { getDomains } from "../../common/utils";
import { StyledFilterWrapper, StyledGoButton } from "../../../../common/styled";

const StandardsFilters = ({
  filters,
  testIds,
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
  style,
  setPrevBrowseStandardsAction,
  setPrevStandardsFiltersAction,
  prevBrowseStandards,
  prevStandardsFilters
}) => {
  const browseStandardsReceiveCount = useRef(0);
  const standardsFilteresReceiveCount = useRef(0);

  useEffect(() => {
    const search = qs.parse(location.search.substring(1));

    const defaultTermId = get(user, "orgData.defaultTermId", "");
    const urlSchoolYear =
      schoolYear.find((item, index) => item.key === search.termId) ||
      schoolYear.find((item, index) => item.key === defaultTermId) ||
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

    if (browseStandards !== prevBrowseStandards) {
      let q = {
        curriculumId: urlSubject.key || undefined,
        grades: urlGrade.map((item, index) => item.key)
      };
      getStandardsBrowseStandardsRequestAction(q);
    }

    if (prevStandardsFilters !== standardsFilters) {
      let _q = {
        termId: urlSchoolYear.key
      };
      getStandardsFiltersRequestAction(_q);
    }
  }, []);

  const scaleInfo = get(standardsFilters, "data.result.scaleInfo", []);

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

  const domains = useMemo(() => {
    let _domains = [{ key: "All", title: "All Domains" }];
    if (browseStandards && !isEmpty(browseStandards)) {
      let tempArr = get(browseStandards, "data.result", []);

      let arr = [];
      if (tempArr.length) {
        tempArr = getDomains(tempArr);
        arr = tempArr.map((item, index) => {
          return { key: item.tloId, title: item.tloIdentifier };
        });
      }
      _domains = _domains.concat(arr);
    }
    return _domains;
  }, [browseStandards]);

  if (browseStandards !== prevBrowseStandards && !isEmpty(browseStandards)) {
    // domainIds Received

    const search = qs.parse(location.search.substring(1));
    setPrevBrowseStandardsAction(browseStandards);

    // check if domainId in url is in the array if not select the first one

    const domainIdsKeys = keyBy(search.domainIds?.split(","));
    let urlDomainId = domains.filter((item, index) => domainIdsKeys[item.key]);
    if (!urlDomainId.length) {
      urlDomainId = domains.filter((item, index) => index > 0);
    }

    let _filters = {
      ...filters,
      domainIds: urlDomainId.map((item, index) => item.key).join()
    };

    setFiltersAction(_filters);

    let settings = {
      filters: { ..._filters },
      selectedTest: testIds
    };

    if (browseStandardsReceiveCount.current === 0 && standardsFilteresReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    browseStandardsReceiveCount.current++;
  }

  const allTestIds = useMemo(() => {
    let arr = [];
    if (standardsFilters && !isEmpty(standardsFilters)) {
      let tempArr = get(standardsFilters, "data.result.testData", []);
      tempArr = uniqBy(tempArr.filter(item => item.testId), "testId");
      tempArr = tempArr.map((item, index) => {
        return {
          key: item.testId,
          title: item.testName
        };
      });
      arr = arr.concat(tempArr);
    }
    return arr;
  }, [standardsFilters]);

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    // allTestIds Received

    const search = qs.parse(location.search.substring(1));
    setPrevStandardsFiltersAction(standardsFilters);

    // check if testIds in url are valid (present in the array)

    let urlTestIds = search.testIds || [];

    let validTestIds = allTestIds.filter(test => urlTestIds.includes(test.key));

    setTestIdAction(validTestIds);

    let settings = {
      filters: { ...filters },
      selectedTest: validTestIds
    };

    if (standardsFilteresReceiveCount.current === 0 && browseStandardsReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    standardsFilteresReceiveCount.current++;
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
      curriculumId: selected.key || undefined,
      grades: obj.grades
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
      curriculumId: obj.subject || undefined,
      grades: [selected.key]
    };
    getStandardsBrowseStandardsRequestAction(q);
  };

  const updateStandardProficiencyDropDownCB = selected => {
    let obj = {
      ...filters,
      profileId: selected.key
    };
    setFiltersAction(obj);
  };

  const updateDomainDropDownCB = selected => {
    if (selected.key === "All") {
      let tempArr = domains.filter((item, index) => index > 0);
      tempArr = tempArr.map(item => item.key);

      let obj = {
        ...filters,
        domainIds: tempArr.join()
      };
      setFiltersAction(obj);
    } else {
      let obj = {
        ...filters,
        domainIds: [selected.key].join()
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

  // const onTestIdChange = (selected, comData) => {
  //   setTestIdAction(selected.key);
  // };

  const onSelectTest = test => {
    const items = toggleItem(testIds.map(test => test.key), test.key);
    setTestIdAction(allTestIds.filter(test => !!items.includes(test.key)));
  };

  const onChangeTest = items => {
    if (!items.length) {
      setTestIdAction([]);
    }
  };

  const onGoClick = () => {
    let settings = {
      filters: { ...filters },
      selectedTest: testIds
    };
    _onGoClick(settings);
  };

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  const standardProficiencyList = useMemo(() => scaleInfo.map(s => ({ key: s._id, title: s.name })), [scaleInfo]);

  return (
    <div className={className} style={style}>
      <StyledFilterWrapper>
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
              by={filters.domainIds.length > 1 ? domains[0] : filters.domainIds[0] || domains[0]}
              selectCB={updateDomainDropDownCB}
              data={domains}
            />
          </Col>
          <Col xs={12} sm={12} md={8} lg={4} xl={4}>
            <ControlDropDown
              by={filters.profileId}
              selectCB={updateStandardProficiencyDropDownCB}
              data={standardProficiencyList}
              prefix="Standard Proficiency"
              showPrefixOnSelected={false}
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
            <MultipleSelect
              containerClassName="standards-gradebook-domain-autocomplete"
              data={allTestIds}
              valueToDisplay={testIds.length > 1 ? { key: "", title: "Multiple Assessment" } : testIds}
              by={testIds}
              prefix="Assessment Name"
              onSelect={onSelectTest}
              onChange={onChangeTest}
              placeholder="All Assessments"
            />
          </Col>
          <Col className={"standards-gradebook-go-button-container"}>
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
      browseStandards: getReportsStandardsBrowseStandards(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      prevBrowseStandards: getPrevBrowseStandardsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state)
    }),
    {
      getStandardsBrowseStandardsRequestAction: getStandardsBrowseStandardsRequestAction,
      getStandardsFiltersRequestAction: getStandardsFiltersRequestAction,
      setFiltersAction: setFiltersAction,
      setTestIdAction: setTestIdAction,
      setPrevBrowseStandardsAction,
      setPrevStandardsFiltersAction
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
