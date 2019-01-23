import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Header from "../component/Header";
import SkillReportMainContent from "./WrapperAndSummary";

import MainContainer from "../component/mainContainer";
import { fetchSkillReportByClassID as fetchSkillReportAction } from "./ducks";

const SkillReportContainer = ({ flag, skillReport, fetchSkillReport }) => {
  useEffect(() => {
    fetchSkillReport("F1");
  }, []);
  return (
    <React.Fragment>
      <MainContainer flag={flag}>
        <Header flag={flag} titleText="common.skillReportTitle" />
        <SkillReportMainContent skillReport={skillReport} />
      </MainContainer>
    </React.Fragment>
  );
};

export default React.memo(
  connect(
    ({ ui, skillReport }) => ({ flag: ui.flag, skillReport: skillReport }),
    {
      fetchSkillReport: fetchSkillReportAction
    }
  )(SkillReportContainer)
);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  skillReport: PropTypes.object.isRequired,
  fetchSkillReport: PropTypes.func.isRequired
};
