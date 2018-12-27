import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SummaryHeader from './header';
import SummaryTest from './maincontent';

import MainContainer from '../commonStyle/mainContainer';

const SummaryContainer = ({ flag }) => (
  <React.Fragment>
    <MainContainer flag={flag}>
      <SummaryHeader />
      <SummaryTest />
    </MainContainer>
  </React.Fragment>
);

export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(SummaryContainer));

SummaryContainer.propTypes = {
  flag: PropTypes.bool.isRequired
};
