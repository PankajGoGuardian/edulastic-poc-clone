import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { IPAD_PORTRAIT_WIDTH } from '../../constants/others'

const ProgressContainer = ({
  questions,
  current,
  desktop,
  isZoomed = true,
}) => {
  return (
    <Container desktop={desktop} isZoomed={isZoomed}>
      <CompletedItems data-cy="progressItem">
        {current} / {questions.length} Completed
      </CompletedItems>
      <QIndicationContainer>
        {questions.map((item, index) => (
          <Items key={index} fillColor={current > index} />
        ))}
      </QIndicationContainer>
    </Container>
  )
}

ProgressContainer.propTypes = {
  questions: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired,
}

export default ProgressContainer

const Container = styled.div`
  zoom: ${({ theme }) => theme?.widgets?.assessmentPlayers?.textZoom};
  display: flex;
  flex-direction: column;
  margin-left: auto;
  max-width: ${({ isZoomed }) => (isZoomed ? 300 : 425)}px;

  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 100%;
    margin-left: 0;
    max-width: initial;
    ${(props) => props.desktop === 'true' && 'display:none;'}
  }
`

const Items = styled.div`
  background: ${(props) =>
    props.fillColor
      ? props.theme.progressFill
      : props.theme.widgets.assessmentPlayers.progressTrailColor};
  height: 8px;
  margin-right: 5px;
  width: 50px;
  border-radius: 2px;
`

const CompletedItems = styled.div`
  color: ${(props) => props.theme.widgets.assessmentPlayers.headerBarTextColor};
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
`

const QIndicationContainer = styled.div`
  display: flex;
`
