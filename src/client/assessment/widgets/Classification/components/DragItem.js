/* eslint-disable react/require-default-props */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import styled, { withTheme } from "styled-components";

import { FlexContainer } from "@edulastic/common";
import DragPreview from "../../../components/SourceDragPreview";

import { IconBox } from "../styled/IconBox";
import { IconCheck } from "../styled/IconCheck";
import { IconClose } from "../styled/IconClose";
import { IndexBox } from "../styled/IndexBox";
import { AnswerBox } from "../styled/AnswerBox";
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
        {renderIndex}
      </IndexBox>
    )}
    <AnswerBox checked={preview && valid !== undefined} dangerouslySetInnerHTML={{ __html: item }} />
    {preview && valid !== undefined && (
      <IconBox checked={preview && valid !== undefined}>{valid ? <IconCheck /> : <IconClose />}</IconBox>
    )}
  </FlexContainer>
);

Item.propTypes = {
  valid: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  dragHandle: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  item: PropTypes.string.isRequired
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
  isResetOffset
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = evt => {
    setMousePosition({ x: evt.clientX, y: evt.clientY });
  };

  return (
    <MainWrapper onMouseMove={handleMouseMove}>
      <DragPreview sourceOffset={mousePosition} isDragging={isDragging} isResetOffset={isResetOffset}>
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
              margin: `5px`
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
                preview && valid !== undefined ? { padding: 0, border: 0 } : {}
              )}
            >
              {dragItem}
            </InnerWrapper>
          </div>
        )}
    </MainWrapper>
  );
};

DragItemContainer.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  item: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  isTransparent: PropTypes.bool,
  dragHandle: PropTypes.bool,
  valid: PropTypes.bool,
  isResetOffset: PropTypes.bool
};

DragItemContainer.defaultProps = {
  isResetOffset: false
};

const InnerWrapper = styled.div`
  min-width: 120px;
  width: auto;

  .katex .base {
    display: inline;
    white-space: normal;
  }
`;

const MainWrapper = styled.div`
  max-width: 100%;
`;

export default withTheme(DragSource("item", specSource, collectSource)(DragItemContainer));
