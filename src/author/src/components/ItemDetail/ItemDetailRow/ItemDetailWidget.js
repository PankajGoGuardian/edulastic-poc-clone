import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { IconMoveArrows, IconPensilEdit, IconTrash } from '@edulastic/icons';
import { white, red, green } from '@edulastic/colors';
import { DragSource } from 'react-dnd';
import { withNamespaces } from '@edulastic/localization';

import QuestionWrapper from '../../../../../assessment/src/components/QuestionWrapper';
import { Types } from '../constants';
import { setItemDetailDraggingAction } from '../../../actions/itemDetail';

const ItemDetailWidget = ({
  widget,
  onEdit,
  onDelete,
  isDragging,
  connectDragSource,
  connectDragPreview,
  setItemDetailDragging,
  t,
}) => {
  setItemDetailDragging(isDragging);
  return (
    connectDragPreview &&
    connectDragSource &&
    connectDragPreview(
      <div>
        <Container isDragging={isDragging}>
          {widget.widgetType === 'question' && (
            <QuestionWrapper
              type={widget.type}
              view="preview"
              data={widget.referencePopulate.data}
            />
          )}
          {widget.widgetType === 'resource' && (
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, optio quod sunt
              libero magnam, dolores, consectetur recusandae necessitatibus repudiandae animi
              provident aperiam exercitationem ipsa distinctio consequatur cumque nobis itaque quia.
            </div>
          )}
          <Buttons>
            {connectDragSource(
              <div>
                <Button title={t('move')}>
                  <IconMoveArrows color={white} hoverColor={green} />
                </Button>
              </div>,
            )}
            <Button title={t('edit')} onClick={onEdit}>
              <IconPensilEdit color={white} hoverColor={green} />
            </Button>
            <Button title={t('delete')} onClick={onDelete}>
              <IconTrash color={white} hoverColor={red} />
            </Button>
          </Buttons>
        </Container>
      </div>,
    )
  );
};

ItemDetailWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  setItemDetailDragging: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const itemSource = {
  beginDrag() {
    return {};
  },
  endDrag() {
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
  right: -60px;
  top: 40px;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  cursor: pointer;
  margin-bottom: 20px;
`;
