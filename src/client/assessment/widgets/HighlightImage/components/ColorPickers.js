import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import ColorPicker from 'rc-color-picker';

import { secondaryTextColor, greenDark, red } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { FlexContainer, Paper } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';

import { Subtitle } from '../../../styled/Subtitle';

const ColorPikers = ({ onRemove, colors, changeHandler, t }) => {
  const getAlpha = (color) => {
    const regexValuesFromRgbaColor = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;

    return color.match(regexValuesFromRgbaColor) !== null
      ? +color.match(regexValuesFromRgbaColor).slice(-1) * 100
      : 100;
  };

  return (
    <Row gutter={60}>
      {colors.map((color, i) => (
        <Col key={i} span={8}>
          <Paper style={{ marginBottom: 20 }} padding="16px">
            <Subtitle padding="0 0 16px 0" fontSize={13} color={secondaryTextColor}>
              {`${t('component.highlightImage.lineColorLabel')} ${i + 1}`}
            </Subtitle>
            <FlexContainer style={{ width: '100%' }} justifyContent="space-between">
              <ColorPicker
                animation="slide-up"
                color={color}
                alpha={getAlpha(color)}
                onChange={changeHandler(i)}
              />
              {onRemove && (
                <IconTrash
                  onClick={onRemove(i)}
                  color={greenDark}
                  hoverColor={red}
                  width={20}
                  height={20}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </FlexContainer>
          </Paper>
        </Col>
      ))}
    </Row>
  );
};

ColorPikers.propTypes = {
  t: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  onRemove: PropTypes.any
};

ColorPikers.defaultProps = {
  onRemove: undefined
};

export default withNamespaces('assessment')(ColorPikers);
