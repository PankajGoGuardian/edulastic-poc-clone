/* eslint-disable react/prop-types */
import React from 'react'
import DragScroll, {
  UPWARDS,
  DOWNWARDS,
  LEFTWARDS,
  RIGHTWARDS,
} from '@edulastic/common/src/components/DragScroll'

export const VerticalScrollContainer = ({ scrollWrraper }) => (
  <>
    <DragScroll
      context={{ getScrollElement: () => scrollWrraper || window }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        zIndex: 9999,
      }}
      direction={UPWARDS}
    />

    <DragScroll
      context={{ getScrollElement: () => scrollWrraper || window }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        zIndex: 9999,
      }}
      direction={DOWNWARDS}
    />
  </>
)

export const HorizontalScrollContainer = ({ scrollWrraper }) => (
  <>
    <DragScroll
      context={{ getScrollElement: () => scrollWrraper || window }}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        width: 100,
        zIndex: 9999,
      }}
      direction={RIGHTWARDS}
    />
    <DragScroll
      context={{ getScrollElement: () => scrollWrraper || window }}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        height: '100%',
        width: 100,
        zIndex: 9999,
      }}
      direction={LEFTWARDS}
    />
  </>
)

const DragScrollContainer = (props) => (
  <>
    <VerticalScrollContainer {...props} />
    <HorizontalScrollContainer {...props} />
  </>
)

export default DragScrollContainer
