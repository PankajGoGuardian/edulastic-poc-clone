import React from 'react';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
import { Checkbox, FlexContainer } from '@edulastic/common';
import PropTypes from 'prop-types';

const SettingsBarUseTabs = ({ onChangeLeft, onChangeRight, checkedLeft, checkedRight }) => (
  <Container>
    <Heading>Use Tabs</Heading>
    <FlexContainer justifyContent="space-between">
      <Checkbox label="Left Column" onChange={onChangeLeft} checked={checkedLeft} />
      <Checkbox label="Right Column" onChange={onChangeRight} checked={checkedRight} />
    </FlexContainer>
  </Container>
);

SettingsBarUseTabs.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  checkedLeft: PropTypes.bool.isRequired,
  checkedRight: PropTypes.bool.isRequired,
};

export default SettingsBarUseTabs;

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
