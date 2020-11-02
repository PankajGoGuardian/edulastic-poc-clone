import React, { useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ScrollContainer, { setScrollWrapperId } from './ScrollContainer'

const VirtualList = ({
  overscan,
  itemGenerator,
  itemCount,
  scrollWrapperId,
}) => {
  if (scrollWrapperId) {
    setScrollWrapperId(scrollWrapperId)
  }
  const defaultItemHeight = 50
  const [totalListHeight, setTotalListHeight] = useState(
    itemCount * defaultItemHeight
  )

  return (
    <Virtuoso
      ScrollContainer={ScrollContainer}
      scrollWrapperId={scrollWrapperId}
      totalCount={itemCount}
      overscan={overscan}
      item={itemGenerator}
      style={{
        height: totalListHeight,
        minHeight: Math.max(totalListHeight, defaultItemHeight),
      }}
      totalListHeightChanged={(a) => {
        setTotalListHeight(a)
      }}
    />
  )
}

export default VirtualList
