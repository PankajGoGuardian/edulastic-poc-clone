import React from 'react'
import PropTypes from 'prop-types'
import DragScroll, {
  UPWARDS,
  DOWNWARDS,
} from '@edulastic/common/src/components/DragScroll'

import { createPortal } from 'react-dom'
import usePortal from './usePortal'

const Portal = ({ id, children }) => {
  const target = usePortal(id)
  return createPortal(children, target)
}

const DragScrollContainer = ({ scrollWrraper, height }) => (
  <Portal id="modal-root">
    <DragScroll
      context={{ getScrollElement: () => window }}
      scrollElement={scrollWrraper || window}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height,
      }}
      direction={UPWARDS}
    />
    <DragScroll
      context={{ getScrollElement: () => window }}
      scrollElement={scrollWrraper}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height,
      }}
      direction={DOWNWARDS}
    />
  </Portal>
)

DragScrollContainer.propTypes = {
  scrollWrraper: PropTypes.any,
  height: PropTypes.number,
}

DragScrollContainer.defaultProps = {
  scrollWrraper: window,
  height: undefined,
}

export default DragScrollContainer
