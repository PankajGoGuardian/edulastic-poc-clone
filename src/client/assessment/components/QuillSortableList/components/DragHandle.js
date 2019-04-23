import React from "react";
import PropTypes from "prop-types";
import { SortableHandle } from "react-sortable-hoc";
import { DragIcon, DragLine } from "../styled/SortableItemContainer";

const DragHandle = SortableHandle(() => (
  <DragIcon>
    <DragLine />
    <DragLine />
    <DragLine />
  </DragIcon>
));

DragHandle.propTypes = {
  index: PropTypes.string
};

export default DragHandle;
