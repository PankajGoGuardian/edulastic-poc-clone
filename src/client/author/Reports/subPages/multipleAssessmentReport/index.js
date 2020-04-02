import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { map } from "lodash";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";

import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import MultipleAssessmentReportFilters from "./common/components/filters/MultipleAssessmentReportFilters";
import PeerProgressAnalysis from "./PeerProgressAnalysis";
import StudentProgress from "./StudentProgress";
import PerformanceOverTime from "./PerformanceOverTime";

import { setMARSettingsAction, getReportsMARSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";

const MultipleAssessmentReportContainer = props => {
  const { settings, setMARSettingsAction, loc: pageTitle } = props;

  useEffect(() => {
    return () => {
      console.log("Multiple Assessment Summary Component Unmount");
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
        getNavigationTabLinks(arr, "?" + qs.stringify(obj));
      });
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (settings.requestFilters.testIds) {
      let arr = Object.keys(settings.requestFilters);
      let obj = {};
      arr.map((item, index) => {
        let val = settings.requestFilters[item] === "" ? "All" : settings.requestFilters[item];
        obj[item] = val;
      });
      let path = "?" + qs.stringify(obj);
      props.history.push(path);
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(settings.requestFilters);
    props.updateNavigation(computedChartNavigatorLinks);
  }, [settings]);

  const onGoClick = _settings => {
    if (_settings.selectedTest) {
      let obj = {};
      let arr = Object.keys(_settings.filters);
      arr.map((item, index) => {
        let val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      const { selectedTest = [] } = _settings;
      setMARSettingsAction({
        requestFilters: { ...obj, testIds: map(selectedTest, test => test.key).join() }
      });
    }
  };

  return (
    <>
      <MultipleAssessmentReportFilters
        onGoClick={onGoClick}
        loc={props.loc}
        history={props.history}
        location={props.location}
        match={props.match}
        performanceBandRequired={["/author/reports/student-progress", "/author/reports/performance-over-time"].find(x =>
          window.location.pathname.startsWith(x)
        )}
        style={props.showFilter ? { display: "block" } : { display: "none" }}
      />
      <Route
        exact
        path={`/author/reports/peer-progress-analysis/`}
        render={_props => <PeerProgressAnalysis {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`/author/reports/student-progress/`}
        render={_props => <StudentProgress {..._props} settings={settings} pageTitle={pageTitle} />}
      />
      <Route
        exact
        path={`/author/reports/performance-over-time/`}
        render={_props => <PerformanceOverTime {..._props} settings={settings} />}
      />
    </>
  );
};

const ConnectedMultipleAssessmentReportContainer = connect(
  state => ({ settings: getReportsMARSettings(state) }),
  {
    setMARSettingsAction,
    resetAllReportsAction
  }
)(MultipleAssessmentReportContainer);

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer };
