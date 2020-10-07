import React from 'react'
import DragItem from './DragItem'

function DragItems({
  dragItems,
  getStyles,
  disableResponse,
  changePreviewTab,
  previewTab,
}) {
  return dragItems.map(
    (item, ind) =>
      dragItems.includes(item) && (
        <DragItem
          flag="dragItems"
          key={item?.value || ind}
          renderIndex={ind}
          item={item}
          getStyles={getStyles}
          disableResponse={disableResponse}
          changePreviewTab={changePreviewTab}
          previewTab={previewTab}
        />
      )
  )
}

export default DragItems
