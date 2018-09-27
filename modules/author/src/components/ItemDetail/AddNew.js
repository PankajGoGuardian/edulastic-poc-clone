import React from 'react';
import styled from 'styled-components';
import { translate } from '../../utils/localization';
import {
  greenDark,
  lightGrey,
  secondaryTextColor,
  green,
} from '../../../../assessment/src/utils/css';
import { IconPlus } from '../../../../assessment/src/components/common/icons';

const AddNew = () => (
  <Container>
    <PlusWrapper>
      <IconPlus
        color={greenDark}
        width={60}
        height={60}
        style={{ marginBottom: 15 }}
        hoverColor={green}
      />{' '}
      <Text>{translate('component.itemdetail.addnew.addnew')}</Text>
    </PlusWrapper>
  </Container>
);

export default AddNew;

const Container = styled.div`
  height: 205px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${lightGrey};
  border: solid 1px #e9e9e9;
  border-radius: 10px;
`;

const PlusWrapper = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Text = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${secondaryTextColor};
`;
