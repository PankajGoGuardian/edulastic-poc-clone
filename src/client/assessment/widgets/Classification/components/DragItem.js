import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import styled, { withTheme } from "styled-components";

import { FlexContainer, MathFormulaDisplay } from "@edulastic/common";
import { IMAGE_LIST_DEFAULT_WIDTH } from "@edulastic/constants/const/imageConstants";
import { IMAGE_LIST_POSITION_LEFT, IMAGE_LIST_POSITION_RIGHT } from "@edulastic/constants/const/listPosition";
import DragPreview from "../../../components/DragPreview";

import { IconCheck } from "../styled/IconCheck";
import { IconClose } from "../styled/IconClose";
import { IndexBox } from "../styled/IndexBox";
import { getStyles } from "../utils";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    return { item: props.item };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo, props.from);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const Item = ({ valid, preview, theme, dragHandle, renderIndex, item }) => (
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
    {preview && valid !== undefined && <div>{valid ? <IconCheck /> : <IconClose />}</div>}
  </FlexContainer>
);

Item.propTypes = {
  valid: PropTypes.bool.isRequired,
  preview: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  dragHandle: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired
};

const DragItemContainer = ({
  connectDragSource,
  item,
  isDragging,
  valid,
  preview,
  renderIndex,
  theme,
  isTransparent,
  dragHandle,
  possibilityListPosition,
  isResetOffset = false,
  noPadding,
  ...restProps
}) => {
  const dragItem = (
    <Item
      isDragging={isDragging}
      isTransparent={isTransparent}
      valid={valid}
      preview={preview}
      theme={theme}
      dragHandle={dragHandle}
      renderIndex={renderIndex}
      item={item}
    />
  );

  const itemWidth =
    possibilityListPosition === IMAGE_LIST_POSITION_LEFT || possibilityListPosition === IMAGE_LIST_POSITION_RIGHT
      ? IMAGE_LIST_DEFAULT_WIDTH
      : null;

  return (
    <Fragment>
      <DragPreview {...restProps} isDragging={isDragging} isResetOffset={isResetOffset}>
        {dragItem}
      </DragPreview>
      {item &&
        connectDragSource(
          <div
            className="drag-item"
            data-cy={`drag-drop-item-${renderIndex}`}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 15px 10px 15px",
              width: itemWidth
            }}
          >
            <InnerWrapper
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
                      padding: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0
                    }
                  : { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }
              )}
            >
              {dragItem}
            </InnerWrapper>
          </div>
        )}
    </Fragment>
  );
};

const InnerWrapper = styled.div`
  p {
    width: 151px;
  }
`;

export default withTheme(DragSource("item", specSource, collectSource)(DragItemContainer));
