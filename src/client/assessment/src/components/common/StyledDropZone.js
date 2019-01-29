import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import { IconUpload } from '@edulastic/icons';
import { dashBorderColor, mainBlueColor, dropZoneTitleColor } from '@edulastic/colors';

const StyledDropZone = ({ thumb, loading, isDragActive, t }) => (
  <Container
    isDragActive={isDragActive}
    childMarginRight={0}
    justifyContent="center"
    flexDirection="column"
  >
    {loading ? (
      <Icon type="loading" style={{ fontSize: 100 }} />
    ) : (
      thumb || (
        <Fragment>
          <IconUpload
            style={{ marginBottom: 20 }}
            width={90}
            color={isDragActive ? mainBlueColor : dashBorderColor}
            height={75}
          />
          <ZoneTitle>{t('component.hotspot.dropZoneTitle')}</ZoneTitle>
          <ZoneTitle color={dropZoneTitleColor}>
            {t('component.hotspot.dropZoneSubTitle')}
          </ZoneTitle>
          <ZoneTitle style={{ marginTop: 12 }} fontSize={11}>
            OR <Underlined>BROWSE</Underlined>: PNG, JPG, GIF (1024KB MAX.)
          </ZoneTitle>
        </Fragment>
      )
    )}
  </Container>
);

StyledDropZone.propTypes = {
  thumb: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  isDragActive: PropTypes.any,
  t: PropTypes.func.isRequired
};

StyledDropZone.defaultProps = {
  thumb: null,
  isDragActive: false
};

export default withNamespaces('assessment')(StyledDropZone);

const Container = styled(FlexContainer)`
  min-height: 616px;
  width: 100%;
  border: ${({ isDragActive }) =>
    (isDragActive ? `2px solid ${mainBlueColor}` : `1px solid ${dashBorderColor}`)};
`;

const ZoneTitle = styled.div`
  font-size: ${({ fontSize }) => fontSize || 16}px;
  font-weight: 900;
  text-transform: uppercase;
  color: ${({ color }) => color || dashBorderColor};
`;

const Underlined = styled.span`
  color: ${mainBlueColor};
  cursor: pointer;
  text-decoration: underline;
`;
