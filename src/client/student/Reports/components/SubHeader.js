import { Button } from 'antd';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';
import { withNamespaces } from '@edulastic/localization';

// components
import Breadcrumb from '../../components/Breadcrumb';

const breadcrumbData = [{ title: 'REPORTS', to: '' }];

const AssignmentSubHeader = () => {
  return (
    <Wrapper>
      <BreadcrumbWrapper>
        <Breadcrumb data={breadcrumbData} />
      </BreadcrumbWrapper>
    </Wrapper>
  );
};

const enhance = compose(withNamespaces('default'));

export default enhance(AssignmentSubHeader);

AssignmentSubHeader.propTypes = {
  t: PropTypes.func.isRequired
};

const Wrapper = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 40px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

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
