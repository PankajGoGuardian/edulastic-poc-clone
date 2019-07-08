import React, { useEffect, useState, useMemo, useRef } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";

import StandardsGradebook from "./standardsGradebook";
import StandardsPerfromance from "./standardsPerformance";

import StandardsFilters from "./common/components/Filters";
import { NavigatorTabs } from "../../common/components/widgets/navigatorTabs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";

export const StandardsMasteryReportContainer = props => {
  const [gradebookSettings, setGradebookSettings] = useState({
    selectedTest: { key: "", title: "" },
    requestFilters: {
      termId: "",
      subject: "",
      grades: ["K"],
      domainIds: ["All"]
      // classSectionId: "",
      // assessmentType: ""
    }
  });
  const firstRender = useRef(true);

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
      obj.testId = gradebookSettings.selectedTest.key;
      let path = qs.stringify(obj);
      props.history.push("?" + path);
    }
    firstRender.current = false;
  }, [gradebookSettings]);

  let computedChartNavigatorLinks;

  // IMPORTANT: This needs to be implemented properly when we know what all parameters the other tabs require cuz the parameters are not same for
  // all the tabs
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

  computedChartNavigatorLinks = computeChartNavigationLinks(gradebookSettings.requestFilters);

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

    setGradebookSettings({
      ...gradebookSettings,
      selectedTest: _settings.selectedTest.key === "All" ? { key: "", title: "" } : _settings.selectedTest,
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
      <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={props.loc} />
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
