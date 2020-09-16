import React from "react";
import { DragSource } from "react-dnd";
import PropTypes from "prop-types";
import { compose } from "redux";
import styled, { withTheme } from "styled-components";
import { isMobileDevice } from "@edulastic/common";
import { CHECK, SHOW, CLEAR } from "../../../../constants/constantsForQuestions";
import { TextEmpty } from "./styled/TextEmpty";
import DragPreview from "../../../../components/DragPreview";
import { DragItemContent } from "./DragItemContent";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    const item = { item: props.obj, index: props.index };
    props.onClick({});
    return item;
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo, props.flag);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const DragItem = ({
  connectDragSource,
  obj,
  isDragging,
  onClick,
  active,
  smallSize,
  correct,
  previewTab,
  index,
  theme,
  disableResponse,
  isResetOffset,
  isReviewTab,
  stemNumeration,
  items,
  style,
  isPrintPreview
}) => {
  const showPreview = previewTab === CHECK || previewTab === SHOW;

  const clickHandler = () => {
    if (disableResponse) {
      return;
    }
    if (active) {
      onClick("");
    } else {
      onClick(obj);
    }
  };

  return (
    <div>
      {obj && isMobileDevice() && (
        <DragPreview isDragging={isDragging} isResetOffset={isResetOffset}>
          <DragItemContent
            active={active}
            correct={correct}
            obj={obj}
            isReviewTab={isReviewTab}
            showPreview={showPreview}
            smallSize={smallSize}
            index={index}
            stemNumeration={stemNumeration}
            isPrintPreview={isPrintPreview}
          />
        </DragPreview>
      )}
      {obj ? (
        connectDragSource(
          <div
            onClick={clickHandler}
            style={{
              opacity: isDragging ? 0 : 1,
              background: active
                ? theme.widgets.sortList.dragItemActiveBgColor
                : theme.widgets.sortList.dragItemBgColor,
              borderRadius: 4
            }}
          >
            <DragItemContent
              active={active}
              correct={correct}
              obj={obj}
              style={style}
              index={index}
              isReviewTab={isReviewTab}
              showPreview={showPreview}
              stemNumeration={stemNumeration}
              smallSize={smallSize}
              isPrintPreview={isPrintPreview}
            />
          </div>
        )
      ) : (
        <div>
          <TextEmpty smallSize={smallSize} style={style}>
            <HiddenContent dangerouslySetInnerHTML={{ __html: items[index] }} />
          </TextEmpty>
        </div>
      )}
    </div>
  );
};

const HiddenContent = styled.div`
  display: flex;
  align-items: stretch;
  visibility: hidden;
  width: 100%;
  margin-left: 42px;
  p {
    padding: 16px;
  }
`;

DragItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  obj: PropTypes.any,
  isDragging: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  correct: PropTypes.bool,
  previewTab: PropTypes.string,
  index: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  isResetOffset: PropTypes.bool,
  style: PropTypes.object,
  items: PropTypes.array
};

DragItem.defaultProps = {
  obj: null,
  correct: false,
  previewTab: CLEAR,
  isResetOffset: false,
  items: [],
  style: {}
};

const enhance = compose(
  DragSource("item", specSource, collectSource),
  withTheme
);

export default enhance(DragItem);
