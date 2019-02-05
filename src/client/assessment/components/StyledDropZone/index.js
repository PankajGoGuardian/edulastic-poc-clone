import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { withNamespaces } from '@edulastic/localization';
import { IconUpload } from '@edulastic/icons';
import { dashBorderColor, mainBlueColor, dropZoneTitleColor } from '@edulastic/colors';

import { Container } from './styled/Container';
import { ZoneTitle } from './styled/ZoneTitle';
import { Underlined } from './styled/Underlined';

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
          <ZoneTitle>{t('component.dropZone.dragDrop')}</ZoneTitle>
          <ZoneTitle color={dropZoneTitleColor}>
            {t('component.dropZone.yourOwnImage')}
          </ZoneTitle>
          <ZoneTitle style={{ marginTop: 12 }} fontSize={11}>
            {t('component.dropZone.or')} <Underlined>{t('component.dropZone.browse')}</Underlined>: PNG, JPG, GIF (1024KB MAX.)
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
