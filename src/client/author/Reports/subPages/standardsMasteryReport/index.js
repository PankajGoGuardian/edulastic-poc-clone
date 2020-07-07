/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useMemo, useState } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import { FlexContainer } from "@edulastic/common";

import StandardsGradebook from "./standardsGradebook";
import StandardsPerfromance from "./standardsPerformance";

import StandardsFilters from "./common/components/Filters";
import { getNavigationTabLinks } from "../../common/util";
import { ControlDropDown } from "../../common/components/widgets/controlDropDown";
import navigation from "../../common/static/json/navigation.json";

import { setSMRSettingsAction, getReportsSMRSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { FilterIcon, ReportContaner, SearchField, FilterLabel } from "../../common/styled";

import { getReportsStandardsGradebook } from "./standardsGradebook/ducks";
import dropDownFormat from "./standardsGradebook/static/json/dropDownFormat.json";
import { getUserRole } from "../../../src/selectors/user";
import { getFilterDropDownData } from "./standardsGradebook/utils/transformers";
import { getDropDownData } from "./standardsPerformance/utils/transformers";
import { getReportsStandardsFilters, getFiltersSelector } from "./common/filterDataDucks";

const StandardsMasteryReportContainer = props => {
  const {
    gradebookSettings,
    setSMRSettings,
    resetAllReports,
    premium,
    setShowHeader,
    updateNavigation,
    loc,
    history,
    location,
    match,
    role,
    standardsGradebook,
    onRefineResultsCB,
    showFilter,
    standardsFilters,
    filters
  } = props;

  const firstRender = useRef(true);

  useEffect(
    () => () => {
      console.log("Standards Mastery Report Component Unmount");
      resetAllReports();
    },
    []
  );

  useEffect(() => {
    setSMRSettings({
      ...gradebookSettings,
      requestFilters: { ...(filters || standardsFilters?.filters) }
    });
  }, []);

  const computeChartNavigationLinks = filt => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt);
      const obj = {};
      arr.map(item => {
        const val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[loc].group], draft => {
        getNavigationTabLinks(draft, `?${qs.stringify(obj, { arrayFormat: "comma" })}`);
      });
    }
    return [];
  };

  useEffect(() => {
    if (!firstRender.current) {
      const obj = {};
      const arr = Object.keys(gradebookSettings.requestFilters);
      arr.map(item => {
        if (gradebookSettings.requestFilters[item] === "") {
          obj[item] = "All";
        } else {
          obj[item] = gradebookSettings.requestFilters[item];
        }
      });
      obj.testIds = gradebookSettings.selectedTest.map(items => items.key).join();
      const path = qs.stringify(obj, { arrayFormat: "comma" });
      history.push(`?${path}`);
    }
    firstRender.current = false;

    const computedChartNavigatorLinks = computeChartNavigationLinks(gradebookSettings.requestFilters);
    updateNavigation(!premium ? [computedChartNavigatorLinks[1]] : computedChartNavigatorLinks);
  }, [gradebookSettings]);

  const onStandardsGradebookGoClick = _settings => {
    const obj = {};
    const arr = Object.keys(_settings.filters);
    arr.map(item => {
      if (_settings.filters[item] === "All") {
        obj[item] = "";
      } else {
        obj[item] = _settings.filters[item];
      }
    });

    setSMRSettings({
      ...gradebookSettings,
      selectedTest: _settings.selectedTest,
      requestFilters: { ...obj }
    });
  };

  const toggleFilter = e => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter);
    }
  };

  const [ddfilter, setDdFilter] = useState({
    schoolId: "all",
    teacherId: "all",
    groupId: "all",
    gender: "all",
    frlStatus: "all",
    ellStatus: "all",
    iepStatus: "all",
    race: "all"
  });

  let filterDropDownData = dropDownFormat.filterDropDownData;
  filterDropDownData = useMemo(() => {
    const _standardsGradebook = get(standardsGradebook, "data.result", {});
    if (!isEmpty(_standardsGradebook)) {
      const ddTeacherInfo = _standardsGradebook.teacherInfo;
      const temp = next(dropDownFormat.filterDropDownData, () => {});
      return getFilterDropDownData(ddTeacherInfo, role).concat(temp);
    }
    return dropDownFormat.filterDropDownData;
  }, [standardsGradebook]);

  const filterData = get(standardsFilters, "data.result", []);
  const [dynamicDropDownData, filterInitState] = useMemo(() => getDropDownData(filterData.orgData, role), [
    filterData.orgData,
    dropDownFormat.filterDropDownData,
    role
  ]);
  const [ddfilterForPerformance, setDdFilterForPerformance] = useState(filterInitState);

  const filterDropDownCB = (event, selected, comData) => {
    setDdFilter({
      ...ddfilter,
      [comData]: selected.key
    });
  };

  const filterDropDownCBForPerformance = (event, selected, comData) => {
    setDdFilterForPerformance({
      ...ddfilter,
      [comData]: selected.key
    });
  };

  let extraFilters = [];
  if (loc === "standards-gradebook") {
    extraFilters = filterDropDownData.map(item => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown selectCB={filterDropDownCB} data={item.data} comData={item.key} by={item.data[0]} />
      </SearchField>
    ));
  } else if (loc === "standards-performance-summary") {
    extraFilters = dynamicDropDownData.map(item => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown
          data={item.data}
          comData={item.key}
          by={item.data[0]}
          selectCB={filterDropDownCBForPerformance}
        />
      </SearchField>
    ));
  }

  return (
    <FlexContainer alignItems="flex-start">
      <StandardsFilters
        onGoClick={onStandardsGradebookGoClick}
        loc={loc}
        history={history}
        location={location}
        match={match}
        style={showFilter ? { display: "block" } : { display: "none" }}
        extraFilter={extraFilters}
      />
      <FilterIcon showFilter={showFilter} onClick={toggleFilter} />
      <ReportContaner showFilter={showFilter}>
        <Route
          exact
          path="/author/reports/standards-gradebook"
          render={_props => {
            setShowHeader(true);
            return (
              <StandardsGradebook
                {..._props}
                role={role}
                pageTitle={loc}
                ddfilter={ddfilter}
                settings={gradebookSettings}
                standardsGradebook={standardsGradebook}
              />
            );
          }}
        />
        <Route
          exact
          path="/author/reports/standards-performance-summary"
          render={_props => {
            setShowHeader(true);
            return <StandardsPerfromance {..._props} settings={gradebookSettings} ddfilter={ddfilterForPerformance} />;
          }}
        />
      </ReportContaner>
    </FlexContainer>
  );
};

const ConnectedStandardsMasteryReportContainer = connect(
  state => ({
    role: getUserRole(state),
    standardsFilters: getReportsStandardsFilters(state),
    standardsGradebook: getReportsStandardsGradebook(state),
    gradebookSettings: getReportsSMRSettings(state),
    filters: getFiltersSelector(state)
  }),
  {
    setSMRSettings: setSMRSettingsAction,
    resetAllReports: resetAllReportsAction
  }
)(StandardsMasteryReportContainer);

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer };
