import React, { useEffect, useState, useMemo, useRef } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";

import StandardsGradebook from "./standardsGradebook";
import StandardsPerfromance from "./standardsPerformance";

import StandardsFilters from "./common/components/Filters";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import { setSMRSettingsAction, getReportsSMRSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";

const StandardsMasteryReportContainer = props => {
  const { gradebookSettings, setSMRSettingsAction, premium } = props;

  const firstRender = useRef(true);

  useEffect(() => {
    return () => {
      console.log("Standards Mastery Report Component Unmount");
      props.resetAllReportsAction();
    };
  }, []);

  const computeChartNavigationLinks = filt => {
    if (navigation.locToData[props.loc]) {
      let arr = Object.keys(filt);
      let obj = {};
      arr.map((item, index) => {
        let val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[props.loc].group], arr => {
        getNavigationTabLinks(arr, "?" + qs.stringify(obj, { arrayFormat: "comma" }));
      });
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (!firstRender.current) {
      let obj = {};
      let arr = Object.keys(gradebookSettings.requestFilters);
      arr.map((item, index) => {
        if (gradebookSettings.requestFilters[item] === "") {
          obj[item] = "All";
        } else {
          obj[item] = gradebookSettings.requestFilters[item];
        }
      });
      obj.testIds = gradebookSettings.selectedTest.map(items => items.key).join();
      let path = qs.stringify(obj, { arrayFormat: "comma" });
      props.history.push("?" + path);
    }
    firstRender.current = false;

    const computedChartNavigatorLinks = computeChartNavigationLinks(gradebookSettings.requestFilters);
    props.updateNavigation(!premium ? [computedChartNavigatorLinks[1]] : computedChartNavigatorLinks);
  }, [gradebookSettings]);

  let computedChartNavigatorLinks;

  const onStandardsGradebookGoClick = _settings => {
    let obj = {};
    let arr = Object.keys(_settings.filters);
    arr.map((item, index) => {
      if (_settings.filters[item] === "All") {
        obj[item] = "";
      } else {
        obj[item] = _settings.filters[item];
      }
    });

    setSMRSettingsAction({
      ...gradebookSettings,
      selectedTest: _settings.selectedTest,
      requestFilters: { ...obj }
    });
  };

  return (
    <>
      <StandardsFilters
        onGoClick={onStandardsGradebookGoClick}
        loc={props.loc}
        history={props.history}
        location={props.location}
        match={props.match}
        style={props.showFilter ? { display: "block" } : { display: "none" }}
      />
      <Route
        exact
        path={`/author/reports/standards-gradebook`}
        render={_props => <StandardsGradebook {..._props} settings={gradebookSettings} />}
      />
      <Route
        exact
        path={`/author/reports/standards-performance-summary`}
        render={_props => <StandardsPerfromance {..._props} settings={gradebookSettings} />}
      />
    </>
  );
};

const ConnectedStandardsMasteryReportContainer = connect(
  state => ({ gradebookSettings: getReportsSMRSettings(state) }),
  {
    setSMRSettingsAction,
    resetAllReportsAction
  }
)(StandardsMasteryReportContainer);

export { ConnectedStandardsMasteryReportContainer as StandardsMasteryReportContainer };
