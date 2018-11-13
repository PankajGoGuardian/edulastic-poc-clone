import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconPlus } from '@edulastic/icons';
import { greenDark, secondaryTextColor, green } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

const AddNew = ({ moveNew, t, style }) => (
  <PlusWrapper onClick={moveNew} style={style}>
    <IconPlus
      color={greenDark}
      width={60}
      height={60}
      style={{ marginBottom: 35 }}
      hoverColor={green}
    />{' '}
    <Text>{t('component.itemdetail.addnew.addnew')}</Text>
  </PlusWrapper>
);

AddNew.propTypes = {
  moveNew: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AddNew.defaultProps = {
  style: {},
};

export default withNamespaces('author')(AddNew);

const PlusWrapper = styled.div`
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  background-color: #efefef;
  border: solid 2px #e9e9e9;
  height: 360px;

  &:hover svg {
    fill: ${green};
  }
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${secondaryTextColor};
`;
