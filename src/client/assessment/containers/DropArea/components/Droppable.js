import React from 'react'
import uuid from 'uuid/v4'
import { useDroppable } from '@dnd-kit/core'

export default function Droppable({ children }) {
  const { setNodeRef } = useDroppable({
    id: uuid.v4(),
  })

  return <div ref={setNodeRef}>{children}</div>
}
