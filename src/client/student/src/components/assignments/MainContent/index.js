import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Header from './header';
import SecondHeadbar from './SecondHeader';
import AssignmentsContent from './content';

const MainContent = ({ flag }) => (
  <Layout flag={flag} style={{ width: '100%' }}>
    <Header flag={flag} />
    <SecondHeadbar />
    <AssignmentsContent />
  </Layout>
);

export default React.memo(
  connect(({ ui }) => ({
    flag: ui.flag
  }))(MainContent)
);

MainContent.propTypes = {
  flag: PropTypes.bool.isRequired
};
