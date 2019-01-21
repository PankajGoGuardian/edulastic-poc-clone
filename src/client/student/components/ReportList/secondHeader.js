import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col } from 'antd';

import Breadcrumb from '../Breadcrumb';
import QuestionSelect from './QuestionSelect.js';

class ReportListSecondHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbData: [
        { title: 'REPORTS', to: '/home/reports' },
        { title: props.title, to: '' }
      ]
    };
  }

  render() {
    const { breadcrumbData } = this.state;
    return (
      <Container>
        <BreadcrumbContainer>
          <Breadcrumb data={breadcrumbData} />
        </BreadcrumbContainer>
        <QuestionSelectDesktop>
          <QuestionSelect />
        </QuestionSelectDesktop>
      </Container>
    );
  }
}

export default ReportListSecondHeader;

ReportListSecondHeader.propTypes = {
  title: PropTypes.string
};

ReportListSecondHeader.defaultProps = {
  title: 'Test'
};

const Container = styled.div`
  padding: 20px 40px 0px 40px;
  display: flex;
`;

const QuestionSelectDesktop = styled(Col)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
`;
