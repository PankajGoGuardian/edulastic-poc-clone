import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Button } from './styled';

const Footer = ({ onCancel, onOk, disabled }) => (
  <FlexContainer justifyContent="space-around" style={{ padding: '20px 0' }}>
    <Button key="back" size="large" onClick={onCancel}>
      Cancel
    </Button>
    <Button
      key="submit"
      size="large"
      type="primary"
      onClick={onOk}
      data-cy="apply"
      disabled={disabled}
    >
      Apply
    </Button>
  </FlexContainer>
);

Footer.PropTypes = {
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired
};

export default Footer;
