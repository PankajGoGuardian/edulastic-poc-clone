import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fileApi } from '@edulastic/api';

import { Input, Upload, Button, Row, Col, Checkbox } from 'antd';
import { FlexContainer } from '@edulastic/common';
import O from '../common/Options';

function Options({ onChange, item }) {
  const [uploading, setUploading] = useState(false);

  const customRequest = async ({ file, onSuccess }) => {
    setUploading(true);
    try {
      const { fileUri } = await fileApi.upload({ file });
      setUploading(false);
      onChange('image', fileUri);
      onSuccess(null, file);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div>
      <StyledRow gutter={32}>
        <Col span={12}>
          <O.Label>Image alternative text</O.Label>
          <StyledInput
            size="large"
            value={item.alt}
            onChange={e => onChange('alt', e.target.value)}
          />
        </Col>
        <Col span={12}>
          <O.Label>Label</O.Label>
          <StyledInput value={item.label} onChange={e => onChange('label', e.target.value)} />
        </Col>
      </StyledRow>

      <StyledRow gutter={32}>
        <Col span={12}>
          <O.Label>Width (px)</O.Label>
          <StyledInput
            size="large"
            value={item.width}
            type="number"
            onChange={e => onChange('width', +e.target.value)}
          />
        </Col>
        <Col span={12}>
          <O.Label>Height (px)</O.Label>
          <StyledInput
            size="large"
            value={item.height}
            type="number"
            onChange={e => onChange('height', +e.target.value)}
          />
        </Col>
      </StyledRow>
      <StyledRow gutter={32} align="middle" type="flex">
        <Col span={12}>
          <O.Label>Button Icon</O.Label>
          <FlexContainer>
            <StyledInput
              size="large"
              value={item.image}
              onChange={e => onChange('image', e.target.value)}
            />
            <Upload showUploadList={false} customRequest={customRequest}>
              <Button loading={uploading} size="large">
                Browse
              </Button>
            </Upload>
          </FlexContainer>
        </Col>
        <Col span={12}>
          <O.Label>&nbsp;</O.Label>
          <FlexContainer>
            <Checkbox
              size="large"
              checked={item.button}
              onChange={e => onChange('button', e.target.checked)}
            >
              Show button
            </Checkbox>
            <Checkbox
              size="large"
              checked={item.rotate}
              onChange={e => onChange('rotate', e.target.checked)}
            >
              Show rotate
            </Checkbox>
          </FlexContainer>
        </Col>
      </StyledRow>
    </div>
  );
}

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default Options;

const StyledInput = styled(Input)`
  width: 100%;
`;

const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;
