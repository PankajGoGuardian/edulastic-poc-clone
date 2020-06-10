/* eslint-disable array-callback-return */
import React, { useEffect, useRef } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";

import StandardsGradebook from "./standardsGradebook";
import StandardsPerfromance from "./standardsPerformance";

import StandardsFilters from "./common/components/Filters";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import { setSMRSettingsAction, getReportsSMRSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { FilterIcon, ReportContaner } from "../../common/styled";

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
    onRefineResultsCB,
    showFilter
  } = props;

  const firstRender = useRef(true);

  useEffect(
    () => () => {
      console.log("Standards Mastery Report Component Unmount");
      resetAllReports();
    },
    []
  );

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

  return (
    <FlexContainer alignItems="flex-start">
      <StandardsFilters
        onGoClick={onStandardsGradebookGoClick}
        loc={loc}
        history={history}
        location={location}
        match={match}
        style={showFilter ? { display: "block" } : { display: "none" }}
      />
      <ReportContaner showFilter={showFilter}>
        <FilterIcon showFilter={showFilter} onClick={toggleFilter} />
        <Route
          exact
          path="/author/reports/standards-gradebook"
          render={_props => {
            setShowHeader(true);
            return <StandardsGradebook {..._props} settings={gradebookSettings} pageTitle={loc} />;
          }}
        />
        <Route
          exact
          path="/author/reports/standards-performance-summary"
          render={_props => {
            setShowHeader(true);
            return <StandardsPerfromance {..._props} settings={gradebookSettings} />;
          }}
        />
      </ReportContaner>
    </FlexContainer>
  );
};

const ConnectedStandardsMasteryReportContainer = connect(
  state => ({ gradebookSettings: getReportsSMRSettings(state) }),
  {
    setSMRSettings: setSMRSettingsAction,
    resetAllReports: resetAllReportsAction
  }
)(StandardsMasteryReportContainer);

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer };
