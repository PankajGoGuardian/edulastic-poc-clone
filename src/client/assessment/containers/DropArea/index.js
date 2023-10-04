import React, { useState } from 'react'
import produce from 'immer'
import { get, findIndex } from 'lodash'
import PropTypes from 'prop-types'
import { DndContext } from '@dnd-kit/core'
import { helpers } from '@edulastic/common'
import { response as responseConst, clozeImage } from '@edulastic/constants'

import Draggable from './components/Draggable'
import Droppable from './components/Droppable'

const DropArea = ({
  updateData,
  item,
  showIndex = true,
  setQuestionData,
  disable,
  isDropDown,
  containerRef,
}) => {
  const [items, setItems] = useState(item.responses)
  const _dragStop = (index) => (e, d) => {
    updateData(
      produce(item.responses, (draft) => {
        draft[index].top = d.y < 0 ? 0 : d.y
        draft[index].left = d.x < 0 ? 0 : d.x
      })
    )
  }

  const _resize = (index) => (e, direction, ref) => {
    const { minHeight, minWidth } = responseConst
    let newWidth = parseInt(get(ref, 'style.width', 0), 10)
    let newHeight = parseInt(get(ref, 'style.height', 0), 10)

    newWidth = newWidth > minWidth ? newWidth : minWidth
    newHeight = newHeight > minHeight ? newHeight : minHeight

    updateData(
      produce(item.responses, (draft) => {
        draft[index].width = `${newWidth}px`
        draft[index].height = `${newHeight}px`
      })
    )
    setItems(
      produce(item.responses, (draft) => {
        draft[index].width = `${newWidth}px`
        draft[index].height = `${newHeight}px`
      })
    )
  }

  const _delete = (id) => (e) => {
    e.stopPropagation()
    const deletedIndex = findIndex(item.responses, (res) => res.id === id)

    if (deletedIndex !== -1) {
      setQuestionData(
        produce(item, (draft) => {
          draft.responses.splice(deletedIndex, 1)

          /**
           * correct answer will be an object for clozeImageText and clozeImageDropdown
           */
          if (draft.validation.validResponse?.value?.hasOwnProperty(id)) {
            delete draft.validation.validResponse.value[id]
          } else if (draft.validation.validResponse?.value?.length) {
            draft.validation.validResponse.value.splice(deletedIndex, 1)
          }

          draft.validation.altResponses = draft.validation.altResponses.map(
            (resp) => {
              if (resp?.value?.hasOwnProperty(id)) {
                delete resp.value[id]
              } else if (resp?.value?.length) {
                resp.value.splice(deletedIndex, 1)
              }
              return resp
            }
          )
          if (isDropDown && draft.options && draft.options.length) {
            draft.options.splice(deletedIndex, 1)
          }
        })
      )
    }
  }

  const _click = (index) => () => {
    updateData(
      produce(item.responses, (draft) => {
        draft.map((res, i) => {
          res.active = false
          if (i === index) {
            res.active = true
          }
          return res
        })
      })
    )
  }

  const getIndex = (index) => {
    const stemNumeration = get(item, 'uiStyle.stemNumeration')
    return helpers.getNumeration(index, stemNumeration)
  }

  const handleDragging = (d) => {
    const { x, y, node } = d

    if (!containerRef.current || !node) {
      return
    }

    const containerW = containerRef.current.offsetWidth
    const containerH = containerRef.current.offsetHeight

    const itemW = node.offsetWidth
    const itemH = node.offsetHeight

    const {
      imageWidth = 0,
      imageHeight = 0,
      imageOriginalWidth,
      imageOriginalHeight,
      imageOptions = { x: 0, y: 0 },
    } = item
    const { x: imageLeft, y: imageTop } = imageOptions
    const imageW = imageWidth
      ? imageWidth + imageLeft
      : imageOriginalWidth + imageLeft
    const imageH = imageHeight
      ? imageHeight + imageTop
      : imageOriginalHeight + imageTop

    const { maxHeight, maxWidth } = clozeImage

    const x_diff = containerW - x - itemW
    const y_diff = containerH - y - itemH

    if (x_diff < 0) {
      containerRef.current.style.width = `${itemW + x}px`
    } else if (maxWidth < containerW - x_diff) {
      if (containerW <= imageW) {
        containerRef.current.style.width = `${imageW}px`
      } else {
        containerRef.current.style.width = `${containerW - x_diff}px`
      }
    }

    if (y_diff < 0) {
      containerRef.current.style.height = `${y + itemH}px`
    } else if (maxHeight < containerH - y_diff) {
      if (containerH <= imageH) {
        containerRef.current.style.height = `${imageH}px`
      } else {
        containerRef.current.style.height = `${containerH - y_diff}px`
      }
    }
  }

  const handleDragEnd = (ev) => {
    const note = items.find((x) => x.id === ev.active.id)
    note.left += ev.delta.x
    note.top += ev.delta.y
    const _notes = items.map((x) => {
      if (x.id === note.id) return note
      return x
    })
    setItems(_notes)
  }
  const { uiStyle: uiStyles = {} } = item

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Droppable>
        {items.map((response, i) => {
          const responseHeight = response.height || uiStyles.heightpx || 'auto'
          const responseWidth = response.width || uiStyles.widthpx || 'auto'

          return (
            <Draggable
              response={response}
              responseHeight={responseHeight}
              responseWidth={responseWidth}
              key={i}
              index={getIndex(i)}
              background={item.background}
              showDashedBorder={get(
                item,
                'responseLayout.showdashedborder',
                false
              )}
              transparentBackground={get(
                item,
                'responseLayout.transparentbackground',
                false
              )}
              showBorder={get(item, 'responseLayout.showborder', false)}
              onDragStop={_dragStop(i)}
              onDrag={(evt, d) => handleDragging(d)}
              onResize={_resize(i)}
              onDelete={_delete(response.id)}
              onClick={_click(i)}
              showIndex={showIndex}
              style={{
                pointerEvents: disable ? 'none' : 'auto',
              }}
            />
          )
        })}
      </Droppable>
    </DndContext>
  )
}

DropArea.propTypes = {
  updateData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  disable: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  showIndex: PropTypes.bool,
  isDropDown: PropTypes.bool,
  containerRef: PropTypes.object,
}

DropArea.defaultProps = {
  showIndex: true,
  isDropDown: false,
  disable: false,
  containerRef: {},
}

export default DropArea
