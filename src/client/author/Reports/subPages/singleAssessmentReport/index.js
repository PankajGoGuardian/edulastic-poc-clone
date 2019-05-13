import React, { useEffect, useState, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import next from "immer";

import ResponseFrequency from "./ResponseFrequency";
import AssessmentSummary from "./AssessmentSummary";
import PeerPerformance from "./PeerPerformance";
import PerformanceByStandards from "./PerformanceByStandards";

import SingleAssessmentReportFilters from "./common/components/filters";
import { NavigatorTabs } from "../../common/components/widgets/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

import { getLoc } from "../../common/util";

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
    let loc = getLoc(props.location.pathname);
    if (loc && settings.selectedTest.key) {
      let str = "?";
      let arr = Object.keys(settings.requestFilters);
      arr.map((item, index) => {
        if (settings.requestFilters[item] === "") {
          str = str + item + "=" + "All" + (index === arr.length - 1 ? "" : "&");
        } else {
          str = str + item + "=" + settings.requestFilters[item] + (index === arr.length - 1 ? "" : "&");
        }
      });
      let path = settings.selectedTest.key + str;
      props.history.push(path);
    }
  }, [settings]);

  let computedChartNavigatorLinks;

  const computeChartNavigationLinks = (sel, filt) => {
    if (navigation.locToData[getLoc(props.location.pathname)]) {
      let str = "?";
      let arr = Object.keys(filt);
      arr.map((item, index) => {
        let val = filt[item] === "" ? "All" : filt[item];
        if (index === arr.length - 1) {
          str = str + item + "=" + val;
        } else {
          str = str + item + "=" + val + "&";
        }
      });
      return next(navigation.navigation[navigation.locToData[getLoc(props.location.pathname)].group], arr => {
        getNavigationTabLinks(arr, sel.key + str);
      });
    } else {
      return [];
    }
  };

  computedChartNavigatorLinks = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters);

  const onGoClick = _settings => {
    let loc = getLoc(props.location.pathname);
    if (loc && _settings.selectedTest.key) {
      let obj = {};
      let arr = Object.keys(_settings.filters);
      arr.map((item, index) => {
        if (_settings.filters[item].substring(0, 3) === "All") {
          obj[item] = "";
        } else {
          obj[item] = _settings.filters[item];
        }
      });

      setSettings({
        selectedTest: _settings.selectedTest,
        requestFilters: obj
      });
    }
  };

  const headerSettings = useMemo(() => {
    let loc = getLoc(props.location.pathname);
    if (loc) {
      return {
        loc: loc,
        group: navigation.locToData[loc].group,
        title: navigation.locToData[loc].title,
        breadcrumbData: navigation.locToData[loc].breadcrumb
      };
    } else {
      return { title: "Reports" };
    }
  });

  return (
    <>
      <SingleAssessmentReportFilters
        onGoClick={onGoClick}
        loc={headerSettings.loc}
        history={props.history}
        location={props.location}
        match={props.match}
        style={props.showFilter ? { display: "block" } : { display: "none" }}
      />
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={headerSettings.loc} />
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
    </>
  );
};
