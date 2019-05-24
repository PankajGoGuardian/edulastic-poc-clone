import React, { memo } from "react";
import { SortableElement } from "react-sortable-hoc";
import PropTypes from "prop-types";

import { FroalaEditor, FlexContainer } from "@edulastic/common";

import { SortableItemContainer } from "../styled/SortableItemContainer";
import { Label } from "../styled/Label";
import { IconTrash } from "../styled/IconTrash";
import DragHandle from "./DragHandle";

// TODO: rOnly is in use?
const QuillSortableItem = SortableElement(({ value, onRemove, rOnly, onChange, columns, indx, label, fontSize }) => (
  <SortableItemContainer fontSize={fontSize} columns={columns}>
    {label && <Label>{label}</Label>}
    <FlexContainer style={{ flex: 1 }}>
      <div className="main" data-cy="quillSortableItem">
        <DragHandle index={indx} />

        <FroalaEditor value={value} onChange={onChange} toolbarInline toolbarVisibleWithoutSelection />
      </div>
      {onRemove && <IconTrash data-cypress="deleteButton" data-cy={`delete${indx}`} onClick={onRemove} />}
    </FlexContainer>
  </SortableItemContainer>
));

QuillSortableItem.propTypes = {
  columns: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  rOnly: PropTypes.bool,
  firstFocus: PropTypes.bool,
  style: PropTypes.object
};

QuillSortableItem.defaultProps = {
  rOnly: false,
  firstFocus: false,
  style: {}
};

export default memo(QuillSortableItem);
