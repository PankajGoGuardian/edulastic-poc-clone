import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { TabContainer } from '@edulastic/common'
import { updatePosition as updatePositionAction } from '../../../../../author/src/reducers/feedback'

function TabWrapper({
  testReviewStyle,
  children,
  showBorder,
  updatePositionToStore,
  updatePosition,
  feedbackHeight,
  hideCorrectAnswer,
  uqaId,
}) {
  const containerRef = useRef(null)
  const [tabHeight, setTabHeight] = useState(null)
  const heightOfContainer = containerRef.current?.clientHeight

  /**
   * as of https://snapwiz.atlassian.net/browse/EV-12821
   *
   * we are showing stacked view in lcb
   * for multipart item, with level scoring off
   *
   * so different blocks will come at different positions, and we need to show feedback for respective questions
   * also, we don't show feedback for resources used in the item
   * so, we need a way to determine, from where we should start showing the feedback for the particular question
   *
   * storing the y coorindate of the question container and its height to the store
   * so that we can use it later in the code where we render feedback
   */

  useLayoutEffect(() => {
    if (containerRef.current && updatePositionToStore) {
      const top = containerRef.current.offsetTop
      const height = containerRef.current.clientHeight
      if (height < feedbackHeight && !tabHeight) {
        // use feedback height for question
        setTabHeight(feedbackHeight)
        updatePosition({ id: uqaId, dimensions: { top, height } })
      } else {
        updatePosition({ id: uqaId, dimensions: { top, height } })
      }
    }
  }, [
    containerRef.current,
    heightOfContainer,
    feedbackHeight,
    hideCorrectAnswer,
  ])

  const borderProps = showBorder
    ? { border: '1px solid #DADAE4', borderRadius: '10px' }
    : {}

  useEffect(() => {
    updatePosition({ id: uqaId, dimensions: null })
  }, [])

  return (
    <TabContainer
      ref={containerRef}
      padding="0px"
      style={{
        ...testReviewStyle,
        ...borderProps,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minHeight: tabHeight || '',
      }}
      className="question-tab-container"
    >
      {children}
    </TabContainer>
  )
}

const mapDispatchToProps = {
  updatePosition: updatePositionAction,
}

const enhance = connect(
  (state, ownProps) => ({
    feedbackHeight: get(state, ['feedback', 'feedbacks', ownProps.uqaId], null),
  }),
  mapDispatchToProps
)(TabWrapper)

export default enhance
