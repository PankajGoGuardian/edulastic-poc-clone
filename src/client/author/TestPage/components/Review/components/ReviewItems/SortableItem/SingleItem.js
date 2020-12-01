import React, { useState, useEffect } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import ReviewItem from '../../ReviewItem'
import DragHandle from './DragHandle'
import { DragCrad, ReviewItemWrapper } from '../styled'

const SortableItem = SortableElement((props) => {
  const { item, isEditable, expand, groupMinimized } = props
  return (
    <DragCrad data-cy="drag-card" noPadding={groupMinimized}>
      {!expand && !groupMinimized && (
        <DragHandle isEditable={isEditable} indx={item.indx} />
      )}
      <ReviewItemWrapper data-cy={item._id} fullWidth={groupMinimized}>
        <ReviewItem {...props} />
      </ReviewItemWrapper>
    </DragCrad>
  )
})

export default (props) => {
  const { item, isCollapse, removeItem, disabled, ...rest } = props

  const [expand, toggleExpand] = useState(false)

  const toggleExpandRow = () => toggleExpand(!expand)

  const handleDelete = () => {
    removeItem(item._id)
  }

  useEffect(() => {
    toggleExpand(!isCollapse)
  }, [isCollapse])

  return (
    <SortableItem
      {...rest}
      item={item}
      expand={expand}
      disabled={disabled || expand}
      onDelete={handleDelete}
      toggleExpandRow={toggleExpandRow}
    />
  )
}
