import React, { useState } from 'react'
import { IconClose } from '@edulastic/icons'
import {
  Mask,
  MaskTop,
  MaskLeft,
  MaskRight,
  MaskBottom,
  InnerMask,
  CloseButton,
  InnerMaskDragHandler,
} from './styled'

const GAP = 20
const DEFAULT_WIDTH = 600
const DEFAULT_LINE_HEIGHT = 32
const DEFAULT_LINE_MIN_WIDTH = 180

const Container = ({ destory }) => {
  const [settings, setSettings] = useState({
    outer: {
      x: 30,
      y: 80,
      width: DEFAULT_WIDTH,
      height: DEFAULT_LINE_HEIGHT * 4,
    },
    inner: {
      x: GAP,
      y: GAP,
      width: DEFAULT_WIDTH - GAP * 4,
      height: DEFAULT_LINE_HEIGHT,
    },
  })
  const { inner, outer } = settings

  const handleResizeOuter = (...args) => {
    const [, , ref] = args
    const innerWidth = ref.offsetWidth + inner.width - outer.width
    const cutoff = innerWidth <= DEFAULT_LINE_MIN_WIDTH

    setSettings({
      outer: {
        ...outer,
        height: ref.offsetHeight,
        width: ref.offsetWidth,
      },
      inner: { ...inner, width: cutoff ? DEFAULT_LINE_MIN_WIDTH : innerWidth },
    })
  }

  const handleDragStopOuter = (...args) => {
    const [, d] = args
    setSettings({
      ...settings,
      outer: {
        ...outer,
        x: d.x,
        y: d.y,
      },
    })
  }

  const handleResizeInner = (...args) => {
    const [, , ref] = args
    setSettings({
      ...settings,
      inner: { ...inner, height: ref.offsetHeight, width: ref.offsetWidth },
    })
  }

  const handleDragInner = (...args) => {
    const [, d] = args

    const overlapx = outer.width - inner.width - d.x - GAP <= 0 || d.x <= GAP
    const overlapy = outer.height - inner.height - d.y - GAP <= 0 || d.y <= GAP

    setSettings({
      ...settings,
      inner: {
        ...inner,
        x: overlapx ? inner.x : d.x,
        y: overlapy ? inner.y : d.y,
      },
    })
  }

  const handleKeyDown = (e) => {
    // console.log(e.target.classList, '<<<<',e.target.getBoundingClientRect)
    if (e.target.classList.contains('lineReader')) {
      let x = e.target.getBoundingClientRect().x
      let y = e.target.getBoundingClientRect().y

      switch (e.keyCode) {
        case 37:
          x -= 3
          break
        case 39:
          x += 3
          break
        case 38:
          y -= 3
          break
        case 40:
          y += 3
          break
        default:
      }

      if (x < 0) {
        x = 0
      }

      if (y < 0) {
        y = 0
      }

      setSettings({
        ...settings,
        outer: {
          ...outer,
          x,
          y,
        },
      })
    }

    if (e.target.classList.contains('lineReader-innerMask')) {
      console.log('here it goes')
    }
  }

  return (
    <Mask
      size={{ width: outer.width, height: outer.height }}
      position={{ x: outer.x, y: outer.y }}
      onResize={handleResizeOuter}
      onDragStop={handleDragStopOuter}
      resizeHandleClasses={{
        bottomRight: 'lineReader-resize-bottomRight',
      }}
      minHeight={inner.height + inner.y + GAP}
      minWidth={DEFAULT_LINE_MIN_WIDTH + GAP + inner.x}
      enableResizing={{ bottomRight: true }}
      dragHandleClassName="lineReader-dragHandler"
      onKeyDown={handleKeyDown}
      className="lineReader"
      tabIndex="0"
    >
      <CloseButton onClick={destory}>
        <IconClose width={10} height={10} />
      </CloseButton>

      <MaskTop height={inner.y} />
      <MaskLeft width={inner.x} />
      <MaskRight width={outer.width - inner.x - inner.width} />
      <MaskBottom height={outer.height - inner.y - inner.height} />

      <InnerMask
        bounds="parent"
        resizeHandleClasses={{
          bottomRight: 'innermask-resize-bottomright',
        }}
        tabIndex="0"
        maxHeight={outer.height - inner.y - GAP}
        maxWidth={outer.width - inner.x - GAP}
        minHeight={DEFAULT_LINE_HEIGHT}
        minWidth={DEFAULT_LINE_MIN_WIDTH}
        enableResizing={{ bottomRight: true }}
        dragHandleClassName="innermask-dragHandler"
        size={{ width: inner.width, height: inner.height }}
        position={{ x: inner.x, y: inner.y }}
        onDrag={handleDragInner}
        onResize={handleResizeInner}
        className="lineReader-innerMask"
      >
        <InnerMaskDragHandler className="innermask-dragHandler" tabIndex="0" />
      </InnerMask>
    </Mask>
  )
}

export default Container
