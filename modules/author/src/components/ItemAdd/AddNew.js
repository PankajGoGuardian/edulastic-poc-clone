import React from 'react';
import styled from 'styled-components';
import { translate } from '../../utils/localization';
import {
  greenDark,
  secondaryTextColor,
  green,
} from '../../utils/css';
import { IconPlus } from '../common/icons';

const AddNew = () => (
  <React.Fragment>
    <PlusWrapper>
      <IconPlus
        color={greenDark}
        width={60}
        height={60}
        style={{ marginBottom: 35 }}
        hoverColor={green}
      />{' '}
      <Text>{translate('component.itemdetail.addnew.addnew')}</Text>
    </PlusWrapper>
  </React.Fragment>
);

export default AddNew;

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
    fill: ${green}
  }
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${secondaryTextColor};
`;
