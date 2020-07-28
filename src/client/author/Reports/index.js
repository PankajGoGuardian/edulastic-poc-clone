import { pullAllBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { MainContentWrapper } from "@edulastic/common";
import { Header, SubHeader } from "./common/components/Header";
import StandardReport from "./components/StandardReport";
import navigation from "./common/static/json/navigation.json";
import { PrintableScreen } from "./common/styled";
import CustomReports from "./components/customReport";
import CustomReportIframe from "./components/customReport/customReportIframe";
import {
  getCsvDownloadingState,
  getPrintingState,
  setCsvDownloadingStateAction,
  setPrintingStateAction
} from "./ducks";
import { MultipleAssessmentReportContainer } from "./subPages/multipleAssessmentReport";
import { SingleAssessmentReportContainer } from "./subPages/singleAssessmentReport";
import { StandardsMasteryReportContainer } from "./subPages/standardsMasteryReport";
import { StudentProfileReportContainer } from "./subPages/studentProfileReport";
import ClassCreate from "../ManageClass/components/ClassCreate";

const Container = props => {
  const { isCsvDownloading, isPrinting, match, hideSideMenu } = props;
  const [showHeader, setShowHeader] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const reportType = props?.match?.params?.reportType || "standard-reports";
  const groupName = navigation.locToData[reportType].group;
  const [navigationItems, setNavigationItems] = useState(navigation.navigation[groupName]);
  const [dynamicBreadcrumb, setDynamicBreadcrumb] = useState("");

  useEffect(() => {
    window.onbeforeprint = () => {
      // set 1 so that `isPrinting` dependant useEffect logic doesn't executed
      if (!isPrinting) props.setPrintingStateAction(1);
    };

    window.onafterprint = () => {
      props.setPrintingStateAction(false);
    };

    return () => {
      window.onbeforeprint = () => {};
      window.onafterprint = () => {};
    };
  }, []);

  useEffect(() => {
    if (reportType === "standard-reports" || reportType === "custom-reports") {
      setNavigationItems(navigation.navigation[groupName]);
    }
  }, [reportType]);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    console.log("not implemented yet");
  };

  const onPrintClickCB = () => {
    props.setPrintingStateAction(true);
  };

  const onDownloadCSVClickCB = () => {
    props.setCsvDownloadingStateAction(true);
  };

  const onRefineResultsCB = (event, status, type) => {
    switch (type) {
      case "applyButton":
        setShowApply(status);
        break;
      default:
        setShowFilter(status);
    }
  };

  useEffect(() => {
    if (isCsvDownloading) {
      props.setCsvDownloadingStateAction(false);
    }
  }, [isCsvDownloading]);

  useEffect(() => {
    // `isPrinting` possible values (1,true,false)
    if (isPrinting === true) {
      window.print();
    }
  }, [isPrinting]);

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS ENDED |-----|-----|-----|-----|----- //

  const headerSettings = useMemo(() => {
    let loc = props?.match?.params?.reportType;
    if (!loc || (loc && (loc === "standard-reports" || loc === "custom-reports"))) {
      loc = !loc ? reportType : loc;
      const breadcrumbInfo = navigation.locToData[loc].breadcrumb;
      if (loc === "custom-reports" && dynamicBreadcrumb) {
        const isCustomReportLoading = props.location.pathname.split("custom-reports")[1].length > 1 || false;
        if (isCustomReportLoading) {
          pullAllBy(breadcrumbInfo, [{ to: "" }], "to");
          breadcrumbInfo.push({
            title: dynamicBreadcrumb,
            to: ""
          });
        } else if (breadcrumbInfo && breadcrumbInfo[breadcrumbInfo.length - 1].to === "") {
          pullAllBy(breadcrumbInfo, [{ to: "" }], "to");
        }
      }
      return {
        loc,
        group: navigation.locToData[loc].group,
        title: navigation.locToData[loc].title,
        breadcrumbData: breadcrumbInfo,
        navigationItems
      };
    }
    return {
      loc,
      group: navigation.locToData[loc].group,
      title: navigation.locToData[loc].title,
      onShareClickCB,
      onPrintClickCB,
      onDownloadCSVClickCB,
      onRefineResultsCB,
      breadcrumbData: navigation.locToData[loc].breadcrumb,
      navigationItems
    };
  });

  const expandFilter = showFilter;

  return (
    <PrintableScreen>
      <Route
        exact
        path="/author/reports/:reportType/createClass"
        component={() => {
          setShowHeader(false);
          return <ClassCreate />;
        }}
      />
      {showHeader && (
        <Header
          onShareClickCB={headerSettings.onShareClickCB}
          onPrintClickCB={headerSettings.onPrintClickCB}
          onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
          navigationItems={headerSettings.navigationItems}
          activeNavigationKey={reportType}
          hideSideMenu={hideSideMenu}
        />
      )}
      <MainContentWrapper>
        <SubHeader
          breadcrumbsData={headerSettings.breadcrumbData}
          onRefineResultsCB={headerSettings.onRefineResultsCB}
          showFilter={expandFilter}
          title={headerSettings.title}
        />
        {reportType === "custom-reports" ? (
          <Route
            exact
            path={match.path}
            render={_props => {
              setShowHeader(true);
              return <CustomReports {..._props} setDynamicBreadcrumb={setDynamicBreadcrumb} />;
            }}
          />
        ) : reportType === "standard-reports" ? (
          <Route
            exact
            path={match.path}
            component={() => {
              setShowHeader(true);
              return <StandardReport premium={props.premium} />;
            }}
          />
        ) : null}
        <Route
          path={[
            `/author/reports/assessment-summary/test/`,
            `/author/reports/peer-performance/test/`,
            `/author/reports/question-analysis/test/`,
            `/author/reports/response-frequency/test/`,
            `/author/reports/performance-by-standards/test/`,
            `/author/reports/performance-by-students/test/`
          ]}
          render={_props => {
            setShowHeader(true);
            return (
              <SingleAssessmentReportContainer
                {..._props}
                showFilter={expandFilter}
                showApply={showApply}
                onRefineResultsCB={onRefineResultsCB}
                loc={reportType}
                updateNavigation={setNavigationItems}
              />
            );
          }}
        />
        <Route
          path={[
            `/author/reports/peer-progress-analysis`,
            `/author/reports/student-progress`,
            `/author/reports/performance-over-time`
          ]}
          render={_props => (
            <MultipleAssessmentReportContainer
              {..._props}
              showFilter={showFilter}
              showApply={showApply}
              onRefineResultsCB={onRefineResultsCB}
              loc={reportType}
              updateNavigation={setNavigationItems}
              setShowHeader={setShowHeader}
            />
          )}
        />
        <Route
          path={[`/author/reports/standards-gradebook`, `/author/reports/standards-performance-summary`]}
          render={_props => (
            <StandardsMasteryReportContainer
              {..._props}
              premium={props.premium}
              showFilter={expandFilter}
              onRefineResultsCB={onRefineResultsCB}
              loc={reportType}
              updateNavigation={setNavigationItems}
              setShowHeader={setShowHeader}
            />
          )}
        />
        <Route
          path={[
            `/author/reports/student-mastery-profile/student/`,
            `/author/reports/student-assessment-profile/student/`,
            `/author/reports/student-profile-summary/student/`
          ]}
          render={_props => {
            setShowHeader(true);
            return (
              <StudentProfileReportContainer
                {..._props}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={reportType}
                updateNavigation={setNavigationItems}
              />
            );
          }}
        />
        <Route
          path="/author/reports/custom-reports/:id"
          render={_props => {
            setShowHeader(true);
            return <CustomReportIframe {..._props} setDynamicBreadcrumb={setDynamicBreadcrumb} />;
          }}
        />
      </MainContentWrapper>
    </PrintableScreen>
  );
};

const enhance = connect(
  state => ({
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state),
    premium: state?.user?.user?.features?.premium
  }),
  {
    setPrintingStateAction,
    setCsvDownloadingStateAction
  }
);

export default enhance(Container);
