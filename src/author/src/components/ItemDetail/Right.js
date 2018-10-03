import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';

import AddNew from '../ItemAdd/AddNew';

const Right = ({ onAdd }) => (
  <FlexContainer>
    <AddNew moveNew={onAdd} />
  </FlexContainer>
);

Right.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Right;
