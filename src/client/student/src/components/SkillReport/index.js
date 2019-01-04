import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SkillReportHeader from './header';
import SkillReportMainContent from './maincontent';

import MainContainer from '../commonStyle/mainContainer';
import { fetchSkillReportAction } from '../../actions/report';


const SkillReportContainer = ({ flag, skillReport, fetchSkillReport }) => {
  useEffect(() => {
    fetchSkillReport('F1');
  }, []);
  return (
    <React.Fragment>
      <MainContainer flag={flag}>
        <SkillReportHeader flag={flag} />
        <SkillReportMainContent skillReport={skillReport} />
      </MainContainer>
    </React.Fragment>
  );
};

export default React.memo(connect(
  ({ ui, reports }) => ({ flag: ui.flag, skillReport: reports.skillReport }),
  {
    fetchSkillReport: fetchSkillReportAction
  }
)(SkillReportContainer));

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  skillReport: PropTypes.object.isRequired,
  fetchSkillReport: PropTypes.func.isRequired
};
