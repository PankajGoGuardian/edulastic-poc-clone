import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SummaryHeader from './header';
import SummaryTest from './maincontent';

import MainContainer from '../commonStyle/mainContainer';
import { finishTestAcitivityAction } from '../../../../assessment/src/actions/test';

const SummaryContainer = ({ finishTest }) => (
  <React.Fragment>
    <MainContainer>
      <SummaryHeader />
      <SummaryTest finishTest={finishTest} />
    </MainContainer>
  </React.Fragment>
);

const enhance = compose(
  connect(
    null,
    {
      finishTest: finishTestAcitivityAction
    }
  )
);

export default enhance(SummaryContainer);

SummaryContainer.propTypes = {
  finishTest: PropTypes.func.isRequired
};
