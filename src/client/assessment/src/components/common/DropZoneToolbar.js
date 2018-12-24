import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { dashBorderColorOpacity } from '@edulastic/colors';

import { LargeInput } from '.';
import { HEIGHT, ALT_TEXT, WIDTH } from '../../constants/constantsForQuestions';

const DropZoneToolbar = ({ width, height, altText, handleChange, t }) => (
  <Container childMarginRight={40}>
    <LargeInput
      type="number"
      label={t('component.hotspot.widthLabel')}
      value={width}
      marginRight={15}
      onChange={handleChange(WIDTH)}
    />
    <LargeInput
      type="number"
      label={t('component.hotspot.heightLabel')}
      value={height}
      marginRight={15}
      onChange={handleChange(HEIGHT)}
    />
    <LargeInput
      type="text"
      textAlign="left"
      marginRight={15}
      width={245}
      label={t('component.hotspot.altTextLabel')}
      value={altText}
      onChange={handleChange(ALT_TEXT)}
    />
  </Container>
);

DropZoneToolbar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  altText: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(DropZoneToolbar);

const Container = styled(FlexContainer)`
  min-height: 67px;
  padding: 14px;
  background: ${dashBorderColorOpacity};
  margin-top: 20px;
`;
