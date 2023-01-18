/* eslint-disable func-names */
import { useCallback, useState, useRef, useMemo, useEffect } from 'react'
import { isEmpty } from 'lodash'
import {
  clearSelection,
  decodeHTML,
  highlightSelectedText,
  getRangeAtFirst,
} from '@edulastic/common'
import { CLEAR } from '../../../constants/constantsForQuestions'
import { highlightTag, getPositionOfElement } from '../utils/helper'

const useTextHighlight = ({
  toggleOpen,
  previewTab,
  passageContent,
  highlightedContent,
  onChangeContent,
  itemId,
  disableResponse,
}) => {
  const rangRef = useRef()
  const mainContentsRef = useRef()
  const [isMounted, setIsMounted] = useState(false)
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
    // DO NOT ADD DEPENDENCIES, should track highlight tag in every renders
  })

  return {
    finishedRendering,
    handleClickBackdrop,
    updateColor,
    onSelectColor,
    handleMouseUp,
    mainContentsRef,
    content,
    selectHighlight,
  }
}

export default useTextHighlight
