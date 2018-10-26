import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edulastic/common';

const ViewButton = ({ onClick, children }) => (
  <Button
    style={{
      width: '100%',
      height: 50,
      fontSize: 11,
      fontWeight: 600,
    }}
    variant="extendedFab"
    color="primary"
    outlined
    onClick={onClick}
  >
    {children}
  </Button>
);

ViewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
};

export default ViewButton;
