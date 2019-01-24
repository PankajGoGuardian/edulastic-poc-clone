import { Button } from 'antd';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState } from 'react';
import { withNamespaces } from '@edulastic/localization';

// components
import Breadcrumb from '../../sharedComponents/Breadcrumb';

const breadcrumbData = [{ title: 'ASSIGNMENTS', to: '' }];

const AssignmentSubHeader = ({ t }) => {
  const [btnIndex, setBtnIndex] = useState(0);

  const filters = [t('all'), t('notStarted'), t('inProgress')];

  const Filter = ({ index, value }) => (
    <FilterBtn onClick={() => setBtnIndex(index)} enabled={btnIndex === index}>
      {value}
    </FilterBtn>
  );

  return (
    <Wrapper>
      <BreadcrumbWrapper>
        <Breadcrumb data={breadcrumbData} />
      </BreadcrumbWrapper>
      <StatusBtnsContainer>
        {filters.map((value, i) => (
          <Filter key={i} index={i} value={value} />
        ))}
      </StatusBtnsContainer>
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
  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

const StatusBtnsContainer = styled.div`
  @media screen and (max-width: 992px) {
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: row;
    overflow: auto;
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

const FilterBtn = styled(Button)`
  height: 24px;
  color: ${props =>
    props.enabled
      ? props.theme.headerFilters.headerSelectedFilterTextColor
      : props.theme.headerFilters.headerFilterTextColor};
  border: 1px solid
    ${props => props.theme.headerFilters.headerFilterBgBorderColor};
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
  background: ${props =>
    props.enabled
      ? props.theme.headerFilters.headerSelectedFilterBgColor
      : props.theme.headerFilters.headerFilterBgColor};
  &:focus,
  &:active {
    color: ${props =>
      props.enabled
        ? props.theme.headerFilters.headerSelectedFilterTextColor
        : props.theme.headerFilters.headerFilterTextColor};
    background: ${props =>
      props.enabled
        ? props.theme.headerFilters.headerSelectedFilterBgColor
        : props.theme.headerFilters.headerFilterBgColor};
  }
  span {
    font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
    font-weight: 600;
  }
  @media screen and (max-width: 992px) {
    margin: 5px 10px 0px 0px;
    min-width: auto;
  }
`;
