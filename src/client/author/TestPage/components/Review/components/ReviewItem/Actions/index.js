import React from 'react'
import { IconEye, IconTrash, IconExpand, IconCollapse } from '@edulastic/icons'
import { Tooltip } from 'antd'
import { Container, ActionButton } from './styled'

export default ({
  isAutoselect,
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
    >
      {expanded ? (
        <IconCollapse width={15} height={15} />
      ) : (
        <IconExpand width={15} height={15} />
      )}
    </ActionButton>
    <ActionButton isGhost title="Preview" data-cy="preview" onClick={onPreview}>
      <IconEye width={18} height={18} />
    </ActionButton>
    {isEditable && (
      <Tooltip
        title={isAutoselect ? "Auto selected item can't be deleted" : ''}
      >
        <span
          style={{
            cursor: isAutoselect ? 'not-allowed' : 'pointer',
            marginLeft: '5px',
          }}
        >
          <ActionButton
            disabled={isAutoselect}
            isGhost
            title="Remove"
            data-cy="delete"
            onClick={onDelete}
            style={isAutoselect ? { pointerEvents: 'none' } : {}}
            onMouseDown={(e) => e && e.preventDefault()}
          >
            <IconTrash width={15} height={15} />
          </ActionButton>
        </span>
      </Tooltip>
    )}
  </Container>
)
