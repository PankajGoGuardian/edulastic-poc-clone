import React from 'react';
import styled from 'styled-components';
import { textColor, white, green } from '@edulastic/colors';
import { IconPlus } from '@edulastic/icons';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

const AddNew = ({ onClick, t }) => (
  <Container onClick={onClick}>
    <Icon>
      <IconPlus color={textColor} />
    </Icon>
    <span>{t('component.itemDetail.addNew')}</span>
  </Container>
);

AddNew.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces('author')(AddNew);

const Container = styled.div`
  position: relative;
  cursor: pointer;
  text-transform: uppercase;
  color: ${textColor};
  width: 215px;
  height: 60px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  background: ${white};
  padding-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    color: ${green};
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 15px;
  top: calc(50% - 8px);
`;
