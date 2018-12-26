import React, { Component } from 'react';
import styled from 'styled-components';

import Breadcrumb from '../../../../../author/src/components/Breadcrumb';

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
        <div>
          <Breadcrumb data={breadcrumbData} />
        </div>
      </Container>
    );
  }
}

export default SecondHeadbar;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 40px 20px 30px;
`;
