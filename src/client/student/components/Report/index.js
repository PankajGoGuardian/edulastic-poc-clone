import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReportHeader from './header';
import ReportContent from './maincontent';
import SecondHeadbar from './second-header';
import MainContainer from '../commonStyle/mainContainer';

const ReportContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <ReportHeader flag={flag} />
      <SecondHeadbar />
      <ReportContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(ReportContainer));

ReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};
