import React, { memo } from "react";
import { SortableElement } from "react-sortable-hoc";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { SortableItemContainer } from "../styled/SortableItemContainer";
import { Label } from "../styled/Label";
import { IconTrash } from "../styled/IconTrash";
import DragHandle from "./DragHandle";
import QuestionTextArea from "../../QuestionTextArea";

// TODO: rOnly is in use?
const QuillSortableItem = SortableElement(
  ({ value, toolbarId, onRemove, rOnly, onChange, columns, indx, label, fontSize, canDelete }) => (
    <SortableItemContainer fontSize={fontSize} columns={columns}>
      {label && <Label>{label}</Label>}
      <FlexContainer style={{ flex: 1 }}>
        <div className="main" data-cy="quillSortableItem">
          <DragHandle index={indx} />

          <QuestionTextArea
            value={value}
            toolbarId={`${toolbarId}${indx}`}
            onChange={onChange}
            style={{ width: "100%" }}
            readOnly={rOnly}
          />
        </div>
        {canDelete && onRemove && (
          <IconTrash data-cypress="deleteButton" data-cy={`delete${indx}`} onClick={onRemove} />
        )}
      </FlexContainer>
    </SortableItemContainer>
  )
);

QuillSortableItem.propTypes = {
  toolbarId: PropTypes.string,
  columns: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  rOnly: PropTypes.bool,
  firstFocus: PropTypes.bool,
  style: PropTypes.object
};

QuillSortableItem.defaultProps = {
  toolbarId: "quill-sortable-item",
  rOnly: false,
  firstFocus: false,
  style: {}
};

export default memo(QuillSortableItem);
