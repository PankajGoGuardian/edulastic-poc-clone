import React from 'react'
import PropTypes from 'prop-types'
import { shuffle } from 'lodash'
import { DragDrop, MathFormulaDisplay } from '@edulastic/common'
import {
  Container,
  Title,
  MarkContainer,
  DraggableOptionsContainer,
} from './styled'

const { DragItem } = DragDrop

const ResponseBox = ({
  values,
  fontSize,
  shuffleChoices,
  responseBoxWidth,
  isHorizontal,
  separationDistanceX,
  separationDistanceY,
}) => (
  <Container width={responseBoxWidth} isHorizontal={isHorizontal}>
    <Title fontSize={fontSize}>DRAG DROP VALUES</Title>
    <DraggableOptionsContainer
      isHorizontal={isHorizontal}
      distanceX={separationDistanceX}
      distanceY={separationDistanceY}
    >
      {(shuffleChoices ? shuffle(values) : values).map((value, i) => (
        <DragItem
          className="dragging-item"
          id={`response-item-${i}`}
          key={value.id}
          data={value}
        >
          <MarkContainer fontSize={fontSize}>
            <div className="index-box">{i + 1}</div>
            <MathFormulaDisplay
              className="drag-item-cotent"
              fontSize={fontSize ? `${fontSize}px` : ''}
              dangerouslySetInnerHTML={{ __html: value.text }}
            />
          </MarkContainer>
        </DragItem>
      ))}
    </DraggableOptionsContainer>
  </Container>
)

ResponseBox.propTypes = {
  responseBoxWidth: PropTypes.string.isRequired,
  isHorizontal: PropTypes.bool.isRequired,
  separationDistanceX: PropTypes.number.isRequired,
  values: PropTypes.array,
}

ResponseBox.defaultProps = {
  values: [],
}

export default ResponseBox
