import React from 'react'
import PropTypes from 'prop-types'
import { EduIf, Stimulus } from '@edulastic/common'
import { CLEAR } from '../../../constants/constantsForQuestions'
import HighlightPopover from './HighlightPopover'
import { ColorPickerContainer, Overlay } from '../styled/ColorPickerContainer'
import ColorPicker from './ColorPicker'
import useTextHighlight from '../hooks/useTextHighlight'
import useColorPickerPopOver from '../hooks/useColorPickerPopOver'

export const PassageContent = ({
  disableResponse,
  highlightedContent,
  passageContent,
  previewTab,
  isStudentAttempt,
  itemId,
  onChangeContent,
}) => {
  const {
    closePopover,
    openPopover,
    isOpen,
    toggleOpen,
  } = useColorPickerPopOver()

  const {
    finishedRendering,
    handleClickBackdrop,
    updateColor,
    onSelectColor,
    handleMouseUp,
    mainContentsRef,
    content,
    selectHighlight,
  } = useTextHighlight({
    toggleOpen,
    passageContent,
    highlightedContent,
    onChangeContent,
    itemId,
    disableResponse,
  })

  return (
    <div className="mainContents" ref={mainContentsRef} data-cy="content">
      <Stimulus
        className="passage-content"
        onFinish={finishedRendering}
        dangerouslySetInnerHTML={{ __html: content }}
        userSelect={!disableResponse}
      />

      <EduIf condition={isStudentAttempt || previewTab === CLEAR}>
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
      </EduIf>

      <EduIf condition={selectHighlight && !disableResponse}>
        {() => (
          <>
            <ColorPickerContainer
              style={{ ...selectHighlight, position: 'absolute' }}
            >
              <ColorPicker selectColor={updateColor} bg={selectHighlight.bg} />
            </ColorPickerContainer>
            <Overlay onClick={handleClickBackdrop} />
          </>
        )}
      </EduIf>
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
