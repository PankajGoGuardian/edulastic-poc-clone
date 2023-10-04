import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'

import {
  FlexContainer,
  DragDrop,
  DragDropInnerContainer,
} from '@edulastic/common'

import { StyledResponseDiv } from '../../ClozeDragDrop/styled/ResponseBox'
import { DropContainerTitle } from '../../../components/DropContainerTitle'
import Responses from './Responses'

const { DropContainer } = DragDrop

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  transparentResponses,
  responseContainerPosition,
  getHeading,
  isPrintMode,
  shuffleOptions,
  ...choiceStyle
}) => {
  const horizontallyAligned =
    responseContainerPosition === 'left' ||
    responseContainerPosition === 'right'
  const containerStyle = {
    height: horizontallyAligned && '100%',
    padding: smallSize ? '5px 10px' : horizontallyAligned ? 10 : 16,
  }
  const fontSizeToApply = smallSize ? 10 : fontSize

  return (
    <DropContainer
      drop={onDrop}
      style={{ height: horizontallyAligned && '100%', border: 'none' }}
    >
      <StyledResponseDiv
        className="responses_box"
        data-cy="responses-box"
        style={containerStyle}
      >
        <FlexContainer flexDirection="column">
          <DropContainerTitle>
            {getHeading('component.cloze.dragDrop.optionContainerHeading')}
          </DropContainerTitle>
          <DragDropInnerContainer>
            <FlexContainer
              justifyContent="flex-start"
              flexDirection={horizontallyAligned ? 'column' : 'row'}
              flexWrap="wrap"
            >
              <Responses
                key="responses"
                responses={responses}
                dragHandler={dragHandler}
                shuffleOptions={shuffleOptions}
                transparentResponses={transparentResponses}
                fontSize={fontSizeToApply}
                {...choiceStyle}
              />
            </FlexContainer>
          </DragDropInnerContainer>
          <p>Note: Use CTRL+D to drag the option via keyboard</p>
        </FlexContainer>
      </StyledResponseDiv>
    </DropContainer>
  )
}

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  getHeading: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  transparentResponses: PropTypes.bool,
  responseContainerPosition: PropTypes.string,
  isPrintMode: PropTypes.bool,
  shuffleOptions: PropTypes.bool,
}

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: '13px',
  smallSize: false,
  dragHandler: false,
  transparentResponses: false,
  responseContainerPosition: 'bottom',
  isPrintMode: false,
  shuffleOptions: false,
}

export default React.memo(ResponseBoxLayout, (prevProps, nextProps) => {
  const responsesAreEqual =
    isEqual(prevProps.responses, nextProps.responses) &&
    isEqual(prevProps.transparentResponses, nextProps.transparentResponses)
  return responsesAreEqual
})
