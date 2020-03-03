import React from "react";
import { IconEye, IconTrash, IconExpand, IconCollapse } from "@edulastic/icons";
import { Container, ActionButton } from "./styled";

export default ({ expanded, onPreview, onDelete, onCollapseExpandRow, isEditable, style }) => (
  <Container style={style}>
    <ActionButton onClick={onCollapseExpandRow}>
      {expanded ? <IconCollapse width={15} height={15} /> : <IconExpand width={15} height={15} />}
    </ActionButton>
    <ActionButton onClick={onPreview}>
      <IconEye width={18} height={18} />
    </ActionButton>
    {isEditable && (
      <ActionButton onClick={onDelete}>
        <IconTrash width={15} height={15} />
      </ActionButton>
    )}
  </Container>
);
