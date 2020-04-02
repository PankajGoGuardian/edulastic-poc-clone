import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";

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

const SingleAssessmentReportContainer = props => {
  const { settings, setSARSettingsAction } = props;

  useEffect(() => {
    return () => {
      console.log("Single Assessment Reports Component Unmount");
      props.resetAllReportsAction();
    };
  }, []);

  const computeChartNavigationLinks = (sel, filt) => {
    if (navigation.locToData[props.loc]) {
      let arr = Object.keys(filt);
      let obj = {};
      arr.map((item, index) => {
        let val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[props.loc].group], arr => {
        getNavigationTabLinks(arr, sel.key + "?" + qs.stringify(obj));
      });
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (settings.selectedTest.key) {
      let arr = Object.keys(settings.requestFilters);
      let obj = {};
      arr.map((item, index) => {
        let val = settings.requestFilters[item] === "" ? "All" : settings.requestFilters[item];
        obj[item] = val;
      });
      let path = settings.selectedTest.key + "?" + qs.stringify(obj);
      props.history.push(path);
    }

    const navigationItems = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters);
    props.updateNavigation(navigationItems);
  }, [props.settings]);

  const onGoClick = _settings => {
    if (_settings.selectedTest.key) {
      let obj = {};
      let arr = Object.keys(_settings.filters);
      arr.map((item, index) => {
        let val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      setSARSettingsAction({
        selectedTest: _settings.selectedTest,
        requestFilters: obj
      });
    }
  };

  return (
    <>
      <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
        <SingleAssessmentReportFilters
          onGoClick={onGoClick}
          loc={props.loc}
          history={props.history}
          location={props.location}
          match={props.match}
          performanceBandRequired={[
            "/author/reports/assessment-summary",
            "/author/reports/peer-performance",
            "/author/reports/performance-by-students"
          ].find(x => window.location.pathname.startsWith(x))}
          isStandardProficiencyRequired={["/author/reports/performance-by-standards"].find(x =>
            window.location.pathname.startsWith(x)
          )}
          style={props.showFilter ? { display: "block" } : { display: "none" }}
        />
        <Route
          exact
          path={`/author/reports/assessment-summary/test/:testId?`}
          render={_props => <AssessmentSummary {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/peer-performance/test/:testId?`}
          render={_props => <PeerPerformance {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/question-analysis/test/:testId?`}
          render={_props => <QuestionAnalysis {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/response-frequency/test/:testId?`}
          render={_props => <ResponseFrequency {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/performance-by-standards/test/:testId?`}
          render={_props => <PerformanceByStandards {..._props} settings={settings} pageTitle={props.loc} />}
        />
        <Route
          exact
          path={`/author/reports/performance-by-students/test/:testId?`}
          render={_props => <PerformanceByStudents {..._props} showFilter={props.showFilter} settings={settings} pageTitle={props.loc} />}
        />
      </FeaturesSwitch>
    </>
  );
};

const ConnectedSingleAssessmentReportContainer = connect(
  state => ({ settings: getReportsSARSettings(state) }),
  {
    setSARSettingsAction,
    resetAllReportsAction
  }
)(SingleAssessmentReportContainer);

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer };
