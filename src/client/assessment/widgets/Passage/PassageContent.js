/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import {
  clearSelection,
  decodeHTML,
  highlightSelectedText,
  Stimulus,
  rgbToHex,
  getRangeAtFirst,
} from '@edulastic/common'
import { CLEAR } from '../../constants/constantsForQuestions'
import HighlightPopover from './HighlightPopover'
import { ColorPickerContainer, Overlay } from './styled/ColorPicker'
import ColorPicker from './ColorPicker'

const highlightTag = 'my-highlight'
const tableTagName = 'TD'
const relative = 'relative'

const getPositionOfElement = (em) => {
  let deltaTop = 0
  let deltaLeft = 0
  if ($(em).parent().prop('tagName') === tableTagName) {
    $(em).css('position', relative)
  }

  $(em)
    .parents()
    .each((i, parent) => {
      if ($(parent).attr('id') === 'passage-wrapper') {
        return false
      }
      const p = $(parent).css('position')
      if (p === relative) {
        const offset = $(parent).position()
        deltaTop += offset.top
        deltaLeft += offset.left
      }
    })

  // top and left will be used to set position of color picker
  const top = em.offsetTop + deltaTop + em.offsetHeight - 70 // -70 is height of picker
  const left = $(em).width() / 2 + em.offsetLeft + deltaLeft - 106 // -106 is half of width of picker;

  const bg = rgbToHex($(em).css('backgroundColor'))
  return { top, left, bg }
}

export const PassageContent = ({
  disableResponse,
  highlightedContent,
  passageContent,
  previewTab,
  isStudentAttempt,
  itemId,
  onChangeContent,
}) => {
  const rangRef = useRef()
  const mainContentsRef = useRef()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, toggleOpen] = useState(false)
  const [selectHighlight, setSelectedHighlight] = useState(null)

  const content = useMemo(() => {
    if (previewTab !== CLEAR) {
      return passageContent
    }
    const decoded = decodeHTML(passageContent)
    if (isEmpty(highlightedContent)) {
      return decoded
        ?.replace(/(<div (.*?)>)/g, '')
        ?.replace(/(<\/div>)/g, '<br/>')
        ?.replace(/(<p>)/g, '')
        ?.replace(/(<p (.*?)>)/g, '')
        ?.replace(/(<\/p>)/g, '<br/>')
    }
    return highlightedContent
  }, [highlightedContent, previewTab, passageContent])

  const storeUpdatedContent = useCallback(() => {
    let { innerHTML: highlightContent = '' } = mainContentsRef.current

    if (
      highlightContent.search(new RegExp(`<${highlightTag}(.*?)>`, 'g')) === -1
    ) {
      highlightContent = null
    } else {
      highlightContent = highlightContent.replace(/input__math/g, '')
    }

    onChangeContent(highlightContent)
  }, [onChangeContent])

  const finishedRendering = useCallback(() => {
    // This was needed for iOS safari. need to render one more time.
    if (!isMounted) {
      setIsMounted(!isMounted)
    }
  }, [isMounted])

  const handleClickBackdrop = useCallback(() => {
    setSelectedHighlight(null)
  }, [])

  const updateColor = useCallback(
    (color) => {
      if (mainContentsRef.current && selectHighlight) {
        const element = $(mainContentsRef.current).find(
          `#${selectHighlight.id}`
        )
        if (color === 'remove') {
          element.replaceWith(element.html())
        } else {
          element.css('background-color', color)
        }
        clearSelection()
        setSelectedHighlight(null)
        storeUpdatedContent()
      }
    },
    [selectHighlight, storeUpdatedContent]
  )

  const onSelectColor = useCallback(
    (color) => {
      if (color !== 'remove') {
        highlightSelectedText(
          null, // parent container class, needed in token highlight type
          'text-highlight',
          highlightTag,
          {
            background: color,
          },
          rangRef.current
        )
        storeUpdatedContent()
      }
      clearSelection()
      toggleOpen(false)
    },
    [storeUpdatedContent]
  )

  const closePopover = useCallback(() => {
    toggleOpen(false)
  }, [])

  const openPopover = useCallback(() => {
    toggleOpen(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    rangRef.current = getRangeAtFirst()
  }, [])

  const addEventToSelectedText = useCallback(() => {
    if (window.$) {
      $(mainContentsRef.current)
        .find(highlightTag)
        .each(function (index) {
          const newId = `highlight-${itemId}-${index}`
          $(this).attr('id', newId)
          $(this)
            .off()
            .on('mousedown', function (e) {
              e.preventDefault()
              e.stopPropagation()
              const pos = getPositionOfElement(this)
              setSelectedHighlight({ ...pos, id: newId })
            })
        })
    }
  }, [itemId])

  useEffect(() => {
    if (!disableResponse && mainContentsRef.current) {
      setTimeout(addEventToSelectedText, 10)
    }
  }, [addEventToSelectedText, content])

  return (
    <div className="mainContents" ref={mainContentsRef} data-cy="content">
      <Stimulus
        className="passage-content"
        onFinish={finishedRendering}
        dangerouslySetInnerHTML={{ __html: content }}
        userSelect={!disableResponse}
      />

      {/* when the user is selecting text, 
      will show color picker within a Popover. */}
      {(isStudentAttempt || previewTab === CLEAR) && (
        <HighlightPopover
          getContainer={() => mainContentsRef.current}
          isOpen={isOpen && !selectHighlight && !disableResponse}
          onTextSelect={openPopover}
          onMouseUp={handleMouseUp}
          onTextUnselect={closePopover}
        >
          <ColorPickerContainer>
            <ColorPicker selectColor={onSelectColor} />
          </ColorPickerContainer>
        </HighlightPopover>
      )}
      {/* when the user clicks existing highlights, 
      will show colorPicker without Popover  */}
      {selectHighlight && !disableResponse && (
        <>
          <ColorPickerContainer
            style={{ ...selectHighlight, position: 'absolute' }}
          >
            <ColorPicker selectColor={updateColor} bg={selectHighlight.bg} />
          </ColorPickerContainer>
          <Overlay onClick={handleClickBackdrop} />
        </>
      )}
    </div>
  )
}

PassageContent.propTypes = {
  disableResponse: PropTypes.bool.isRequired,
  highlightedContent: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  isStudentAttempt: PropTypes.bool,
  passageContent: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  onChangeContent: PropTypes.func.isRequired,
}

PassageContent.defaultProps = {
  highlightedContent: '',
  previewTab: '',
  isStudentAttempt: false,
}
