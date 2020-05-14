import React from "react";
import DragItem from "./DragItem";

function DragItems({ dragItems, onDropHandler, getStyles, disableResponse, changePreviewTab, previewTab }) {
  return dragItems.map(
    (item, ind) =>
      dragItems.includes(item) && (
        <DragItem
          flag="dragItems"
          onDrop={onDropHandler}
          key={ind}
          renderIndex={ind}
          item={item}
          getStyles={getStyles}
          disableResponse={disableResponse}
          changePreviewTab={changePreviewTab}
          previewTab={previewTab}
        />
      )
  );
}

export default DragItems;
