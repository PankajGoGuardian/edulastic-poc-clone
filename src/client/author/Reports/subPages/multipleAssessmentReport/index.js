/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { map } from "lodash";
import next from "immer";
import qs from "qs";
import { connect } from "react-redux";

import { Spin } from "antd";
import { FlexContainer } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";

import { getNavigationTabLinks } from "../../common/util";

import navigation from "../../common/static/json/navigation.json";
import extraFilterData from "./common/static/extraFilterData.json";

import MultipleAssessmentReportFilters from "./common/components/filters/MultipleAssessmentReportFilters";
import { ControlDropDown } from "../../common/components/widgets/controlDropDown";
import PeerProgressAnalysis from "./PeerProgressAnalysis";
import StudentProgress from "./StudentProgress";
import PerformanceOverTime from "./PerformanceOverTime";

import { setMARSettingsAction, getReportsMARSettings } from "./ducks";
import { getReportsMARFilterData } from "./common/filterDataDucks";
import { resetAllReportsAction } from "../../common/reportsRedux";
import { FilterButton, ReportContaner, SearchField, FilterLabel } from "../../common/styled";

const MultipleAssessmentReportContainer = props => {
  const {
    settings,
    setMARSettings,
    loc: pageTitle,
    setShowHeader,
    resetAllReports,
    history,
    location,
    match,
    showFilter,
    showApply,
    updateNavigation,
    onRefineResultsCB,
    MARFilterData: _MARFilterData
  } = props;

  const [firstLoad, setFirstLoad] = useState(true);
  const [MARFilterData, setMARFilterData] = useState({});
  const [ddfilter, setDdFilter] = useState({});
  const [selectedExtras, setSelectedExtras] = useState({});

  useEffect(
    () => () => {
      console.log("Multiple Assessment Summary Component Unmount");
      resetAllReports();
    },
    []
  );

  useEffect(() => {
    if (!showApply) {
      setMARFilterData({ ..._MARFilterData });
    }
  }, [showApply, _MARFilterData]);

  useEffect(() => {
    if (!showApply) {
      setDdFilter({...selectedExtras});
    }
  }, [showApply, selectedExtras]);

  const filterlist = extraFilterData[pageTitle] || [];

  useEffect(() => {
    const initalDdFilters = filterlist.reduce((acc, curr) => ({ ...acc, [curr.key]: "" }), {});
    setSelectedExtras({ ...initalDdFilters });
    if (!showApply) {
      setDdFilter({ ...initalDdFilters });
    }
  }, [pageTitle]);

  const computeChartNavigationLinks = filt => {
    if (navigation.locToData[pageTitle]) {
      const arr = Object.keys(filt);
      const obj = {};
      arr.map(item => {
        const val = filt[item] === "" ? "All" : filt[item];
        obj[item] = val;
      });
      return next(navigation.navigation[navigation.locToData[pageTitle].group], draft => {
        getNavigationTabLinks(draft, `?${qs.stringify(obj)}`);
      });
    }
    return [];
  };

  useEffect(() => {
    if (settings.requestFilters.testIds) {
      const arr = Object.keys(settings.requestFilters);
      const obj = {};
      arr.map(item => {
        const val = settings.requestFilters[item] === "" ? "All" : settings.requestFilters[item];
        obj[item] = val;
      });
      const path = `?${qs.stringify(obj)}`;
      history.push(path);
    }
    const computedChartNavigatorLinks = computeChartNavigationLinks(settings.requestFilters);
    updateNavigation(computedChartNavigatorLinks);
  }, [settings]);

  const toggleFilter = e => {
    if (onRefineResultsCB) {
      onRefineResultsCB(e, !showFilter);
    }
  };

  const setShowApply = status => {
    onRefineResultsCB(null, status, "applyButton");
  };

  const onGoClick = _settings => {
    if (_settings.selectedTest) {
      const obj = {};
      const arr = Object.keys(_settings.filters);
      arr.map(item => {
        const val = _settings.filters[item] === "All" ? "" : _settings.filters[item];
        obj[item] = val;
      });

      const { selectedTest = [] } = _settings;
      setMARSettings({
        requestFilters: { ...obj, testIds: map(selectedTest, test => test.key).join() }
      });
    }
    setShowApply(false);
  };

  const updateCB = (event, selected, comData) => {
    setShowApply(true);
    setSelectedExtras({
      ...selectedExtras,
      [comData]: selected.key === "all" ? "" : selected.key
    });
  };
  const pageTitleList = ["performance-over-time", "peer-progress-analysis", "student-progress"];
  const extraFilters = pageTitleList.includes(pageTitle)
    ? filterlist.map(item => (
      <SearchField key={item.key}>
        <FilterLabel>{item.title}</FilterLabel>
        <ControlDropDown selectCB={updateCB} data={item.data} comData={item.key} by={item.data[0]} />
      </SearchField>
    ))
    : [];

  return (
    <>
      {firstLoad && <Spin size="large" />}
      <FlexContainer alignItems="flex-start" display={firstLoad ? "none" : "flex"}>
        <MultipleAssessmentReportFilters
          onGoClick={onGoClick}
          loc={pageTitle}
          history={history}
          location={location}
          match={match}
          performanceBandRequired={["/author/reports/student-progress", "/author/reports/performance-over-time"].find(
            x => window.location.pathname.startsWith(x)
          )}
          style={showFilter ? { display: "block" } : { display: "none" }}
          extraFilter={extraFilters}
          showApply={showApply}
          setShowApply={setShowApply}
          firstLoad={firstLoad}
          setFirstLoad={setFirstLoad}
        />
        <FilterButton showFilter={showFilter} onClick={toggleFilter}>
          <IconFilter />
        </FilterButton>
        <ReportContaner showFilter={showFilter}>
          <Route
            exact
            path="/author/reports/peer-progress-analysis/"
            render={_props => {
              setShowHeader(true);
              return (
                <PeerProgressAnalysis
                  {..._props}
                  settings={settings}
                  ddfilter={ddfilter}
                  MARFilterData={MARFilterData}
                />
              );
            }}
          />
          <Route
            exact
            path="/author/reports/student-progress/"
            render={_props => {
              setShowHeader(true);
              return (
                <StudentProgress
                  {..._props}
                  settings={settings}
                  pageTitle={pageTitle}
                  ddfilter={ddfilter}
                  MARFilterData={MARFilterData}
                />
              );
            }}
          />
          <Route
            exact
            path="/author/reports/performance-over-time/"
            render={_props => {
              setShowHeader(true);
              return (
                <PerformanceOverTime
                  {..._props}
                  settings={settings}
                  ddfilter={ddfilter}
                  MARFilterData={MARFilterData}
                />
              );
            }}
          />
        </ReportContaner>
      </FlexContainer>
    </>
  );
};

const ConnectedMultipleAssessmentReportContainer = connect(
  state => ({
    settings: getReportsMARSettings(state),
    MARFilterData: getReportsMARFilterData(state)
  }),
  {
    setMARSettings: setMARSettingsAction,
    resetAllReports: resetAllReportsAction
  }
)(MultipleAssessmentReportContainer);

export { ConnectedMultipleAssessmentReportContainer as MultipleAssessmentReportContainer };
