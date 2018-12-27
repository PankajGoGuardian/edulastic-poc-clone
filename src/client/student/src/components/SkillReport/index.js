import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SkillReportHeader from './header';
import SkillReportMainContent from './maincontent';

import MainContainer from '../commonStyle/mainContainer';

const SkillReportContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <SkillReportHeader flag={flag} />
      <SkillReportMainContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(SkillReportContainer));

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};
