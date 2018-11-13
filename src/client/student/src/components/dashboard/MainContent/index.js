import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Header from './header';
import AssignmentsContent from './content';

const MainContent = ({ flag }) => (
  <Layout flag={flag}>
    <Header flag={flag} />
    <AssignmentsContent />
  </Layout>
);

export default React.memo(
  connect(({ ui }) => ({
    flag: ui.flag,
  }))(MainContent),
);

MainContent.propTypes = {
  flag: PropTypes.bool.isRequired,
};
