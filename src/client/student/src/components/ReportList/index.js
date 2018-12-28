import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReportListHeader from './header';
import ReportListSecondHeader from './second-headbar';
import ReportListContent from './maincontent';
import MainContainer from '../commonStyle/mainContainer';

const ReportListContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <ReportListHeader flag={flag} />
      <ReportListSecondHeader />
      <ReportListContent />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(
  connect(({ ui }) => ({ flag: ui.flag }))(ReportListContainer)
);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};
