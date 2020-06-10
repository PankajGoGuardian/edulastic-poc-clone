/* eslint-disable array-callback-return */
import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { map } from "lodash";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";

import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import MultipleAssessmentReportFilters from "./common/components/filters/MultipleAssessmentReportFilters";
import PeerProgressAnalysis from "./PeerProgressAnalysis";
import StudentProgress from "./StudentProgress";
import PerformanceOverTime from "./PerformanceOverTime";

import { setMARSettingsAction, getReportsMARSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { FilterIcon, ReportContaner } from "../../common/styled";

const MultipleAssessmentReportContainer = props => {
  const {
    settings,
    setMARSettings,
    loc: pageTitle,
    setShowHeader,
    resetAllReports,
    history,
    location,
    match,
    showFilter,
    updateNavigation,
    onRefineResultsCB
  } = props;

  useEffect(
    () => () => {
      console.log("Multiple Assessment Summary Component Unmount");
      resetAllReports();
    },
    []
  );

  const computeChartNavigationLinks = filt => {
    if (navigation.locToData[pageTitle]) {
      const arr = Object.keys(filt);
      const obj = {};
      arr.map(item => {
        const val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[pageTitle].group], draft => {
        getNavigationTabLinks(draft, `?${qs.stringify(obj)}`);
      });
    }
    return [];
  };

  useEffect(() => {
    if (settings.requestFilters.testIds) {
      const arr = Object.keys(settings.requestFilters);
      const obj = {};
      arr.map(item => {
        const val = settings.requestFilters[item] === "" ? "All" : settings.requestFilters[item];
        obj[item] = val;
      });
      const path = `?${qs.stringify(obj)}`;
      history.push(path);
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(settings.requestFilters);
    updateNavigation(computedChartNavigatorLinks);
  }, [settings]);

  const onGoClick = _settings => {
    if (_settings.selectedTest) {
      const obj = {};
      const arr = Object.keys(_settings.filters);
      arr.map(item => {
        const val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      const { selectedTest = [] } = _settings;
      setMARSettings({
        requestFilters: { ...obj, testIds: map(selectedTest, test => test.key).join() }
      });
    }
  };

  const toggleFilter = e => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter);
    }
  };

  return (
    <FlexContainer alignItems="flex-start">
      <MultipleAssessmentReportFilters
        onGoClick={onGoClick}
        loc={pageTitle}
        history={history}
        location={location}
        match={match}
        performanceBandRequired={["/author/reports/student-progress", "/author/reports/performance-over-time"].find(x =>
          window.location.pathname.startsWith(x)
        )}
        style={showFilter ? { display: "block" } : { display: "none" }}
      />
      <ReportContaner showFilter={showFilter}>
        <FilterIcon showFilter={showFilter} onClick={toggleFilter} />
        <Route
          exact
          path="/author/reports/peer-progress-analysis/"
          render={_props => {
            setShowHeader(true);
            return <PeerProgressAnalysis {..._props} settings={settings} />;
          }}
        />
        <Route
          exact
          path="/author/reports/student-progress/"
          render={_props => {
            setShowHeader(true);
            return <StudentProgress {..._props} settings={settings} pageTitle={pageTitle} />;
          }}
        />
        <Route
          exact
          path="/author/reports/performance-over-time/"
          render={_props => {
            setShowHeader(true);
            return <PerformanceOverTime {..._props} settings={settings} />;
          }}
        />
      </ReportContaner>
    </FlexContainer>
  );
};

const ConnectedMultipleAssessmentReportContainer = connect(
  state => ({ settings: getReportsMARSettings(state) }),
  {
    setMARSettings: setMARSettingsAction,
    resetAllReports: resetAllReportsAction
  }
)(MultipleAssessmentReportContainer);

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer };
