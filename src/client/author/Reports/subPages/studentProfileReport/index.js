import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import StudentMasteryProfile from "./StudentMasteryProfile";
import StudentProfileReportsFilters from "./common/components/filter/StudentProfileReportsFilters";
import { getFiltersSelector, getStudentSelector } from "./common/filterDataDucks";

const StudentProfileReportContainer = props => {
  const [filters, setFilter] = useState({ selectedStudent: { key: "5d11b3a138a00c59ea7be6db" }, requestFilters: {} });

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
    const computedChartNavigatorLinks = computeChartNavigationLinks(filters.selectedStudent, filters.requestFilters);
    props.updateNavigation(computedChartNavigatorLinks);
  }, []);

  useEffect(() => {
    if (filters.selectedStudent.key) {
      let path = filters.selectedStudent.key + "?" + qs.stringify(filters.requestFilters);
      props.history.push(path);
      const computedChartNavigatorLinks = computeChartNavigationLinks(filters.selectedStudent, filters.requestFilters);
      props.updateNavigation(computedChartNavigatorLinks);
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(filters.selectedStudent, filters.requestFilters);
    props.updateNavigation(computedChartNavigatorLinks);
  }, [filters]);

  const onGoClick = filters => {
    setFilter(filters);
  };

  return (
    <>
      <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
        <StudentProfileReportsFilters
          onGoClick={onGoClick}
          loc={props.loc}
          history={props.history}
          location={props.location}
          match={props.match}
          style={props.showFilter ? { display: "block" } : { display: "none" }}
        />
        <Route
          exact
          path={`/author/reports/student-mastery-profile/student/:studentId?`}
          render={_props => <StudentMasteryProfile {..._props} settings={filters} />}
        />
      </FeaturesSwitch>
    </>
  );
};

export { StudentProfileReportContainer };
