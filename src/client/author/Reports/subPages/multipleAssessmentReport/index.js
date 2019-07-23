import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { map } from "lodash";
import next from "immer";
import qs from "qs";

import { NavigatorTabs } from "../../common/components/widgets/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import MultipleAssessmentReportFilters from "./common/components/filters/MultipleAssessmentReportFilters";
import PeerProgressAnalysis from "./PeerProgressAnalysis";
import StudentProgress from "./StudentProgress";
import PerformanceOverTime from "./PerformanceOverTime";

export const MultipleAssessmentReportContainer = props => {
  const [settings, setSettings] = useState({
    selectedTest: [{ key: "", title: "" }],
    requestFilters: {
      termId: "",
      subject: "",
      grade: "",
      courseId: "",
      groupId: "",
      schoolId: "",
      teacherId: "",
      assessmentType: "",
      testIds: ""
    }
  });

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
  }, [settings]);

  let computedChartNavigatorLinks;

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

  computedChartNavigatorLinks = computeChartNavigationLinks(settings.requestFilters);

  const onGoClick = _settings => {
    if (_settings.selectedTest) {
      let obj = {};
      let arr = Object.keys(_settings.filters);
      arr.map((item, index) => {
        let val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      const { selectedTest = [] } = _settings;
      setSettings({
        requestFilters: { ...obj, testIds: map(selectedTest, test => test.key) }
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
        style={props.showFilter ? { display: "block" } : { display: "none" }}
      />
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={props.loc} />
      <Route
        exact
        path={`/author/reports/peer-progress-analysis/`}
        render={_props => <PeerProgressAnalysis {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`/author/reports/student-progress/`}
        render={_props => <StudentProgress {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`/author/reports/performance-over-time/`}
        render={_props => <PerformanceOverTime {..._props} settings={settings} />}
      />
    </>
  );
};
