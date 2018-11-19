import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { IconMoveArrows, IconPencilEdit, IconTrash } from '@edulastic/icons';
import { white, green } from '@edulastic/colors';
import { DragSource } from 'react-dnd';
import { withNamespaces } from '@edulastic/localization';

import QuestionWrapper from '../../../../../assessment/src/components/QuestionWrapper';
import { Types } from '../constants';
import { setItemDetailDraggingAction } from '../../../actions/itemDetail';

const getWidgetData = widget => (widget.referencePopulate ? widget.referencePopulate.data : widget);

const ItemDetailWidget = ({
  widget,
  onEdit,
  onDelete,
  isDragging,
  connectDragSource,
  connectDragPreview,
  t,
}) =>
  connectDragPreview &&
  connectDragSource &&
  connectDragPreview(
    <div>
      <Container isDragging={isDragging}>
        <div>
          {widget.widgetType === 'question' && (
            <QuestionWrapper
              testItem
              type={widget.type}
              view="preview"
              questionId={widget.reference}
              data={{ ...getWidgetData(widget), smallSize: true }}
            />
          )}
        </div>

        <Buttons>
          {connectDragSource(
            <div>
              <Button title={t('move')} move shape="circle">
                <IconMoveArrows color={white} style={{ fontSize: 11 }} />
              </Button>
            </div>,
          )}
          <Button title={t('edit')} onClick={onEdit} shape="circle">
            <IconPencilEdit color={white} />
          </Button>
          <Button title={t('delete')} onClick={onDelete} shape="circle">
            <IconTrash color={white} />
          </Button>
        </Buttons>
      </Container>
    </div>,
  );

ItemDetailWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  widgetIndex: PropTypes.number.isRequired,
};

const itemSource = {
  beginDrag({ setItemDetailDragging, widgetIndex, rowIndex }) {
    setTimeout(() => {
      setItemDetailDragging(true);
    }, 0);
    return {
      rowIndex,
      widgetIndex,
    };
  },
  endDrag({ setItemDetailDragging }) {
    setItemDetailDragging(false);
    return {};
  },
};

function collect(c, monitor) {
  return {
    connectDragSource: c.dragSource(),
    connectDragPreview: c.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const enhance = compose(
  withNamespaces('default'),
  connect(
    null,
    { setItemDetailDragging: setItemDetailDraggingAction },
  ),
  DragSource(Types.WIDGET, itemSource, collect),
);

export default enhance(ItemDetailWidget);

const Container = styled.div`
  display: flex;
  position: relative;
  padding: 40px 20px;
  min-height: 200px;
  flex-direction: column;
  opacity: ${({ isDragging }) => (isDragging ? '0.4' : '1')};
`;

const Buttons = styled.div`
  position: absolute;
  right: -40px;
  top: 40px;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ant-btn-circle {
    background: ${green}
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
    margin-bottom: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
