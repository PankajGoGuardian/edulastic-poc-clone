import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import StudentMasteryProfile from "./StudentMasteryProfile";
import StudentAssessmentProfile from "./StudentAssessmentProfile";
import StudentProfileSummary from "./StudentProfileSummary";
import StudentProfileReportsFilters from "./common/components/filter/StudentProfileReportsFilters";

import { setSPRSettingsAction, getReportsSPRSettings } from "./ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";

const StudentProfileReportContainer = props => {
  const { settings, setSPRSettingsAction } = props;

  useEffect(() => {
    return () => {
      console.log("Student Profile Reports Component Unmount");
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
    if (settings.selectedStudent.key) {
      let path = settings.selectedStudent.key + "?" + qs.stringify(settings.requestFilters);
      props.history.push(path);
      const computedChartNavigatorLinks = computeChartNavigationLinks(
        settings.selectedStudent,
        settings.requestFilters
      );
      props.updateNavigation(computedChartNavigatorLinks);
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(settings.selectedStudent, settings.requestFilters);
    props.updateNavigation(computedChartNavigatorLinks);
  }, [settings]);

  const onGoClick = _settings => {
    props.setSPRSettingsAction({
      requestFilters: _settings.filters,
      selectedStudent: _settings.selectedStudent
    });
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
          style={props.showFilter ? { display: "block", padding: "10px" } : { display: "none" }}
          performanceBandRequired={[
            "/author/reports/student-profile-summary",
            "/author/reports/student-assessment-profile"
          ].find(x => window.location.pathname.startsWith(x))}
          standardProficiencyRequired={[
            "/author/reports/student-profile-summary",
            "/author/reports/student-mastery-profile"
          ].find(x => window.location.pathname.startsWith(x))}
        />
        <Route
          exact
          path={`/author/reports/student-mastery-profile/student/:studentId?`}
          render={_props => <StudentMasteryProfile {..._props} settings={settings} />}
        />
        <Route
          exact
          path={`/author/reports/student-assessment-profile/student/:studentId?`}
          render={_props => <StudentAssessmentProfile {..._props} settings={settings} pageTitle={props.loc} />}
        />
        <Route
          exact
          path={`/author/reports/student-profile-summary/student/:studentId?`}
          render={_props => <StudentProfileSummary {..._props} settings={settings} pageTitle={props.loc} />}
        />
      </FeaturesSwitch>
    </>
  );
};

const enhance = connect(
  state => ({
    settings: getReportsSPRSettings(state)
  }),
  {
    setSPRSettingsAction,
    resetAllReportsAction
  }
);

const enhancedContainer = enhance(StudentProfileReportContainer);

export { enhancedContainer as StudentProfileReportContainer };
