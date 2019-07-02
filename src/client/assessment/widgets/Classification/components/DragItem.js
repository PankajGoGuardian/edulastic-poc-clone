import React from "react";
import { DragSource } from "react-dnd";
import { withTheme } from "styled-components";

import { FlexContainer, MathFormulaDisplay } from "@edulastic/common";

import { IconCheck } from "../styled/IconCheck";
import { IconClose } from "../styled/IconClose";
import { IndexBox } from "../styled/IndexBox";
import { getStyles } from "../utils";
import { CLEAR } from "../../../constants/constantsForQuestions";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    if (props.previewTab !== CLEAR && typeof props.changePreviewTab === "function") {
      props.changePreviewTab();
    }
    return { item: props.item };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const DragItem = ({
  connectDragSource,
  item,
  isDragging,
  valid,
  preview,
  renderIndex,
  theme,
  isTransparent,
  dragHandle
}) =>
  item
    ? connectDragSource(
        <div
          data-cy={`drag-drop-item-${renderIndex}`}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "10px 15px 10px 15px",
            opacity: isDragging ? 0 : 1
          }}
        >
          <div
            style={getStyles(
              isDragging,
              isTransparent,
              valid && preview
                ? theme.widgets.classification.dragItemValidBgColor
                : preview && valid !== undefined
                ? theme.widgets.classification.dragItemNotValidBgColor
                : theme.widgets.classification.dragItemBgColor,
              valid && preview
                ? theme.widgets.classification.dragItemValidBorderColor
                : preview && valid !== undefined
                ? theme.widgets.classification.dragItemNotValidBorderColor
                : theme.widgets.classification.dragItemBorderColor,
              preview && valid !== undefined
                ? {
                    paddingRight: 15,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                  }
                : { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }
            )}
          >
            <FlexContainer
              alignItems="center"
              justifyContent="center"
              style={{
                width: "100%",
                fontWeight: theme.widgets.classification.dragItemFontWeight
              }}
            >
              {dragHandle && <i className="fa fa-arrows-alt" style={{ fontSize: 12 }} />}
              {preview && valid !== undefined && (
                <IndexBox preview={preview} valid={valid}>
                  {renderIndex + 1}
                </IndexBox>
              )}
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: item }} />
              {preview && valid !== undefined && (
                <div>
                  {valid && <IconCheck />}
                  {!valid && <IconClose />}
                </div>
              )}
            </FlexContainer>
          </div>
        </div>
      )
    : null;

export default withTheme(DragSource("item", specSource, collectSource)(DragItem));
