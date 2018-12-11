import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { white } from '@edulastic/colors';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

const AddNew = ({ onClick, t }) => (
  <Container>
    <Button icon="plus" type="primary" onClick={onClick}>
      <span>{t('component.itemDetail.addNew')}</span>
    </Button>
  </Container>
);

AddNew.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('author')(AddNew);

const Container = styled.div`
  .ant-btn-primary {
    width: 195px;
    height: 40px;
  }

  .anticon-plus {
    position: relative;
    right: 35px;
    font-size: 18px;
    color: ${white};
  }

  .ant-btn > .anticon + span {
    color: ${white};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }
`;
