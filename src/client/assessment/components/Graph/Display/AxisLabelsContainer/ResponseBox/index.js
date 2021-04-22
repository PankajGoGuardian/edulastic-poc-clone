import React from 'react'
import PropTypes from 'prop-types'
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
  responseBoxWidth,
  isHorizontal,
  separationDistanceX,
  separationDistanceY,
}) => (
  <Container width={responseBoxWidth} isHorizontal={isHorizontal}>
    <Title>DRAG DROP VALUES</Title>
    <DraggableOptionsContainer
      isHorizontal={isHorizontal}
      distanceX={separationDistanceX}
      distanceY={separationDistanceY}
    >
      {values.map((value, i) => (
        <DragItem
          className="dragging-item"
          id={`response-item-${i}`}
          key={value.id}
          data={value}
        >
          <MarkContainer>
            <div className="index-box">{i + 1}</div>
            <MathFormulaDisplay
              className="drag-item-cotent"
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
