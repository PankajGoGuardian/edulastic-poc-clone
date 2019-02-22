import React from "react";
import PropTypes from "prop-types";

import { IconTrashWrapper } from "../styled/IconTrashWrapper";
import { IconTrash } from "../styled/IconTrash";

const DeleteButton = ({ onDelete }) => (
  <IconTrashWrapper onClick={onDelete}>
    <IconTrash />
  </IconTrashWrapper>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired
};

export default React.memo(DeleteButton);
