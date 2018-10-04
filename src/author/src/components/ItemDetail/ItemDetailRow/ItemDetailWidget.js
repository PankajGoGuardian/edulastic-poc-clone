import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconMoveArrows, IconPensilEdit, IconTrash } from '@edulastic/icons';
import { white, red, green } from '@edulastic/colors';
import QuestionWrapper from '../../../../../assessment/src/components/QuestionWrapper';

const ItemDetailWidget = ({ widget, onEdit, onDelete }) => (
  <Container>
    {widget.widgetType === 'question' && (
      <QuestionWrapper type={widget.type} view="preview" data={widget.referencePopulate.data} />
    )}
    {widget.widgetType === 'resource' && (
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, optio quod sunt libero
        magnam, dolores, consectetur recusandae necessitatibus repudiandae animi provident aperiam
        exercitationem ipsa distinctio consequatur cumque nobis itaque quia.
      </div>
    )}
    <Buttons>
      <Button title="Move">
        <IconMoveArrows color={white} hoverColor={green} />
      </Button>
      <Button title="Edit" onClick={onEdit}>
        <IconPensilEdit color={white} hoverColor={green} />
      </Button>
      <Button title="Delete" onClick={onDelete}>
        <IconTrash color={white} hoverColor={red} />
      </Button>
    </Buttons>
  </Container>
);

ItemDetailWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ItemDetailWidget;

const Container = styled.div`
  display: flex;
  position: relative;
  padding: 40px 20px;
  min-height: 200px;
  flex-direction: column;
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
