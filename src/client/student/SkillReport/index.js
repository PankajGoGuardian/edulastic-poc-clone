import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Header from "../sharedComponents/Header";
import SkillReportMainContent from "./WrapperAndSummary";

import MainContainer from "../styled/mainContainer";
import { fetchSkillReportByClassID as fetchSkillReportAction, classSelector } from "./ducks";

const SkillReportContainer = ({ flag, skillReport, fetchSkillReport, classId }) => {
  useEffect(() => {
    if (classId) fetchSkillReport(classId);
  }, []);
  return (
    <MainContainer flag={flag}>
      <Header flag={flag} titleText="common.skillReportTitle" />
      <SkillReportMainContent skillReport={skillReport} />
    </MainContainer>
  );
};

export default React.memo(
  connect(
    state => ({
      flag: state.ui.flag,
      skillReport: state.skillReport,
      classId: classSelector(state)
    }),
    {
      fetchSkillReport: fetchSkillReportAction
    }
  )(SkillReportContainer)
);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  skillReport: PropTypes.object.isRequired,
  fetchSkillReport: PropTypes.func.isRequired,
  classId: PropTypes.node.isRequired
};
