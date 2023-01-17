/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

import React, { useState, useEffect, useRef } from 'react'
import { isEmpty, get, set } from 'lodash'
import PropTypes from 'prop-types'
import { Pagination } from 'antd'
import {
  Stimulus,
  WithResources,
  decodeHTML,
  rgbToHexc,
  clearSelection,
  getRangeAtFirst,
  highlightSelectedText,
} from '@edulastic/common'

import { InstructorStimulus } from './styled/InstructorStimulus'
import { Heading } from './styled/Heading'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import ColorPicker from './ColorPicker'
import { ColorPickerContainer, Overlay } from './styled/ColorPicker'
import { PassageTitleWrapper } from './styled/PassageTitleWrapper'
import AppConfig from '../../../../app-config'
import { CLEAR } from '../../constants/constantsForQuestions'

import HighlightPopover from './HighlightPopover'
import { PassageTitle } from '../../../author/ItemList/components/Item/styled'

const ContentsTitle = Heading
const highlightTag = 'my-highlight'

const getPostionOfEelement = (em) => {
  let deltaTop = 0
  let deltaLeft = 0
  if ($(em).parent().prop('tagName') === 'TD') {
    $(em).css('position', 'relative')
  }

  $(em)
    .parents()
    .each((i, parent) => {
      if ($(parent).attr('id') === 'passage-wrapper') {
        return false
      }
      const p = $(parent).css('position')
      if (p === 'relative') {
        const offest = $(parent).position()
        deltaTop += offest.top
        deltaLeft += offest.left
      }
    })

  // top and left will be used to set position of color picker
  const top = em.offsetTop + deltaTop + em.offsetHeight - 70 // -70 is height of picker
  const left = $(em).width() / 2 + em.offsetLeft + deltaLeft - 106 // -106 is half of width of picker;

  const bg = rgbToHexc($(em).css('backgroundColor'))
  return { top, left, bg }
}

const PassageView = ({
  item,
  flowLayout,
  setHighlights,
  highlights,
  disableResponse,
  userWork,
  saveUserWork,
  clearUserWork,
  previewTab,
  widgetIndex,
  viewComponent,
  page,
  setPage,
  authLanguage,
  isStudentAttempt,
}) => {
  const mainContentsRef = useRef()
  const rangRef = useRef()
  const [isOpen, toggleOpen] = useState(false)
  const [selectHighlight, setSelectedHighlight] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  const isAuthorPreviewMode =
    viewComponent === 'editQuestion' ||
    viewComponent === 'authorPreviewPopup' ||
    viewComponent === 'ItemDetail'

  const passageTitle = item?.source ? (
    <>
      <PassageTitle dangerouslySetInnerHTML={{ __html: item.contentsTitle }} />{' '}
      by <PassageTitle dangerouslySetInnerHTML={{ __html: item.source }} />
    </>
  ) : (
    <PassageTitle dangerouslySetInnerHTML={{ __html: item.contentsTitle }} />
  )

  const _highlights = isAuthorPreviewMode
    ? get(userWork, `resourceId[${widgetIndex || 0}][${authLanguage}]`, '')
    : get(highlights, `[${widgetIndex}]`, '')

  const saveHistory = () => {
    let { innerHTML: highlightContent = '' } = mainContentsRef.current

    if (
      highlightContent.search(new RegExp(`<${highlightTag}(.*?)>`, 'g')) === -1
    ) {
      highlightContent = null
    } else {
      highlightContent = highlightContent.replace(/input__math/g, '')
    }

    if (setHighlights) {
      const newHighlights = highlights || {}
      // this is available only at student side
      setHighlights({ ...newHighlights, [widgetIndex]: highlightContent })
    } else {
      // saving the highlights at author side
      // setHighlights is not available at author side
      const newUserWork = set(
        userWork || {},
        `resourceId[${widgetIndex || 0}][${authLanguage}]`,
        highlightContent
      )

      saveUserWork({
        [item.id]: newUserWork,
      })
    }
  }

  const addEventToSelectedText = () => {
    if (!disableResponse && window.$ && mainContentsRef.current) {
      $(mainContentsRef.current)
        .find(highlightTag)
        .each(function (index) {
          const newId = `highlight-${item.id}-${index}`
          $(this).attr('id', newId)
          $(this)
            .off()
            .on('mousedown', function (e) {
              e.preventDefault()
              e.stopPropagation()
              const pos = getPostionOfEelement(this)
              setSelectedHighlight({ ...pos, id: newId })
            })
        })
    }
  }

  const getContent = () => {
    let { content } = item
    content = decodeHTML(content)
    // _highlights are user work
    if (isEmpty(_highlights)) {
      return content
        ?.replace(/(<div (.*?)>)/g, '')
        ?.replace(/(<\/div>)/g, '<br/>')
        ?.replace(/(<p>)/g, '')
        ?.replace(/(<\/p>)/g, '<br/>')
    }
    return _highlights
  }

  const loadInit = () => {
    // need to wait for rendering content.
    setTimeout(addEventToSelectedText, 10)
  }

  const closePopover = () => {
    toggleOpen(false)
  }

  const openPopover = () => {
    toggleOpen(true)
  }

  const handleMouseUp = () => {
    rangRef.current = getRangeAtFirst()
  }

  const handleClickBackdrop = () => setSelectedHighlight(null)

  const onSelectColor = (color) => {
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
      saveHistory()
    }
    clearSelection()
    toggleOpen(false)
  }

  const updateColor = (color) => {
    if (mainContentsRef.current && selectHighlight) {
      const element = $(mainContentsRef.current).find(`#${selectHighlight.id}`)
      if (color === 'remove') {
        element.replaceWith(element.html())
      } else {
        element.css('background-color', color)
      }
      clearSelection()
      setSelectedHighlight(null)
      saveHistory()
    }
  }

  const finishedRendering = () => {
    if (!isMounted) {
      setIsMounted(!isMounted)
    }
  }

  useEffect(() => {
    if (!setHighlights && previewTab === CLEAR) {
      clearUserWork() // clearing the userWork at author side.
    }
  }, [previewTab]) // run everytime the previewTab is changed

  const content = getContent()

  useEffect(loadInit, [content])

  return (
    <WithResources
      resources={[AppConfig.jqueryPath]}
      fallBack={<div />}
      onLoaded={loadInit}
    >
      {item.instructorStimulus && !flowLayout && (
        <InstructorStimulus
          dangerouslySetInnerHTML={{ __html: item.instructorStimulus }}
        />
      )}
      {!flowLayout && (
        <QuestionTitleWrapper data-cy="heading">
          {item.heading && (
            <Heading dangerouslySetInnerHTML={{ __html: item.heading }} />
          )}
        </QuestionTitleWrapper>
      )}
      {item.contentsTitle &&
        !flowLayout &&
        (item?.type !== 'passage' ? (
          <ContentsTitle
            dangerouslySetInnerHTML={{ __html: item.contentsTitle }}
          />
        ) : (
          <PassageTitleWrapper>{passageTitle}</PassageTitleWrapper>
        ))}
      {!item.paginated_content && item.content && (
        <div
          id={item.id}
          className="mainContents"
          ref={mainContentsRef}
          data-cy="content"
        >
          <Stimulus
            className="passage-content"
            onFinish={finishedRendering}
            dangerouslySetInnerHTML={{ __html: content }}
            userSelect={!disableResponse}
          />
        </div>
      )}

      {item.paginated_content &&
        item.pages &&
        !!item.pages.length &&
        !flowLayout && (
          <div data-cy="content">
            <div ref={mainContentsRef}>
              <Stimulus
                id="paginatedContents"
                dangerouslySetInnerHTML={{ __html: item.pages[page - 1] }}
              />
            </div>

            <Pagination
              style={{ justifyContent: 'center' }}
              pageSize={1}
              hideOnSinglePage
              onChange={(pageNum) => setPage(pageNum)}
              current={page}
              total={item.pages.length}
            />
          </div>
        )}
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
      {/* when the user clicks exsiting highlights, 
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
    </WithResources>
  )
}

PassageView.propTypes = {
  setHighlights: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  clearUserWork: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  highlights: PropTypes.array.isRequired,
  userWork: PropTypes.object.isRequired,
  flowLayout: PropTypes.bool,
}

PassageView.defaultProps = {
  flowLayout: false,
}

PassageView.modules = {
  toolbar: {
    container: '#myToolbar',
  },
}

PassageView.formats = ['background']

export default PassageView
