import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";
import { FlexContainer } from "@edulastic/common";

import ResponseFrequency from "./ResponseFrequency";
import AssessmentSummary from "./AssessmentSummary";
import PeerPerformance from "./PeerPerformance";
import PerformanceByStandards from "./PerformanceByStandards";
import PerformanceByStudents from "./PerformanceByStudents";
import QuestionAnalysis from "./QuestionAnalysis";

import SingleAssessmentReportFilters from "./common/components/filters";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import { setSARSettingsAction, getReportsSARSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { FilterIcon, ReportContaner } from "../../common/styled";

const SingleAssessmentReportContainer = props => {
  const {
    settings,
    setSARSettings,
    onRefineResultsCB,
    updateNavigation,
    resetAllReports,
    loc,
    showFilter,
    history,
    location,
    match
  } = props;

  useEffect(
    () => () => {
      console.log("Single Assessment Reports Component Unmount");
      resetAllReports();
    },
    []
  );

  const computeChartNavigationLinks = (sel, filt) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt);
      const obj = {};
      // eslint-disable-next-line array-callback-return
      arr.map(item => {
        const val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[loc].group], draft => {
        getNavigationTabLinks(draft, `${sel.key}?${qs.stringify(obj)}`);
      });
    }
    return [];
  };

  useEffect(() => {
    if (settings.selectedTest.key) {
      const arr = Object.keys(settings.requestFilters);
      const obj = {};
      // eslint-disable-next-line array-callback-return
      arr.map(item => {
        const val = settings.requestFilters[item] === "" ? "All" : settings.requestFilters[item];
        obj[item] = val;
      });
      const path = `${settings.selectedTest.key}?${qs.stringify(obj)}`;
      history.push(path);
    }

    const navigationItems = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters);
    updateNavigation(navigationItems);
  }, [settings]);

  const onGoClick = _settings => {
    if (_settings.selectedTest.key) {
      const obj = {};
      const arr = Object.keys(_settings.filters);
      // eslint-disable-next-line array-callback-return
      arr.map(item => {
        const val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      setSARSettings({
        selectedTest: _settings.selectedTest,
        requestFilters: obj
      });
    }
  };

  const toggleFilter = e => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter);
    }
  };

  return (
    <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
      <FlexContainer alignItems="flex-start">
        <SingleAssessmentReportFilters
          onGoClick={onGoClick}
          loc={loc}
          history={history}
          location={location}
          match={match}
          performanceBandRequired={[
            "/author/reports/assessment-summary",
            "/author/reports/peer-performance",
            "/author/reports/performance-by-students"
          ].find(x => window.location.pathname.startsWith(x))}
          isStandardProficiencyRequired={["/author/reports/performance-by-standards"].find(x =>
            window.location.pathname.startsWith(x)
          )}
          style={showFilter ? { display: "block" } : { display: "none" }}
        />
        <ReportContaner showFilter={showFilter}>
          <FilterIcon showFilter={showFilter} onClick={toggleFilter} />
          <Route
            exact
            path="/author/reports/assessment-summary/test/:testId?"
            render={_props => <AssessmentSummary {..._props} settings={settings} />}
          />
          <Route
            exact
            path="/author/reports/peer-performance/test/:testId?"
            render={_props => <PeerPerformance {..._props} settings={settings} />}
          />
          <Route
            exact
            path="/author/reports/question-analysis/test/:testId?"
            render={_props => <QuestionAnalysis {..._props} settings={settings} />}
          />
          <Route
            exact
            path="/author/reports/response-frequency/test/:testId?"
            render={_props => <ResponseFrequency {..._props} settings={settings} />}
          />
          <Route
            exact
            path="/author/reports/performance-by-standards/test/:testId?"
            render={_props => <PerformanceByStandards {..._props} settings={settings} pageTitle={loc} />}
          />
          <Route
            exact
            path="/author/reports/performance-by-students/test/:testId?"
            render={_props => (
              <PerformanceByStudents {..._props} showFilter={showFilter} settings={settings} pageTitle={loc} />
            )}
          />
        </ReportContaner>
      </FlexContainer>
    </FeaturesSwitch>
  );
};

const ConnectedSingleAssessmentReportContainer = connect(
  state => ({ settings: getReportsSARSettings(state) }),
  {
    setSARSettings: setSARSettingsAction,
    resetAllReports: resetAllReportsAction
  }
)(SingleAssessmentReportContainer);

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer };
