import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReportHeader from './header';
import ReportContent from './maincontent';
import MainContainer from '../commonStyle/mainContainer';

const ReportContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <ReportHeader flag={flag} />
      <ReportContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(
  connect(({ ui }) => ({ flag: ui.flag }))(ReportContainer),
);

ReportContainer.PropTypes = {
  flag: PropTypes.bool,
};
