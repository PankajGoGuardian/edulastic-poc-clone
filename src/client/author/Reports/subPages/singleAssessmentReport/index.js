import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";

import { Spin } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";

import queryString from "query-string";
import ResponseFrequency from "./ResponseFrequency";
import AssessmentSummary from "./AssessmentSummary";
import PeerPerformance from "./PeerPerformance";
import PerformanceByStandards from "./PerformanceByStandards";
import PerformanceByStudents from "./PerformanceByStudents";
import QuestionAnalysis from "./QuestionAnalysis";

import SingleAssessmentReportFilters from "./common/components/filters";
import { ControlDropDown } from "../../common/components/widgets/controlDropDown";
import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import extraFilterData from "./common/static/extraFilterData.json";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import { setSARSettingsAction, getReportsSARSettings, resetSARSettingsAction } from "./ducks";
import { updateCliUserAction } from "../../../../student/Login/ducks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { ReportContaner, SearchField, FilterLabel, FilterButton } from "../../common/styled";

const INITIAL_DD_FILTERS = {
  gender: "all",
  frlStatus: "all",
  ellStatus: "all",
  iepStatus: "all",
  race: "all"
};

const SingleAssessmentReportContainer = props => {
  const {
    settings,
    setSARSettings,
    onRefineResultsCB,
    updateNavigation,
    resetAllReports,
    loc,
    showFilter,
    showApply,
    history,
    location,
    match,
    updateCliUser,
    cliUser,
    resetSARSettings
  } = props;

  const [firstLoad, setFirstLoad] = useState(true);
  const [isCliUser, setCliUser] = useState(cliUser || queryString.parse(location.search).cliUser);
  const [ddfilter, setDdFilter] = useState({ ...INITIAL_DD_FILTERS });
  const [selectedExtras, setSelectedExtras] = useState({ ...INITIAL_DD_FILTERS });

  useEffect(() => {
    if (isCliUser) {
      updateCliUser(true);
    }
    return () => {
      console.log("Single Assessment Reports Component Unmount");
      resetAllReports();
    }
  }, []);

  useEffect(() => {
    if (!showApply) {
      setDdFilter({ ...selectedExtras });
    }
  }, [showApply, selectedExtras]);

  const computeChartNavigationLinks = (sel, filt, _isCliUser) => {
    if (navigation.locToData[loc]) {
      const arr = Object.keys(filt);
      const obj = {};
      // eslint-disable-next-line array-callback-return
      arr.map(item => {
        const val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      obj.cliUser = _isCliUser;
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
      if (isCliUser) {
        obj.cliUser = true;
      }
      const path = `${settings.selectedTest.key}?${qs.stringify(obj)}`;
      history.push(path);
    }

    const navigationItems = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters, settings.cliUser);
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
        requestFilters: obj,
        cliUser: isCliUser
      });
    }
  };

  const toggleFilter = e => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter);
    }
  };

  const setShowApply = status => {
    onRefineResultsCB(null, status, "applyButton");
  };

  const updateCB = (event, selected, comData) => {
    setShowApply(true);
    setSelectedExtras({
      ...selectedExtras,
      [comData]: selected.key
    });
  };
  const locList = ["peer-performance", "performance-by-standards", "performance-by-students"];
  const extraFilters = locList.includes(loc)
    ? extraFilterData[loc].map(item => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown selectCB={updateCB} data={item.data} comData={item.key} by={item.data[0]} />
      </SearchField>
    ))
    : [];

  return (
    <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
      <>
        {firstLoad && <Spin size="large" />}
        <FlexContainer
          alignItems="flex-start"
          display={firstLoad ? "none" : "flex"}
        >
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
            extraFilters={extraFilters}
            style={showFilter ? { display: "block" } : { display: "none" }}
            showApply={showApply}
            setShowApply={setShowApply}
            firstLoad={firstLoad}
            setFirstLoad={setFirstLoad}
            isCliUser={isCliUser}
          />
          <FilterButton showFilter={showFilter} onClick={toggleFilter}>
            <IconFilter />
          </FilterButton>
          <ReportContaner showFilter={showFilter}>
            <Route
              exact
              path="/author/reports/assessment-summary/test/:testId?"
              render={_props => <AssessmentSummary {..._props} settings={settings} />}
            />
            <Route
              exact
              path="/author/reports/peer-performance/test/:testId?"
              render={_props => <PeerPerformance {..._props} settings={settings} filters={ddfilter} />}
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
              render={_props => (
                <PerformanceByStandards {..._props} settings={settings} pageTitle={loc} filters={ddfilter} />
              )}
            />
            <Route
              exact
              path="/author/reports/performance-by-students/test/:testId?"
              render={_props => (
                <PerformanceByStudents
                  {..._props}
                  showFilter={showFilter}
                  settings={settings}
                  pageTitle={loc}
                  filters={ddfilter}
                />
              )}
            />
          </ReportContaner>
        </FlexContainer>
      </>
    </FeaturesSwitch>
  );
};

const ConnectedSingleAssessmentReportContainer = connect(
  state => ({ settings: getReportsSARSettings(state), cliUser: state.user?.isCliUser }),
  {
    setSARSettings: setSARSettingsAction,
    resetAllReports: resetAllReportsAction,
    updateCliUser: updateCliUserAction,
    resetSARSettings: resetSARSettingsAction
  }
)(SingleAssessmentReportContainer);

export { ConnectedSingleAssessmentReportContainer as SingleAssessmentReportContainer };
