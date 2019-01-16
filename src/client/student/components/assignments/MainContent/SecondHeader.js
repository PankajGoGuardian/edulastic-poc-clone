import React, { Component } from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import Breadcrumb from '../../Breadcrumb';

class SecondHeadbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIdx: 0,
      breadcrumbData: [{ title: 'ASSIGNMENTS', to: '' }]
    };
  }

  handlerButton = (index) => {
    this.setState({ buttonIdx: index });
  }

  render() {
    const { buttonIdx, breadcrumbData } = this.state;
    const { t } = this.props;
    return (
      <Container>
        <BreadcrumbWrapper>
          <Breadcrumb data={breadcrumbData} />
        </BreadcrumbWrapper>
        <StatusBtnsContainer>
          <StyledButton
            onClick={() => this.handlerButton(0)}
            enabled={buttonIdx === 0 && true}
          >
            6 &nbsp; {t('all')}
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(1)}
            enabled={buttonIdx === 1 && true}
          >
            1 &nbsp; {t('notStarted')}
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(2)}
            enabled={buttonIdx === 2 && true}
          >
            0 &nbsp; {t('inProgress')}
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(3)}
            enabled={buttonIdx === 3 && true}
          >
            5 &nbsp; {t('submitted')}
          </StyledButton>
          <StyledButton
            onClick={() => this.handlerButton(4)}
            enabled={buttonIdx === 4 && true}
          >
            0 &nbsp; {t('graded')}
          </StyledButton>
        </StatusBtnsContainer>
      </Container>
    );
  }
}

const enhance = compose(
  withNamespaces('default')
);

export default enhance(SecondHeadbar);

SecondHeadbar.propTypes = {
  t: PropTypes.func.isRequired
};

const Container = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 40px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusBtnsContainer = styled.div`
  @media screen and (max-width: 768px) {
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

const StyledButton = styled(Button)`
  height: 24px;
  color: ${props => (props.enabled ? props.theme.headerFilters.headerSelectedFilterTextColor : props.theme.headerFilters.headerFilterTextColor)};
  border: 1px solid ${props => props.theme.headerFilters.headerFilterBgBorderColor};
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
  background: ${props => (props.enabled ? props.theme.headerFilters.headerSelectedFilterBgColor : props.theme.headerFilters.headerFilterBgColor)};
  &:focus, &:active {
    color: ${props => (props.enabled ? props.theme.headerFilters.headerSelectedFilterTextColor : props.theme.headerFilters.headerFilterTextColor)};
    background: ${props => (props.enabled ? props.theme.headerFilters.headerSelectedFilterBgColor : props.theme.headerFilters.headerFilterBgColor)};
  }
  span {
    font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
    font-weight: 600;
  }
  @media screen and (max-width: 768px) {
    margin:5px 10px 0px 0px;
    min-width: auto;
  }
`;
