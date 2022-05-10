import React from 'react'
import { IconEye, IconTrash, IconExpand, IconCollapse } from '@edulastic/icons'
import { connect } from 'react-redux'
import { Container, ActionButton } from './styled'
import { getTestsCreatingSelector } from '../../../../../ducks'

const Actions = ({
  expanded,
  onPreview,
  onDelete,
  onCollapseExpandRow,
  isEditable,
  style,
  isTestLoading,
}) => (
  <Container style={style}>
    <ActionButton
      isGhost
      title="Expand"
      data-cy={`expand-${expanded}`}
      onClick={onCollapseExpandRow}
      disabled={isTestLoading}
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
      disabled={isTestLoading}
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
        disabled={isTestLoading}
      >
        <IconTrash width={15} height={15} />
      </ActionButton>
    )}
  </Container>
)

export default connect((state) => ({
  isTestLoading: getTestsCreatingSelector(state),
}))(Actions)
