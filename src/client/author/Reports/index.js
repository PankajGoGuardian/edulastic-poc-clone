import { Col, Row } from "antd";
import { pullAllBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import FeaturesSwitch from "../../features/components/FeaturesSwitch";
import CustomizedHeaderWrapper from "./common/components/header";
import navigation from "./common/static/json/navigation.json";
import { PrintableScreen, StyledCard, StyledContainer, StyledReportsContentContainer } from "./common/styled";
import CustomReports from "./components/customReport";
import CustomReportIframe from "./components/customReport/customReportIframe";
import { MultipleAssessmentReport } from "./components/multipleAssessmentReport";
import { SingleAssessmentReport } from "./components/singleAssessmentReport";
import { StandardsMasteryReport } from "./components/standardsMasteryReport";
import { StudentProfileReport } from "./components/studentProfileReport";
import { SubscriptionReport } from "./components/subscriptionReport";
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

const Container = props => {
  const { isCsvDownloading, isPrinting, match } = props;
  const [showFilter, setShowFilter] = useState(false);
  const reportType = props?.match?.params?.reportType || "standard-reports";
  const groupName = navigation.locToData[reportType].group;
  const [navigationItems, setNavigationItems] = useState(navigation.navigation[groupName]);
  const [dynamicBreadcrumb, setDynamicBreadcrumb] = useState("");

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

  const onRefineResultsCB = (event, status) => {
    setShowFilter(status);
  };

  useEffect(() => {
    if (isCsvDownloading) {
      props.setCsvDownloadingStateAction(false);
    }
  }, [isCsvDownloading]);

  useEffect(() => {
    if (isPrinting) {
      window.print();
      props.setPrintingStateAction(false);
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

  const expandFilter = showFilter || isPrinting;

  return (
    <PrintableScreen>
      <CustomizedHeaderWrapper
        breadcrumbsData={headerSettings.breadcrumbData}
        title={headerSettings.title}
        onShareClickCB={headerSettings.onShareClickCB}
        onPrintClickCB={headerSettings.onPrintClickCB}
        onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
        onRefineResultsCB={headerSettings.onRefineResultsCB}
        navigationItems={headerSettings.navigationItems}
        activeNavigationKey={reportType}
      />
      <StyledReportsContentContainer>
        {reportType === "custom-reports" ? (
          <Route
            exact
            path={match.path}
            render={_props => <CustomReports {..._props} setDynamicBreadcrumb={setDynamicBreadcrumb} />}
          />
        ) : reportType === "standard-reports" ? (
          <Route exact path={match.path} component={() => <Reports premium={props.premium} />} />
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
          render={_props => (
            <SingleAssessmentReportContainer
              {..._props}
              showFilter={expandFilter}
              loc={reportType}
              updateNavigation={setNavigationItems}
            />
          )}
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
              loc={reportType}
              updateNavigation={setNavigationItems}
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
              loc={reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path={[
            `/author/reports/student-mastery-profile/student/`,
            `/author/reports/student-assessment-profile/student/`,
            `/author/reports/student-profile-summary/student/`
          ]}
          render={_props => (
            <StudentProfileReportContainer
              {..._props}
              showFilter={showFilter}
              loc={reportType}
              updateNavigation={setNavigationItems}
            />
          )}
        />
        <Route
          path="/author/reports/custom-reports/:id"
          render={_props => <CustomReportIframe {..._props} setDynamicBreadcrumb={setDynamicBreadcrumb} />}
        />
      </StyledReportsContentContainer>
    </PrintableScreen>
  );
};

const Reports = ({ premium }) => (
  <StyledContainer>
    {premium && (
      <Row gutter={60}>
        <FeaturesSwitch
          inputFeatures={["singleAssessmentReport", "studentProfileReport"]}
          operation="OR"
          actionOnInaccessible="hidden"
        >
          <Col md={12} xs={24}>
            <FeaturesSwitch inputFeatures="singleAssessmentReport" actionOnInaccessible="hidden">
              <StyledCard className="single-assessment-reports report">
                <SingleAssessmentReport />
              </StyledCard>
            </FeaturesSwitch>
            <FeaturesSwitch inputFeatures="studentProfileReport" actionOnInaccessible="hidden">
              <StyledCard className="student-profile-reports report">
                <StudentProfileReport />
              </StyledCard>
            </FeaturesSwitch>
          </Col>
        </FeaturesSwitch>
        <Col md={12} xs={24}>
          <FeaturesSwitch inputFeatures="multipleAssessmentReport" actionOnInaccessible="hidden">
            <StyledCard className="multiple-assessment-reports report">
              <MultipleAssessmentReport />
            </StyledCard>
          </FeaturesSwitch>
          <StyledCard className="standards-mastery-reports report">
            <StandardsMasteryReport premium={premium} />
          </StyledCard>
        </Col>
      </Row>
    )}
    {!premium && (
      <Row>
        <Col md={24} xs={24}>
          <StyledCard margin="0px 0px 20px" className="standards-mastery-reports report">
            <StandardsMasteryReport premium={premium} />
          </StyledCard>
          <StyledCard margin="0px 0px 20px" className="upgrade subscription report">
            <SubscriptionReport premium={premium} />
          </StyledCard>
        </Col>
      </Row>
    )}
  </StyledContainer>
);

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
)(Container);

export default enhance;
