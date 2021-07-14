import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Virtuoso } from 'react-virtuoso'
import ScrollContainer from './ScrollContainer'

/* To be used there is need to render a huge list. This makes sure that we render only
 * the content which is in viewport with some upper and lower expansions set using overscan in px.
 */
const VirtualList = ({ overscan, itemGenerator, itemCount }) => {
  const defaultItemHeight = 50
  const [totalListHeight, setTotalListHeight] = useState(
    itemCount * defaultItemHeight
  )

  return (
    <Virtuoso
      ScrollContainer={ScrollContainer}
      totalCount={itemCount}
      overscan={overscan}
      item={itemGenerator}
      style={{
        height: totalListHeight,
        minHeight: Math.max(totalListHeight, defaultItemHeight),
      }}
      totalListHeightChanged={(newHeight) => setTotalListHeight(newHeight)}
    />
  )
}

VirtualList.propTypes = {
  itemGenerator: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  overscan: PropTypes.number,
}

VirtualList.defaultProps = {
  overscan: 0,
}
export default VirtualList
