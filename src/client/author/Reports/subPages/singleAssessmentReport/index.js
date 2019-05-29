import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";

import ResponseFrequency from "./ResponseFrequency";
import AssessmentSummary from "./AssessmentSummary";
import PeerPerformance from "./PeerPerformance";
import PerformanceByStandards from "./PerformanceByStandards";

import SingleAssessmentReportFilters from "./common/components/filters";
import { NavigatorTabs } from "../../common/components/widgets/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

export const SingleAssessmentReportContainer = props => {
  const [settings, setSettings] = useState({
    selectedTest: { key: "", title: "" },
    requestFilters: {
      termId: "",
      subject: "",
      grade: "",
      courseId: "",
      groupId: "",
      schoolId: "",
      teacherId: "",
      assessmentType: ""
    }
  });

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
  }, [settings]);

  let computedChartNavigatorLinks;

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

  computedChartNavigatorLinks = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters);

  const onGoClick = _settings => {
    if (_settings.selectedTest.key) {
      let obj = {};
      let arr = Object.keys(_settings.filters);
      arr.map((item, index) => {
        let val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      setSettings({
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
          style={props.showFilter ? { display: "block" } : { display: "none" }}
        />
        <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={props.loc} />
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
          path={`/author/reports/response-frequency/test/:testId?`}
          render={_props => <ResponseFrequency {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/performance-by-standards/test/:testId?`}
          render={_props => <PerformanceByStandards {..._props} showFilter={props.showFilter} settings={settings} />}
        />
      </FeaturesSwitch>
    </>
  );
};
