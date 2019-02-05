import React from 'react';
import PropTypes from 'prop-types';
import { IconTrashAlt } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';
import { IconTrashWrapper } from '../styled/IconTrashWrapper';

const DeleteButton = ({ onDelete }) => (
  <IconTrashWrapper onClick={onDelete}>
    <IconTrashAlt color={greenDark} hoverColor={red} />
  </IconTrashWrapper>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired
};

export default React.memo(DeleteButton);
