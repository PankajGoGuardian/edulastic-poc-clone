import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Stimulus,
  FlexContainer,
  FroalaEditor,
  MathFormulaDisplay,
  QuestionNumberLabel,
  AnswerContext,
  QuestionSubLabel,
  QuestionLabelWrapper,
  QuestionContentWrapper,
} from '@edulastic/common'
import { isEmpty } from 'lodash'
import { white, lightGrey12, greyThemeDark4 } from '@edulastic/colors'
import Instructions from '../../../components/Instructions'
import { QuestionStimulusWrapper } from '../styled/QuestionStimulus'
import { StyledPaperWrapper } from '../../../styled/Widget'
import FilesView from './FilesView'
import Uploader from './Uploader'

const UploadFilePreview = ({
  saveAnswer,
  item,
  smallSize,
  userAnswer,
  disableResponse,
  showQuestionNumber,
  saveAttachments,
  attachments,
}) => {
  const answerContextConfig = useContext(AnswerContext)
  const [localAttachments, setLocalAttachment] = useState([])
  const handleTextChange = (comment) => {
    saveAnswer(comment)
  }

  const uploadFinished = (files) => {
    if (saveAttachments) {
      saveAttachments([...(attachments || []), ...files])
    } else {
      setLocalAttachment([...(localAttachments || []), ...files])
    }
  }

  const deleteAttachment = (index) => {
    if (saveAttachments) {
      saveAttachments((attachments || []).filter((_, i) => i !== index))
    } else {
      setLocalAttachment((localAttachments || []).filter((_, i) => i !== index))
    }
  }

  // if answerContextConfig comes from LCB/EG pages
  const isReadOnly = !answerContextConfig.isAnswerModifiable || disableResponse
  const text = Array.isArray(userAnswer) ? '' : userAnswer || ''

  return (
    <StyledPaperWrapper padding={smallSize} boxShadow={smallSize ? 'none' : ''}>
      <FlexContainer justifyContent="flex-start" alignItems="baseline">
        <QuestionLabelWrapper>
          {showQuestionNumber && (
            <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
          )}
          {item.qSubLabel && (
            <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
          )}
        </QuestionLabelWrapper>
        <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
          <QuestionStimulusWrapper>
            <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
          </QuestionStimulusWrapper>

          <FilesView files={item.files} hideDelete cols={3} />

          {!isReadOnly && (
            <FroalaEditorContainer>
              <FroalaEditor
                heightMin={200}
                onChange={handleTextChange}
                value={text}
                spellcheck={!!item.spellcheck}
                toolbarInline={false}
                toolbarSticky={false}
                initOnClick={false}
                readOnly={isReadOnly}
                quickInsertTags={[]}
              />
            </FroalaEditorContainer>
          )}

          {isReadOnly && (
            <FlexContainer alignItems="flex-start" justifyContent="flex-start">
              <MathFormulaDisplay
                dangerouslySetInnerHTML={{
                  __html: text || '',
                }}
              />
            </FlexContainer>
          )}

          {!isReadOnly && (
            <Uploader onCompleted={uploadFinished} mt="26px" item={item} />
          )}

          {!isEmpty(localAttachments) && (
            <>
              <SubTitle>Attachments</SubTitle>
              <FilesView
                cols={3}
                mt="12px"
                hideDelete={isReadOnly}
                onDelete={deleteAttachment}
                files={localAttachments}
              />
            </>
          )}

          <Instructions item={item} />
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  )
}

UploadFilePreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any.isRequired,
  showQuestionNumber: PropTypes.bool,
}

UploadFilePreview.defaultProps = {
  smallSize: false,
  showQuestionNumber: false,
}

export default UploadFilePreview

const FroalaEditorContainer = styled.div`
  width: 100%;
  & * {
    user-select: text !important;
  }

  .fr-box.fr-basic {
    border-radius: 4px;
    border: 1px solid ${lightGrey12};
  }
  .fr-box.fr-basic .fr-element {
    font-size: ${(props) => props.theme.fontSize};
  }
  .fr-toolbar {
    border-radius: 4px 4px 0 0;
    background-color: ${white};
    border-bottom: 1px solid ${lightGrey12};
  }
  .second-toolbar {
    border-top: 1px solid ${lightGrey12};
    border-radius: 0 0 4px 4px;
  }

  .fr-box .fr-counter,
  .fr-box.fr-basic .fr-element {
    color: ${(props) => props.theme.widgets.essayRichText.toolbarColor};
  }

  .fr-box.fr-basic .fr-wrapper {
    background: ${(props) =>
      props.theme.widgets.essayRichText.textInputBgColor};
  }

  .fr-toolbar .fr-command.fr-btn svg path {
    fill: ${(props) => props.theme.widgets.essayRichText.toolbarColor};
  }
`

const SubTitle = styled.div`
  margin-top: 28px;
  font-size: 13px;
  font-weight: 600;
  color: ${greyThemeDark4};
`
