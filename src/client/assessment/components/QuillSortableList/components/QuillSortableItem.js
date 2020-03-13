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
  ({
    value,
    toolbarId,
    toolbarSize,
    onRemove,
    rOnly,
    onChange,
    columns,
    styleType,
    indx,
    label,
    fontSize,
    canDelete,
    placeholder,
    centerContent,
    imageDefaultWidth
  }) => (
    <SortableItemContainer styleType={styleType} fontSize={fontSize} columns={columns}>
      {label && <Label>{label}</Label>}
      <FlexContainer style={{ flex: 1 }} data-cy="quillSortableItem">
        <div className="main">
          <DragHandle index={indx} />
          <QuestionTextArea
            value={value}
            fontSize={fontSize}
            placeholder={placeholder}
            toolbarId={`${toolbarId}${indx}`}
            onChange={onChange}
            style={{ width: "100%" }}
            readOnly={rOnly}
            centerContent={centerContent}
            toolbarSize={toolbarSize}
            imageDefaultWidth={imageDefaultWidth}
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
  t: PropTypes.func.isRequired,
  toolbarId: PropTypes.string,
  styleType: PropTypes.string,
  columns: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  rOnly: PropTypes.bool,
  firstFocus: PropTypes.bool,
  style: PropTypes.object,
  imageDefaultWidth: PropTypes.number
};

QuillSortableItem.defaultProps = {
  toolbarId: "quill-sortable-item",
  rOnly: false,
  firstFocus: false,
  styleType: "button",
  style: {},
  imageDefaultWidth: 300
};

export default memo(QuillSortableItem);
