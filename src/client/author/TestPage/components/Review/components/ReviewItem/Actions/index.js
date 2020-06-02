import React from "react";
import { IconEye, IconTrash, IconExpand, IconCollapse } from "@edulastic/icons";
import { Container, ActionButton } from "./styled";

export default ({ expanded, onPreview, onDelete, onCollapseExpandRow, isEditable, style }) => (
  <Container style={style}>
    <ActionButton title="Expand" data-cy={`expand-${expanded}`} onClick={onCollapseExpandRow}>
      {expanded ? <IconCollapse width={15} height={15} /> : <IconExpand width={15} height={15} />}
    </ActionButton>
    <ActionButton title="Preview" data-cy="preview" onClick={onPreview}>
      <IconEye width={18} height={18} />
    </ActionButton>
    {isEditable && (
      <ActionButton title="Remove" data-cy="delete" onClick={onDelete}>
        <IconTrash width={15} height={15} />
      </ActionButton>
    )}
  </Container>
);
