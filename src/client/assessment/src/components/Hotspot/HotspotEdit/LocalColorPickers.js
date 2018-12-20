import React, { Fragment } from 'react';
import { Row, Col, Select } from 'antd';
import ColorPicker from 'rc-color-picker';
import PropTypes from 'prop-types';

import { secondaryTextColor } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

import { Subtitle } from '../../common';
import { getAlpha } from './AreasContainer/helpers';

const { Option } = Select;

const LocalColorPickers = ({
  t,
  attributes,
  onLocalColorChange,
  areaIndexes,
  handleSelectChange
}) => (
  <div>
    {areaIndexes.length > 0 && (
      <Fragment>
        <Subtitle>{t('component.hotspot.areaSelectLabel')}</Subtitle>
        <Select value={attributes.area} onChange={handleSelectChange}>
          {areaIndexes.map(index => (
            <Option key={index} value={index}>
              {index + 1}
            </Option>
          ))}
        </Select>
      </Fragment>
    )}
    <Row gutter={80}>
      <Col span={5}>
        <Subtitle fontSize={13} color={secondaryTextColor}>
          {t('component.hotspot.fillColorTitle')}
        </Subtitle>
        <ColorPicker
          onChange={onLocalColorChange('fill')}
          animation="slide-up"
          color={attributes.fill}
          alpha={getAlpha(attributes.fill)}
        />
      </Col>
      <Col span={5}>
        <Subtitle fontSize={13} color={secondaryTextColor}>
          {t('component.hotspot.outlineColorTitle')}
        </Subtitle>
        <ColorPicker
          onChange={onLocalColorChange('stroke')}
          animation="slide-up"
          color={attributes.stroke}
          alpha={getAlpha(attributes.stroke)}
        />
      </Col>
    </Row>
  </div>
);

LocalColorPickers.propTypes = {
  t: PropTypes.func.isRequired,
  attributes: PropTypes.object.isRequired,
  onLocalColorChange: PropTypes.func.isRequired,
  areaIndexes: PropTypes.array.isRequired,
  handleSelectChange: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(LocalColorPickers);
