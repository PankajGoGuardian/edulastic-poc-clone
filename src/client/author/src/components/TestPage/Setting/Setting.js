import React, { memo } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styled from 'styled-components';
import { IconSource } from '@edulastic/icons';
import { withNamespaces } from '@edulastic/localization';
import { blue } from '@edulastic/colors';

import { Container, ButtonLink } from '../../common';
import Breadcrumb from '../../Breadcrumb';
import MainSetting from './MainSetting';


const Setting = ({ t, current, history }) => {
  const breadcrumbData = [
    {
      title: 'ITEM LIST', to: '/author/tests'
    },
    {
      title: current, to: ''
    }
  ];

  return (
    <Container>
      <SecondHeader>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        <Button>
          <ButtonLink
            color="primary"
            icon={<IconSource color={blue} />}
          >
            {t('component.questioneditor.buttonbar.source')}
          </ButtonLink>
        </Button>
      </SecondHeader>
      <MainSetting history={history} />
    </Container>
  );
};

Setting.propTypes = {
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  history: PropTypes.func.isRequired,
};

const enhance = compose(
  memo,
  withRouter,
  withNamespaces('author'),
);

export default enhance(Setting);

const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;

  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;
