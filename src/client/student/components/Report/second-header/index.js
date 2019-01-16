import React, { Component } from 'react';
import styled from 'styled-components';

import Breadcrumb from '../../Breadcrumb';

class SecondHeadbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbData: [{ title: 'REPORTS', to: '' }]
    };
  }

  render() {
    const { breadcrumbData } = this.state;
    return (
      <Container>
        <BreadcrumbWrapper>
          <Breadcrumb data={breadcrumbData} />
        </BreadcrumbWrapper>
      </Container>
    );
  }
}

export default SecondHeadbar;

const BreadcrumbWrapper = styled.div`
  .ant-breadcrumb-link {
    color: ${props => props.theme.breadcrumbs.breadcrumbTextColor};
    font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSize};
    text-transform: uppercase;
    font-weight: 600;
    a {
      color: ${props => props.theme.breadcrumbs.breadcrumbLinkColor};
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 40px 20px 30px;
`;
