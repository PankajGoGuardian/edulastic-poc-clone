import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReportListHeader from './header';
import ReportListSecondHeader from './second-headbar';
import ReportListContent from './maincontent';
import MainContainer from '../commonStyle/mainContainer';
import { fetchTestActivityDetailAction } from '../../actions/report';

const ReportListContainer = ({ flag, location, reportDetail, fetchTestActivityDetail }) => {
  useEffect(() => {
    fetchTestActivityDetail(location.testActivityId);
  }, []);
  return (
    <React.Fragment>
      <MainContainer flag={flag}>
        <ReportListHeader flag={flag} />
        <ReportListSecondHeader />
        <ReportListContent testActivityId={location.testActivityId} />
      </MainContainer>
    </React.Fragment>
  );
};

export default React.memo(
  connect(
    ({ ui, reports }) => ({ flag: ui.flag, reportDetail: reports.reportDetail }),
    {
      fetchTestActivityDetail: fetchTestActivityDetailAction
    }
  )(ReportListContainer)
);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  fetchTestActivityDetail: PropTypes.func.isRequired,
  reportDetail: PropTypes.object
};

ReportListContainer.defaultProps = {
  reportDetail: {}
};
