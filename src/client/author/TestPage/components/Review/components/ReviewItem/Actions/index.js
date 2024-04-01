import React from 'react'
import { IconEye, IconTrash, IconExpand, IconCollapse } from '@edulastic/icons'
import { Container, ActionButton } from './styled'

export default ({
  expanded,
  onPreview,
  onDelete,
  onCollapseExpandRow,
  isEditable,
  style,
}) => (
  <Container style={style}>
    <ActionButton
      isGhost
      title="Expand"
      data-cy={`expand-${expanded}`}
      onClick={onCollapseExpandRow}
      IconBtn
    >
      {expanded ? (
        <IconCollapse width={15} height={15} />
      ) : (
        <IconExpand width={15} height={15} />
      )}
    </ActionButton>
    <ActionButton
      isGhost
      title="Preview"
      data-cy="preview"
      onClick={onPreview}
      IconBtn
    >
      <IconEye width={18} height={18} />
    </ActionButton>
    {isEditable && (
      <ActionButton
        isGhost
        title="Remove"
        data-cy="delete"
        onClick={onDelete}
        onMouseDown={(e) => e && e.preventDefault()}
        IconBtn
      >
        <IconTrash width={15} height={15} />
      </ActionButton>
    )}
  </Container>
)
