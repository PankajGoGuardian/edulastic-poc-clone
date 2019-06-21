import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";

import { NavigatorTabs } from "../../common/components/widgets/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import MultipleAssessmentReportFilters from "./common/components/filters";
import PeerProgressAnalysis from "./PeerProgressAnalysis";

export const MultipleAssessmentReportContainer = props => {
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
        path={`/author/reports/peer-progress-analysis/test/:testId?`}
        render={_props => <PeerProgressAnalysis />}
      />
    </>
  );
};
