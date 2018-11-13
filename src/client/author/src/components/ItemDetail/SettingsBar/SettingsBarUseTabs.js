import React from 'react';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
import { Checkbox, FlexContainer } from '@edulastic/common';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

const SettingsBarUseTabs = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight, t }) => (
  <Container>
    <Heading>{t('component.settingsBar.useTabs')}</Heading>
    <FlexContainer justifyContent="space-between">
      <Checkbox
        label={t('component.settingsBar.leftColumn')}
        onChange={onChangeLeft}
        checked={checkedLeft}
      />
      <Checkbox
        label={t('component.settingsBar.rightColumn')}
        onChange={onChangeRight}
        checked={checkedRight}
      />
    </FlexContainer>
  </Container>
);

SettingsBarUseTabs.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  checkedLeft: PropTypes.bool.isRequired,
  checkedRight: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces('author')(SettingsBarUseTabs);

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  padding: 15px;
  margin-bottom: 50px;
`;

const Heading = styled.div`
  color: ${greenDark};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 15px;
`;
