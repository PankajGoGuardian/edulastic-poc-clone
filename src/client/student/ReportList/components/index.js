import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
//components
import ReportListHeader from './header';
import ReportListSecondHeader from './SecondHeader';
import ReportListContent from './mainContent';
import MainContainer from '../../components/commonStyle/mainContainer';
//actions
import { loadTestActivityReportAction } from '../ducks';

const ReportListContainer = ({
  flag,
  match,
  location,
  loadReport,
  loadTestActivityReport
}) => {
  useEffect(() => {
    loadTestActivityReport({ testActivityId: match.params.id });
  }, []);
  return (
    <MainContainer flag={flag}>
      <ReportListHeader flag={flag} />
      <ReportListSecondHeader title={location.title} />
      <ReportListContent title={location.title} />
    </MainContainer>
  );
};

const enhance = compose(
  withRouter,
  connect(
    ({ ui, reports }) => ({
      flag: ui.flag,
      reportDetail: reports.reportDetail
    }),
    {
      loadTestActivityReport: loadTestActivityReportAction
    }
  )
);

export default enhance(ReportListContainer);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired
};
