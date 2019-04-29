import React, { useState, useEffect, useMemo } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Row, Col } from "antd";
import next from "immer";

import Breadcrumb from "../src/components/Breadcrumb";

import ResponseFrequency from "./subPages/singleAssessmentReport/ResponseFrequency";
import AssessmentSummary from "./subPages/singleAssessmentReport/AssessmentSummary";
import PeerPerformance from "./subPages/singleAssessmentReport/PeerPerformance";
import PerformanceByStandards from "./subPages/singleAssessmentReport/PerformanceByStandards";

import { StyledContainer, StyledCard } from "./common/styled";

import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { CustomizedHeaderWrapper } from "./common/components/header";
import SingleAssessmentReportFilters from "./subPages/singleAssessmentReport/common/components/filters";
import { NavigatorTabs } from "./common/components/widgets/navigatorTabs";

import { getNavigationTabLinks } from "./common/util";

import navigation from "./common/static/json/navigation.json";

const Container = props => {
  const [showFilter, setShowFilter] = useState(false);
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
    let loc = getLoc();
    if (loc && settings.selectedTest.key) {
      let str = "?";
      let arr = Object.keys(settings.requestFilters);
      arr.map((item, index) => {
        if (settings.requestFilters[item] === "") {
          str = str + item + "=" + "All" + (index === arr.length - 1 ? "" : "&");
        } else {
          str = str + item + "=" + settings.requestFilters[item] + (index === arr.length - 1 ? "" : "&");
        }
        let path = props.match.path + loc + "/test/" + settings.selectedTest.key + str;
        props.history.push(path);
      });
    }
  }, [settings]);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    console.log("not implemented yet");
  };

  const onPrintClickCB = () => {
    console.log("not implemented yet");
  };

  const onDownloadCSVClickCB = () => {
    console.log("not implemented yet");
  };

  const onRefineResultsCB = (event, status) => {
    setShowFilter(status);
  };

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS ENDED |-----|-----|-----|-----|----- //

  const getLoc = () => {
    let url = props.location.pathname;
    if (url.length > 16) {
      let _url = url.substring(16);
      let loc = _url.substring(0, _url.indexOf("/"));
      return loc;
    }
    return false;
  };

  let computedChartNavigatorLinks;

  const computeChartNavigationLinks = (sel, filt) => {
    if (navigation.locToData[getLoc()]) {
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
      return next(navigation.navigation[navigation.locToData[getLoc()].group], arr => {
        getNavigationTabLinks(arr, sel.key + str);
      });
    } else {
      return [];
    }
  };

  computedChartNavigatorLinks = computeChartNavigationLinks(settings.selectedTest, settings.requestFilters);

  const onGoClick = _settings => {
    let loc = getLoc();
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
    let loc = getLoc();
    if (loc) {
      return {
        loc: loc,
        group: navigation.locToData[loc].group,
        title: navigation.locToData[loc].title,
        onShareClickCB: onShareClickCB,
        onPrintClickCB: onPrintClickCB,
        onDownloadCSVClickCB: onDownloadCSVClickCB,
        onRefineResultsCB: onRefineResultsCB,
        breadcrumbData: navigation.locToData[loc].breadcrumb
      };
    } else {
      return { title: "Reports" };
    }
  });

  return (
    <div>
      <CustomizedHeaderWrapper
        breadcrumbsData={headerSettings.breadcrumbData}
        title={headerSettings.title}
        onShareClickCB={headerSettings.onShareClickCB}
        onPrintClickCB={headerSettings.onPrintClickCB}
        onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
        onRefineResultsCB={headerSettings.onRefineResultsCB}
      />
      {headerSettings.group === "singleAssessmentReport" ? (
        <div>
          <SingleAssessmentReportFilters
            onGoClick={onGoClick}
            loc={headerSettings.loc}
            history={props.history}
            location={props.location}
            match={props.match}
            style={showFilter ? { display: "block" } : { display: "none" }}
          />
          <NavigatorTabs data={computedChartNavigatorLinks} selectedTab={headerSettings.loc} />
        </div>
      ) : null}
      <Route exact path={props.match.path} component={Reports} />
      <Route
        exact
        path={`${props.match.path}assessment-summary/test/:testId?`}
        render={_props => <AssessmentSummary {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`${props.match.path}peer-performance/test/:testId?`}
        render={_props => <PeerPerformance {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`${props.match.path}response-frequency/test/:testId?`}
        render={_props => <ResponseFrequency {..._props} settings={settings} />}
      />
      <Route
        exact
        path={`${props.match.path}performance-by-standards/test/:testId?`}
        render={_props => (
          <PerformanceByStandards
            {..._props}
            showFilter={showFilter}
            filters={settings.requestFilters}
            settings={settings}
          />
        )}
      />
    </div>
  );
};

const Reports = props => {
  return (
    <div>
      <StyledContainer type="flex" justify="center">
        <Col className="report-category">
          <StyledCard className="single-assessment-reports report">
            <SingleAssessmentReport />
          </StyledCard>
          <StyledCard className="student-profile-reports report" />
        </Col>
        <Col className="report-category">
          <StyledCard className="multiple-assessment-reports report" />
          <StyledCard className="standards-mastery-reports report" />
          <StyledCard className="engagement-reports report" />
        </Col>
      </StyledContainer>
    </div>
  );
};

export default Container;
