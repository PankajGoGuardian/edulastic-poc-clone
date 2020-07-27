import React, { useEffect, useMemo, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, isEmpty, keyBy, uniqBy } from "lodash";
import qs from "qs";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Select } from "antd";
import { SelectInputStyled } from "@edulastic/common";

import { roleuser } from "@edulastic/constants";
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

import filtersDropDownData from "../static/json/filtersDropDownData.json";
import { getDomains } from "../utils";
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel
} from "../../../../common/styled";

const DropdownFilters = ({ dataCy, onChange, value = "", options = [] }) => (
  <SelectInputStyled
    data-cy={dataCy}
    onChange={onChange}
    value={`${value}`}
    optionFilterProp="children"
    getPopupContainer={triggerNode => triggerNode.parentNode}
    fontSize="11px"
    arrowFontSize="11px"
    height="34px"
    padding="8px 18px"
    noBorder
    style={{ border: "1px solid #e5e5e5" }}
  >
    {options.map(data => (
      <Select.Option key={`${data.key}`} value={`${data.key}`}>
        {data.title}
      </Select.Option>
    ))}
  </SelectInputStyled>
);

const StandardsFilters = ({
  filters,
  testIds,
  standardsFilters,
  browseStandards,
  user,
  interestedCurriculums,
  getStandardsBrowseStandardsRequest,
  getStandardsFiltersRequest,
  setFilters,
  setTestId,
  onGoClick: _onGoClick,
  location,
  style,
  setPrevBrowseStandards,
  setPrevStandardsFilters,
  prevBrowseStandards,
  prevStandardsFilters,
  extraFilter,
  loc: _loc,
  role
}) => {
  const preSelected = user?.districtId === "5ebbbb3b03b7ad0924d19c46";
  const browseStandardsReceiveCount = useRef(0);
  const standardsFilteresReceiveCount = useRef(0);

  const schoolYear = useMemo(() => {
    let _schoolYear = [];
    const arr = get(user, "orgData.terms", []);
    if (arr.length) {
      _schoolYear = arr.map(item => ({ key: item._id, title: item.name }));
    }
    return _schoolYear;
  }, [user]);

  const curriculums = useMemo(() => {
    let _curriculums = [];
    if (interestedCurriculums.length) {
      _curriculums = interestedCurriculums.map(item => ({ key: item._id, title: item.name }));
    }
    return _curriculums;
  }, [interestedCurriculums]);

  useEffect(() => {
    const search = qs.parse(location.search.substring(1));
    const defaultTermId =
      filters?.termId || standardsFilters?.filters?.termId || get(user, "orgData.defaultTermId", "");
    const urlSchoolYear =
      schoolYear.find(item => item.key === search.termId) ||
      schoolYear.find(item => item.key === defaultTermId) ||
      (schoolYear[0] ? schoolYear[0] : { key: "", title: "" });
    const urlSubject =
      curriculums.find(item => item.key === search.subject) ||
      (preSelected && curriculums.find(x => x.title === "Math - Common Core")) ||
      (curriculums[0] ? curriculums[0] : { key: "", title: "" });

    const gradesKeys = keyBy(search.grades);
    let urlGrade = filtersDropDownData.grades.filter(item => gradesKeys[item.key]);
    if (!urlGrade.length) {
      urlGrade = [
        (preSelected && filtersDropDownData.grades.find(x => x.title === "Grade 7")) || filtersDropDownData.grades[0]
      ];
    }

    setFilters({
      ...filters,
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grades: urlGrade.map(item => item.key)
    });

    if (browseStandards !== prevBrowseStandards) {
      const q = {
        curriculumId: urlSubject.key || undefined,
        grades: urlGrade.map(item => item.key)
      };
      getStandardsBrowseStandardsRequest(q);
    }

    if (prevStandardsFilters !== standardsFilters) {
      const _q = {
        termId: urlSchoolYear.key
      };
      getStandardsFiltersRequest(_q);
    }
  }, []);

  useEffect(() => {
    setFilters({
      ...filters,
      termId: filters?.termId || standardsFilters?.filters?.termId || get(user, "orgData.defaultTermId", "")
    });
  }, [standardsFilters]);

  const scaleInfo = get(standardsFilters, "scaleInfo", []);

  const domains = useMemo(() => {
    let _domains = [{ key: "All", title: "All Domains" }];
    if (browseStandards && !isEmpty(browseStandards)) {
      let tempArr = get(browseStandards, "data.result", []);

      let arr = [];
      if (tempArr.length) {
        tempArr = getDomains(tempArr);
        arr = tempArr.map(item => ({ key: item.tloId, title: item.tloIdentifier }));
      }
      _domains = _domains.concat(arr);
    }
    return _domains;
  }, [browseStandards]);

  if (browseStandards !== prevBrowseStandards && !isEmpty(browseStandards)) {
    setPrevBrowseStandards(browseStandards);

    // check if domainId in url is in the array if not select the first one

    const urlDomainId = domains.length > 1 ? domains.slice(1) : domains;
    // const domainIdsKeys = keyBy(search.domainIds?.split(","));
    // let urlDomainId = domains.filter((item, index) => domainIdsKeys[item.key]);
    // if (!urlDomainId.length) {
    //   urlDomainId = domains.filter((item, index) => index > 0);
    // }

    const _filters = {
      ...filters,
      domainIds: urlDomainId.map(item => item.key).join()
    };

    setFilters(_filters);

    const settings = {
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
    if (!isEmpty(standardsFilters)) {
      let tempArr = get(standardsFilters, "testData", []);
      tempArr = uniqBy(tempArr.filter(item => item.testId), "testId");
      tempArr = tempArr.map(item => ({
        key: item.testId,
        title: item.testName
      }));
      arr = arr.concat(tempArr);
    }
    return arr;
  }, [standardsFilters]);

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    // allTestIds Received

    const search = qs.parse(location.search.substring(1));
    setPrevStandardsFilters(standardsFilters);

    // filters fetched on page load
    const onLoadFilters = get(standardsFilters, "filters", []);
    const onLoadTestIds = get(standardsFilters, "testIds");

    // check if testIds in url are valid (present in the array)
    const urlTestIds = onLoadTestIds || search.testIds || [];
    const validTestIds = allTestIds.filter(test => urlTestIds.includes(test.key));
    setTestId(validTestIds);

    const settings = {
      filters: { ...filters, ...onLoadFilters },
      selectedTest: validTestIds
    };
    setFilters({ ...filters, ...onLoadFilters });

    if (standardsFilteresReceiveCount.current === 0 && browseStandardsReceiveCount.current > 0) {
      _onGoClick(settings);
    }

    standardsFilteresReceiveCount.current++;
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //

  const updateSchoolYearDropDownCB = selected => {
    const obj = {
      ...filters,
      termId: selected
    };
    setFilters(obj);

    const q = {
      termId: selected
    };
    getStandardsFiltersRequest(q);
  };
  const updateSubjectDropDownCB = selected => {
    const obj = {
      ...filters,
      subject: selected
    };
    setFilters(obj);

    const q = {
      curriculumId: selected || undefined,
      grades: obj.grades
    };
    getStandardsBrowseStandardsRequest(q);
  };
  const updateGradeDropDownCB = selected => {
    const obj = {
      ...filters,
      grades: [selected]
    };
    setFilters(obj);

    const q = {
      curriculumId: obj.subject || curriculums[0]?.key || undefined,
      grades: [selected]
    };
    getStandardsBrowseStandardsRequest(q);
  };

  const updateStandardProficiencyDropDownCB = selected => {
    const obj = {
      ...filters,
      profileId: selected.key
    };
    setFilters(obj);
  };

  const updateDomainDropDownCB = selected => {
    if (selected === "All") {
      let tempArr = domains.filter((item, index) => index > 0);
      tempArr = tempArr.map(item => item.key);

      const obj = {
        ...filters,
        domainIds: tempArr.join()
      };
      setFilters(obj);
    } else {
      const obj = {
        ...filters,
        domainIds: [selected].join()
      };
      setFilters(obj);
    }
  };

  const onSelectTest = test => {
    const items = toggleItem(testIds.map(_test => _test.key), test.key);
    setTestId(allTestIds.filter(_test => !!items.includes(_test.key)));
  };

  const onChangeTest = items => {
    if (!items.length) {
      setTestId([]);
    }
  };

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds
    };
    _onGoClick(settings);
  };

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  const selectedProficiencyId = useMemo(() => scaleInfo.find(s => s.default)?._id || "", [scaleInfo]);
  const standardProficiencyList = useMemo(() => scaleInfo.map(s => ({ key: s._id, title: s.name })), [scaleInfo]);

  const domainIdsArray = typeof filters.domainIds === "string" ? filters.domainIds.split(",") : filters.domainIds;
  const testNameFilter = (
    <SearchField>
      <FilterLabel>Assessment Name</FilterLabel>
      <MultipleSelect
        containerClassName="standards-gradebook-domain-autocomplete"
        data={(allTestIds || []).map(t => ({
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
  const domainFilter = (
    <SearchField>
      <FilterLabel>Domain</FilterLabel>
      <AutocompleteDropDown
        prefix="Domain"
        by={(domainIdsArray.length <= 1 && domainIdsArray[0]) || domains[0]}
        selectCB={updateDomainDropDownCB}
        data={domains}
      />
    </SearchField>
  );
  const stdProficiencyFilter = (
    <SearchField>
      <FilterLabel>Standard Proficiency</FilterLabel>
      <ControlDropDown
        by={filters.profileId || selectedProficiencyId}
        selectCB={updateStandardProficiencyDropDownCB}
        data={standardProficiencyList}
        prefix="Standard Proficiency"
        showPrefixOnSelected={false}
      />
    </SearchField>
  );
  const withTestName = [...extraFilter];
  // Re ordering the filters as per requirment
  if (_loc === "standards-gradebook") {
    withTestName.unshift(testNameFilter, domainFilter, stdProficiencyFilter);
  } else if (_loc === "standards-performance-summary") {
    const roleBasedPlaceMent = roleuser.DA_SA_ROLE_ARRAY.includes(role) ? 2 : 0;
    withTestName.splice(roleBasedPlaceMent, 0, testNameFilter, domainFilter);
    withTestName.push(stdProficiencyFilter);
  } else {
    withTestName.push(testNameFilter, domainFilter, stdProficiencyFilter);
  }
  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
      </GoButtonWrapper>
      <PerfectScrollbar>
        <SearchField>
          <FilterLabel>School Year</FilterLabel>
          <ControlDropDown
            by={filters.termId}
            selectCB={updateSchoolYearDropDownCB}
            data={schoolYear}
            prefix="School Year"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Grade</FilterLabel>
          <DropdownFilters
            className="custom-1-scrollbar"
            value={filters.grades[0]}
            onChange={updateGradeDropDownCB}
            options={filtersDropDownData.grades}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Subject</FilterLabel>
          <DropdownFilters
            value={filters.subject || curriculums[0]?.key}
            onChange={updateSubjectDropDownCB}
            options={curriculums}
          />
        </SearchField>
        {withTestName}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  );
};

const enhance = compose(
  connect(
    state => ({
      browseStandards: getReportsStandardsBrowseStandards(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state) || [],
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      prevBrowseStandards: getPrevBrowseStandardsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state)
    }),
    {
      getStandardsBrowseStandardsRequest: getStandardsBrowseStandardsRequestAction,
      getStandardsFiltersRequest: getStandardsFiltersRequestAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevBrowseStandards: setPrevBrowseStandardsAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction
    }
  )
);

export default enhance(StandardsFilters);
