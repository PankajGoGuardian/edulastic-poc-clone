import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { get, debounce } from 'lodash'
import { ActionCreators } from 'redux-undo'
import {
  WithResources,
  withWindowSizes,
  notification,
  helpers,
  toggleChatDisplay,
  EduIf,
  EduElse,
  EduThen,
} from '@edulastic/common'
import { white, themeColor } from '@edulastic/colors'
import styled from 'styled-components'
import { Modal, Button } from 'antd'

import {
  setTestDataAction,
  setCurrentAnnotationToolAction,
  updateAnnotationToolsPropertiesAction,
  undoAnnotationsAction,
  redoAnnotationsAction,
} from '../../../TestPage/ducks'

import Thumbnails from '../Thumbnails/Thumbnails'
import PDFPreview from '../PDFPreview/PDFPreview'
import Questions from '../Questions/Questions'
import {
  WorksheetWrapper,
  PDFAnnotationToolsWrapper,
  PDFViewerContainer,
} from './styled'

import { loadQuestionsAction } from '../../../sharedDucks/questions'

import { saveUserWorkAction } from '../../../../assessment/actions/userWork'
import { getTestEntitySelector } from '../../../AssignTest/duck'
import DropArea from '../../../AssessmentCreate/components/DropArea/DropArea'
import {
  getAssessmentCreatingSelector,
  percentageUploadedSelector,
  fileInfoSelector,
  createAssessmentRequestAction,
  setPercentUploadedAction,
  uploadToDriveAction,
} from '../../../AssessmentCreate/ducks'
import PDFAnnotationTools from '../PDFAnnotationTools'
import AppConfig from '../../../../../app-config'
import { isImagesBlockedByBrowser } from '../../../../common/utils/helpers'
import { toggleImageBlockNotificationAction } from '../../../../student/Login/ducks'
import VideoPreview from '../VideoPreview/VideoPreview'

const swap = (array, i, j) => {
  const copy = array.slice()
  ;[copy[i], copy[j]] = [copy[j], copy[i]]
  return copy
}

export const BLANK_URL =
  'https://cdn.edulastic.com/default/blank_doc-3425532845-1501676954359.pdf'

const defaultPage = {
  pageId: helpers.uuid(),
  URL: BLANK_URL,
  pageNo: 1,
  rotate: 0,
}

const createPage = (pageNumber, url) => ({
  ...defaultPage,
  URL: url || BLANK_URL,
  pageNo: pageNumber,
})

const StyledSubmitBtn = styled(Button)`
  background: ${themeColor};
  color: ${white};
  &:hover,
  &:active,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }
`

const StyledCancelBtn = styled(Button)`
  color: ${themeColor};
  border-color: ${themeColor};
`

class WorksheetComponent extends React.Component {
  constructor(props) {
    super(props)
    this.pdfRef = React.createRef()
    this.videoRef = React.createRef()
    this.state = {
      currentPage: 0,
      highlightedQuestion: undefined,
      history: 0,
      selected: 0,
      uploadModal: false,
      isAddPdf: false,
      deleteConfirmation: false,
      minimized: true,
      isToolBarVisible: true,
    }
  }

  cancelUpload

  componentDidMount() {
    const {
      userWork,
      saveUserWork,
      itemDetail,
      freeFormNotes,
      isImageBlockNotification,
      toggleImageBlockNotification,
    } = this.props
    toggleChatDisplay('hide')
    const fromFreeFormNotes = {}
    if (itemDetail?._id) {
      for (const key in freeFormNotes) {
        if (Object.prototype.hasOwnProperty.call(freeFormNotes, key)) {
          for (const figureType in freeFormNotes[key]) {
            if (
              Object.prototype.hasOwnProperty.call(
                freeFormNotes[key],
                figureType
              )
            ) {
              fromFreeFormNotes[figureType] =
                freeFormNotes[key][figureType].length
            }
          }
        }
      }
      const stdAnnotations = userWork?.freeNotesStd || []
      saveUserWork({
        [itemDetail._id]: {
          freeNotesStd: stdAnnotations,
          scratchpad: freeFormNotes || {},
        },
      })
    }
    isImagesBlockedByBrowser().then((flag) => {
      if (flag && !isImageBlockNotification) {
        toggleImageBlockNotification(true)
      }
    })
  }

  componentWillUnmount() {
    toggleChatDisplay('show')
  }

  handleHighlightQuestion = (questionId, pdfPreview = false) => {
    this.setState({ highlightedQuestion: questionId })
    const { currentPage } = this.state
    const { annotations } = this.props
    if (!pdfPreview) {
      const { page, y } =
        annotations.find((x) => x.questionId === questionId) || {}
      if (!page) return
      if (page - 1 !== currentPage) this.handleChangePage(page - 1)
      if (this?.pdfRef?.current) {
        const scrollableDOMNode = this.pdfRef?.current?._ps?.element
        const { top } = scrollableDOMNode.getBoundingClientRect() || {}
        if (y > top) {
          scrollableDOMNode.scrollTo({
            top: y - top || 0,
            behavior: 'smooth',
          })
        }
      }
    }
  }

  handleChangePage = (nextPage) => {
    const { pageStructure } = this.props
    if (nextPage >= 0 && nextPage < pageStructure.length) {
      this.setState({ currentPage: nextPage })
      const { onPageChange } = this.props
      if (onPageChange) {
        onPageChange(nextPage)
      }
    }
  }

  handleAddAnnotation = (question, type = 'pdf') => {
    const { annotations, setTestData } = this.props
    const annotation = {
      uuid: helpers.uuid(),
      type: 'point',
      class: 'Annotation',
      toolbarMode: 'question',
      ...question,
    }

    const newAnnotations = [...annotations]

    let annotationIndex = -1
    if (type === 'video') {
      // UI annotation get clubbed to if you find any UI annotation remove previous one and push new
      annotationIndex = newAnnotations.findIndex((item) => {
        if (item.questionId || question.questionId) {
          return `${item.questionId}` === `${question.questionId}`
        }
        return (
          Math.floor(question.time) === Math.floor(item.time) ||
          !item.x ||
          !item.y
        )
      })
    } else {
      annotationIndex = newAnnotations.findIndex(
        (item) => `${item.questionId}` === `${question.questionId}`
      )
    }

    if (annotationIndex > -1) {
      newAnnotations.splice(annotationIndex, 1)
    }

    if (
      (type === 'video' && annotation.x && annotation.y) ||
      type !== 'video'
    ) {
      newAnnotations.push(annotation)
    }

    const updatedAssessment = {
      annotations: newAnnotations,
    }

    setTestData(updatedAssessment)
  }

  // Add Blank Page
  handleAppendBlankPage = () => {
    const { pageStructure } = this.props

    const lastPageIndex = pageStructure.length

    this.addBlankPage(lastPageIndex)
  }

  handleInsertBlankPage = (index) => () => {
    this.addBlankPage(index)
  }

  addBlankPage = (index) => {
    const { pageStructure, setTestData, annotations = [] } = this.props

    if (index < 0 || index > pageStructure.length) return

    const pageNumber = index + 1
    const blankPage = createPage(pageNumber)

    const updatedPageStructure = [...pageStructure]
    const newAnnotations = annotations.map((annotation) => {
      const key = annotation.toolbarMode === 'question' ? `page` : `documentId`
      return {
        ...annotation,
        [key]:
          annotation[key] > pageNumber ? +annotation[key] + 1 : annotation[key],
      }
    })

    updatedPageStructure.splice(pageNumber, 0, blankPage)

    setTestData({
      annotations: newAnnotations,
      pageStructure: updatedPageStructure,
    })
    this.handleChangePage(pageNumber)
  }

  handleDeleteSelectedBlankPage = () => {
    const { currentPage } = this.state
    const { pageStructure, annotations = [] } = this.props
    if (
      (pageStructure[currentPage] &&
        pageStructure[currentPage].URL !== 'blank') ||
      annotations.some((annotation) => annotation.page === currentPage + 1)
    ) {
      this.setDeleteConfirmation(true, currentPage)
    } else {
      this.deleteBlankPage(currentPage)
    }
  }

  handleDeletePage = (pageNumber) => {
    this.deleteBlankPage(pageNumber)
  }

  deleteBlankPage = (pageNumber) => {
    const {
      pageStructure,
      setTestData,
      annotations,
      saveUserWork,
      itemDetail,
      userWork,
      freeFormNotes = {},
    } = this.props
    if (pageStructure.length < 2) return

    const updatedPageStructure = [...pageStructure]

    updatedPageStructure.splice(pageNumber, 1)

    const newFreeFormNotes = {}
    // TODO some one plis fix this shit.
    /* Scratchpad component requires an object in this({"1":value,"2":value,"3":value}) 
    format to perform rendering.
    As the freeFormNotes is not an array can not perform the shift or splice operations. 
    So found below way to shift items. */
    Object.keys(freeFormNotes).forEach((item) => {
      const parsedItem = parseInt(item, 10)
      // new note should not have the removed key so return here
      if (parsedItem === pageNumber) return
      // all items greater than the removed should shift backwards.
      if (parsedItem > pageNumber) {
        // eslint-disable-next-line no-return-assign
        return (newFreeFormNotes[parsedItem - 1] = freeFormNotes[item])
      }
      newFreeFormNotes[parsedItem] = freeFormNotes[item]
    })

    // NOTE: pageNumber uses 0 based indexing, while annotations.$.page uses 1 based indexing
    const updatedAnnotations = annotations
      // eslint-disable-next-line array-callback-return
      .map((x) => {
        const key = x.toolbarMode === 'question' ? 'page' : 'documentId'
        if (x[key] === pageNumber + 1) {
          return null
        }
        if (x[key] < pageNumber + 1) {
          return x
        }
        if (x[key] > pageNumber + 1) {
          return { ...x, [key]: x[key] - 1 }
        }
      })
      .filter((x) => x)

    const updatedAssessment = {
      pageStructure: updatedPageStructure.map((item) => {
        if (item.URL !== 'blank') return item

        return {
          ...item,
        }
      }),
      freeFormNotes: newFreeFormNotes,
      annotations: updatedAnnotations,
    }
    const id = itemDetail?._id
    if (id) {
      this.setState(({ history }) => ({ history: history + 1 }))
      saveUserWork({
        [id]: { ...userWork, scratchpad: newFreeFormNotes },
      })
    }
    this.handleChangePage(pageNumber > 0 ? pageNumber - 1 : pageNumber)
    setTestData(updatedAssessment)
  }

  handleMovePageUp = (pageIndex) => () => {
    if (pageIndex === 0) return

    const nextIndex = pageIndex - 1
    const {
      pageStructure,
      setTestData,
      annotations = [],
      freeFormNotes = {},
      itemDetail,
      userWork,
      saveUserWork,
    } = this.props

    const newFreeFormNotes = {
      ...freeFormNotes,
      [nextIndex]: freeFormNotes[pageIndex],
      [pageIndex]: freeFormNotes[nextIndex],
    }

    const newAnnotations = annotations.map((annotation) => {
      const key = annotation.toolbarMode === 'question' ? `page` : `documentId`
      const annIndex = +annotation[key]
      return {
        ...annotation,
        [key]:
          annIndex === pageIndex + 1
            ? nextIndex + 1
            : annIndex === nextIndex + 1
            ? pageIndex + 1
            : annIndex,
      }
    })
    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex)

    const id = itemDetail?._id
    if (id) {
      saveUserWork({
        [id]: { ...userWork, scratchpad: { ...newFreeFormNotes } },
      })
    }
    setTestData({
      freeFormNotes: newFreeFormNotes,
      annotations: newAnnotations,
      pageStructure: updatedPageStructure,
    })
    this.handleChangePage(nextIndex)
  }

  handleMovePageDown = (pageIndex) => () => {
    const {
      pageStructure,
      setTestData,
      annotations = [],
      freeFormNotes = {},
      itemDetail,
      saveUserWork,
      userWork,
    } = this.props
    if (pageIndex === pageStructure.length - 1) return

    const nextIndex = pageIndex + 1

    const newFreeFormNotes = {
      ...freeFormNotes,
      [nextIndex]: freeFormNotes[pageIndex],
      [pageIndex]: freeFormNotes[nextIndex],
    }
    const newAnnotations = annotations.map((annotation) => {
      const key = annotation.toolbarMode === 'question' ? `page` : `documentId`
      const annIndex = +annotation[key]
      return {
        ...annotation,
        [key]:
          annIndex === pageIndex + 1
            ? nextIndex + 1
            : annIndex === nextIndex + 1
            ? pageIndex + 1
            : annIndex,
      }
    })
    const updatedPageStructure = swap(pageStructure, pageIndex, nextIndex)

    const id = itemDetail?._id
    if (id) {
      saveUserWork({
        [id]: { ...userWork, scratchpad: { ...newFreeFormNotes } },
      })
    }
    setTestData({
      annotations: newAnnotations,
      freeFormNotes: newFreeFormNotes,
      pageStructure: updatedPageStructure,
    })
    this.handleChangePage(nextIndex)
  }

  handleRotate = (pageIndex) => (direction) => () => {
    const { pageStructure, setTestData } = this.props

    if (!pageStructure[pageIndex]) return

    const page = { ...pageStructure[pageIndex] }

    const angle = direction === 'clockwise' ? 90 : -90
    const rotate = get(page, 'rotate', 0) + angle

    page.rotate = Math.abs(rotate) === 360 ? 0 : rotate

    const updatedPageStructure = [...pageStructure]

    updatedPageStructure.splice(pageIndex, 1, page)

    setTestData({
      pageStructure: updatedPageStructure,
    })
  }

  handleReupload = () => {
    this.setState({ uploadModal: true })
  }

  handleAddPdf = () => {
    this.setState({ uploadModal: true, isAddPdf: true })
  }

  onDragStart = (questionId) => {
    this.handleHighlightQuestion(questionId, true)
  }

  setDeleteConfirmation = (deleteConfirmation, selected = 0) => {
    this.setState({ deleteConfirmation, selected })
  }

  handleUploadPDF = debounce(({ file }) => {
    const { isAddPdf = false } = this.state
    const {
      createAssessment,
      test: { _id: assessmentId },
    } = this.props
    if (file.type !== 'application/pdf') {
      return notification({ messageKey: 'fileFormatNotSupported' })
    }
    if (file.size / 1024000 > 15) {
      return notification({ messageKey: 'fileSizeExceeds' })
    }
    createAssessment({
      file,
      assessmentId,
      progressCallback: this.handleUploadProgress,
      isAddPdf,
      cancelUpload: this.setCancelFn,
      merge: true,
      avoidRedirect: true,
    })
  }, 1000)

  handleCreateBlankAssessment = (event) => {
    event.stopPropagation()
    this.handleAppendBlankPage()
    this.setState({ uploadModal: false })
  }

  setCancelFn = (_cancelFn) => {
    this.cancelUpload = _cancelFn
  }

  handleUploadProgress = (progressEvent) => {
    const { setPercentUploaded } = this.props
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setPercentUploaded(percentCompleted)
  }

  toggleMinimized = () => {
    this.setState((prevProps) => ({
      minimized: !prevProps.minimized,
      isToolBarVisible: true,
    }))
  }

  toggleToolBarVisiblity = () => {
    this.setState((prev) => ({ isToolBarVisible: !prev.isToolBarVisible }))
  }

  onSortEnd = ({ newIndex, oldIndex }) => {
    const {
      setQuestionsById,
      setTestData,
      annotations,
      questionsById,
      questions,
    } = this.props

    // Update the qIndex based on newIndex
    const newQuestionsById = produce(questionsById, (draft) => {
      const qids = questions
        .sort((a, b) => a?.qIndex - b?.qIndex)
        .map((obj) => obj?.id)
      const id = qids[oldIndex]
      qids.splice(qids.indexOf(id), 1)
      qids.splice(newIndex, 0, id)
      qids.forEach((idx, i) => {
        draft[idx].qIndex = i + 1
      })
    })

    setQuestionsById(newQuestionsById)

    const questionIdsMap = {}
    Object.values(newQuestionsById).forEach((q) => {
      questionIdsMap[q?.id] = q?.qIndex
    })

    // Update the corresponding annotations
    setTestData({
      annotations: produce(annotations, (draft) => {
        draft.forEach((a) => {
          a.qIndex = questionIdsMap[a.questionId]
        })
      }),
    })
  }

  handleClearAnnotations = () => {
    const { setTestData } = this.props
    setTestData({
      annotations: [],
    })
  }

  clearHighlighted = () => this.setState({ highlightedQuestion: null })

  render() {
    const {
      annotations,
      review,
      creating,
      viewMode,
      noCheck,
      questions,
      questionsById,
      percentageUploaded,
      fileInfo,
      pageStructure,
      windowWidth,
      test: { isDocBased, _id: assessmentId, videoUrl: entityLink },
      testMode = false,
      studentWorkAnswersById,
      studentWork,
      extraPaddingTop,
      onPageChange,
      uploadToDrive,
      currentAnnotationTool,
      setCurrentAnnotationTool,
      annotationToolsProperties,
      updateToolProperties,
      undoAnnotationsOperation,
      redoAnnotationsOperation,
      isAnnotationsStackEmpty = false,
      isEditable,
      currentPage: _currentPageInProps,
      groupId,
      itemDetail,
      testItemId,
      annotationsStack,
      undoUserWork,
      redoUserWork,
      stdAnnotations,
      videoUrl,
    } = this.props

    const finalvideoUrl = videoUrl || entityLink
    const {
      uploadModal,
      highlightedQuestion,
      deleteConfirmation,
      isAddPdf,
      selected,
      minimized,
      isToolBarVisible,
      currentPage: _currentPageInState,
    } = this.state

    const currentPage = onPageChange ? _currentPageInProps : _currentPageInState
    let { answersById } = this.props
    if (studentWorkAnswersById) {
      answersById = studentWorkAnswersById
    }

    const selectedPage = pageStructure[currentPage] || defaultPage
    // WIDTH WHEN MINIMIZED REDUCE width AND USE that space for PDF AREA
    const leftColumnWidth = minimized ? 0 : 180
    const rightColumnWidth = 300
    const pdfWidth = windowWidth - rightColumnWidth - leftColumnWidth

    const reportMode = viewMode && viewMode === 'report'
    const editMode = viewMode === 'edit'
    const showAnnotationTools = editMode || testMode

    const assesmentMetadata = {
      assessmentId,
      isAddPdf,
      merge: true,
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <EduIf condition={showAnnotationTools && !finalvideoUrl}>
          <PDFAnnotationToolsWrapper>
            <PDFAnnotationTools
              setCurrentTool={setCurrentAnnotationTool}
              currentTool={currentAnnotationTool}
              togglePdfThumbnails={this.toggleMinimized}
              minimized={minimized}
              annotationToolsProperties={annotationToolsProperties}
              updateToolProperties={updateToolProperties}
              isAnnotationsStackEmpty={isAnnotationsStackEmpty}
              isAnnotationsEmpty={annotationsStack?.length === 0}
              testMode={testMode}
              undoAnnotationsOperation={undoAnnotationsOperation}
              redoAnnotationsOperation={redoAnnotationsOperation}
              undoUserWork={undoUserWork}
              redoUserWork={redoUserWork}
            />
          </PDFAnnotationToolsWrapper>
        </EduIf>

        <WorksheetWrapper
          showTools={showAnnotationTools}
          reportMode={reportMode}
          testMode={testMode}
          extraPaddingTop={extraPaddingTop}
        >
          <EduIf condition={!finalvideoUrl}>
            <>
              <Modal
                visible={deleteConfirmation}
                title="Confirm Page Deletion"
                onCancel={() => this.setDeleteConfirmation(false)}
                footer={[
                  <StyledCancelBtn
                    onClick={() => this.setDeleteConfirmation(false)}
                    data-cy="no"
                  >
                    No
                  </StyledCancelBtn>,
                  <StyledSubmitBtn
                    key="back"
                    onClick={() => {
                      this.handleDeletePage(selected)
                      this.setDeleteConfirmation(false)
                    }}
                    data-cy="yes"
                  >
                    Yes
                  </StyledSubmitBtn>,
                ]}
              >
                Are you sure that you want to delete this page?
              </Modal>
              <Modal
                width={700}
                visible={uploadModal}
                onCancel={() =>
                  this.setState({
                    uploadModal: false,
                    isAddPdf: false,
                  })
                }
                footer={null}
              >
                <DropArea
                  loading={creating}
                  onUpload={this.handleUploadPDF}
                  onCreateBlank={this.handleCreateBlankAssessment}
                  percent={percentageUploaded}
                  fileInfo={fileInfo}
                  isAddPdf={isAddPdf}
                  cancelUpload={this.cancelUpload}
                  uploadToDrive={uploadToDrive}
                  assesmentMetadata={assesmentMetadata}
                />
              </Modal>
              <Thumbnails
                annotations={annotations}
                list={pageStructure}
                currentPage={currentPage}
                onReupload={this.handleReupload}
                onAddPdf={this.handleAddPdf}
                onPageChange={this.handleChangePage}
                onAddBlankPage={this.handleAppendBlankPage}
                onDeletePage={this.handleDeletePage}
                setDeleteConfirmation={this.setDeleteConfirmation}
                onDeleteSelectedBlankPage={this.handleDeleteSelectedBlankPage}
                onClearAnnotations={this.handleClearAnnotations}
                onMovePageUp={this.handleMovePageUp}
                onMovePageDown={this.handleMovePageDown}
                onInsertBlankPage={this.handleInsertBlankPage}
                onRotate={this.handleRotate}
                viewMode={viewMode}
                review={review}
                testMode={testMode}
                reportMode={reportMode}
                isToolBarVisible={isToolBarVisible}
                toggleToolBarVisiblity={this.toggleToolBarVisiblity}
                noCheck={noCheck}
                minimized={minimized}
                toggleMinimized={this.toggleMinimized}
              />
            </>
          </EduIf>

          <PDFViewerContainer width={pdfWidth}>
            <EduIf condition={finalvideoUrl}>
              <EduThen>
                <VideoPreview
                  onHighlightQuestion={this.handleHighlightQuestion}
                  currentAnnotationTool={currentAnnotationTool}
                  annotations={annotations}
                  stdAnnotations={stdAnnotations}
                  annotationsCount={annotationsStack?.length} // need to update annotations on redo and undo action
                  onDragStart={this.onDragStart}
                  onDropAnnotation={this.handleAddAnnotation}
                  questions={questions}
                  questionsById={questionsById}
                  answersById={answersById}
                  viewMode={viewMode}
                  isEditable={isEditable}
                  reportMode={reportMode}
                  testMode={testMode}
                  studentWork={studentWork}
                  highlighted={highlightedQuestion}
                  forwardedRef={this.videoRef}
                  review={review}
                  videoUrl={finalvideoUrl}
                  itemId={itemDetail?._id || testItemId}
                />
              </EduThen>
              <EduElse>
                <PDFPreview
                  page={selectedPage}
                  currentPage={currentPage + 1}
                  annotations={annotations}
                  stdAnnotations={stdAnnotations}
                  annotationsCount={annotationsStack?.length} // need to update annotations on redo and undo action
                  onDragStart={this.onDragStart}
                  toggleMinimized={this.toggleMinimized}
                  onDropAnnotation={this.handleAddAnnotation}
                  onHighlightQuestion={this.handleHighlightQuestion}
                  questions={questions}
                  questionsById={questionsById}
                  answersById={answersById}
                  viewMode={viewMode}
                  isEditable={isEditable}
                  reportMode={reportMode}
                  isToolBarVisible={isToolBarVisible}
                  pdfWidth={pdfWidth - 100}
                  minimized={minimized}
                  pageChange={this.handleChangePage}
                  testMode={testMode}
                  studentWork={studentWork}
                  highlighted={highlightedQuestion}
                  forwardedRef={this.pdfRef}
                  review={review}
                  currentAnnotationTool={currentAnnotationTool}
                  setCurrentAnnotationTool={setCurrentAnnotationTool}
                  annotationToolsProperties={annotationToolsProperties}
                  itemId={itemDetail?._id || testItemId}
                />
              </EduElse>
            </EduIf>
          </PDFViewerContainer>
          <Questions
            noCheck={noCheck}
            list={questions}
            review={review}
            viewMode={viewMode}
            questionsById={questionsById}
            answersById={answersById}
            highlighted={highlightedQuestion}
            onDragStart={this.onDragStart}
            onHighlightQuestion={this.handleHighlightQuestion}
            lockToContainerEdges
            lockOffset={['10%', '0%']}
            lockAxis="y"
            useDragHandle
            onSortEnd={this.onSortEnd}
            testMode={testMode}
            isDocBased={isDocBased}
            reportMode={reportMode}
            setCurrentAnnotationTool={setCurrentAnnotationTool}
            groupId={groupId}
            qId={0} // For doc based qid (question index) can always be 0
            clearHighlighted={this.clearHighlighted}
            itemId={itemDetail?._id}
            disableAutoHightlight={!!finalvideoUrl}
          />
        </WorksheetWrapper>
      </div>
    )
  }
}

WorksheetComponent.propTypes = {
  setTestData: PropTypes.func.isRequired,
  userWork: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  questionsById: PropTypes.object.isRequired,
  answersById: PropTypes.object,
  pageStructure: PropTypes.array,
  review: PropTypes.bool,
  noCheck: PropTypes.bool,
  annotations: PropTypes.array,
}

WorksheetComponent.defaultProps = {
  review: false,
  annotations: [],
  noCheck: false,
  pageStructure: [],
  answersById: {},
}

const withForwardedRef = (Component) => {
  const handle = (props, ref) => (
    <WithResources
      resources={[AppConfig.jqueryPath]}
      fallBack={<span />}
      onLoaded={() => null}
    >
      <Component {...props} forwardedRef={ref} />{' '}
    </WithResources>
  )

  const name = Component.displayName || Component.name
  handle.displayName = `withForwardedRef(${name})`

  return React.forwardRef(handle)
}

const Worksheet = withForwardedRef(WorksheetComponent)

export { Worksheet }

const annotationsStackSelector = (state, ownProps) => {
  const { testMode } = ownProps

  if (!testMode) {
    const pdfAnnotations = state.tests.entity?.annotations || []
    return pdfAnnotations.filter((a) => !a?.questionId)
  }

  return state?.userWork?.past || []
}

const isAnnotationsStackEmptySelector = (state, ownProps) => {
  const { testMode } = ownProps
  if (!testMode) {
    return state.tests.annotationsStack?.length === 0
  }
  return state?.userWork?.future?.length === 0
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  connect(
    (state, ownProps) => ({
      scratchPad: get(
        state,
        `userWork.present[${
          ownProps.isAssessmentPlayer
            ? ownProps.item?._id
            : state.itemDetail?.item?._id
        }].scratchpad`,
        null
      ),
      test: getTestEntitySelector(state),
      userWork: get(
        state,
        `userWork.present[${
          ownProps.isAssessmentPlayer
            ? ownProps.item?._id
            : state.itemDetail?.item?._id
        }]`,
        {}
      ),
      itemDetail: ownProps.isAssessmentPlayer
        ? ownProps.item
        : state.itemDetail.item,
      creating: getAssessmentCreatingSelector(state),
      percentageUploaded: percentageUploadedSelector(state),
      fileInfo: fileInfoSelector(state),
      answersById: state.answers,
      currentAnnotationTool: state.tests.currentAnnotationTool,
      annotationToolsProperties: state.tests.annotationToolsProperties,
      isAnnotationsStackEmpty: isAnnotationsStackEmptySelector(state, ownProps),
      annotationsStack: annotationsStackSelector(state, ownProps),
      isImageBlockNotification: state.user.isImageBlockNotification,
    }),
    {
      saveUserWork: saveUserWorkAction,
      createAssessment: createAssessmentRequestAction,
      setPercentUploaded: setPercentUploadedAction,
      undoUserWork: ActionCreators.undo,
      redoUserWork: ActionCreators.redo,
      setTestData: setTestDataAction,
      setQuestionsById: loadQuestionsAction,
      uploadToDrive: uploadToDriveAction,
      setCurrentAnnotationTool: setCurrentAnnotationToolAction,
      updateToolProperties: updateAnnotationToolsPropertiesAction,
      undoAnnotationsOperation: undoAnnotationsAction,
      redoAnnotationsOperation: redoAnnotationsAction,
      toggleImageBlockNotification: toggleImageBlockNotificationAction,
    }
  )
)

export default enhance(Worksheet)
