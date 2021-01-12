import React, { useEffect, useState, useRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty, isEqual } from 'lodash'
import { withRouter } from 'react-router-dom'
import PlayerHeader from './PlayerHeader'
import ParentController from './utility/parentController'
import getUserResponse, {
  insertTestletMML,
  getExtDataForQuestion,
} from './utility/helpers'
import { MainContent, Main, OverlayDiv } from './styled'
import Magnifier from '../../../common/components/Magnifier'

let frameController = {}

const PlayerContent = ({
  openExitPopup,
  title,
  questions,
  setUserAnswer,
  onSubmitAnswer,
  saveTestletState,
  setTestUserWork,
  gotoSummary,
  testActivityId,
  testletState,
  testletConfig = {},
  LCBPreviewModal,
  previewPlayer,
  groupId,
  saveTestletLog,
  enableMagnifier,
  updateTestPlayer,
  submitTest,
  ...restProps
}) => {
  const frameRef = useRef()
  const frameRefForMagnifier = useRef()
  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now())
  const [currentPage, setCurrentQuestion] = useState(0)
  const [testletItems, setQuestions] = useState([])
  const [currentScoring, setCurrentScoring] = useState(false)
  const [unlockNext, setUnlockNext] = useState(false)
  const { hasSubmitButton } = testletConfig

  const handleScrollPage = (e) => {
    const page = frameRefForMagnifier.current?.contentWindow?.document?.body?.querySelector(
      '.pages'
    )
    if (page) {
      page.scrollTo(0, e.target.scrollTop)
    }
  }

  const handleScrollPanel = (e) => {
    const panel = frameRefForMagnifier.current?.contentWindow?.document?.body?.querySelector(
      '.winsight-panel'
    )
    if (panel) {
      panel.scrollTo(0, e.target.scrollTop)
    }
  }

  const applyStyleToElements = () => {
    const win = document.defaultView
    if (win.getComputedStyle) {
      // apply style from actual dom to magnified dom for specific class type
      const magnifiedElems = frameRefForMagnifier.current?.contentWindow?.document?.body?.querySelectorAll(
        '.pages .end'
      )
      frameRef.current?.contentWindow?.document?.body
        ?.querySelectorAll('.pages .end')
        .forEach((elm, i) => {
          magnifiedElems[i].style.display = win.getComputedStyle(elm).display
        })
    }
  }

  /*
    TODO: Refactor copyDom mutations to remove duplication from src/client/common/components/Magnifier.js
  */
  const copyDom = () => {
    setTimeout(() => {
      if (
        frameRefForMagnifier.current &&
        frameRefForMagnifier?.current?.contentWindow?.document?.body
      ) {
        frameRefForMagnifier.current.contentWindow.document.body.innerHTML =
          frameRef.current?.contentWindow?.document?.body?.innerHTML

        applyStyleToElements()
        handleScrollPage({
          target: frameRef.current?.contentWindow?.document?.body?.querySelector(
            '.pages'
          ),
        })
        handleScrollPanel({
          target: frameRef.current?.contentWindow?.document?.body?.querySelector(
            '.winsight-panel'
          ),
        })
      }
    }, 1000)
  }

  const attachDettachHandlerOnTab = (type = 'attach') => {
    const elems =
      frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
        '.tabbed .tab'
      ) || []
    elems.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })
    const pages = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.pages'
    )
    pages.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('scroll', handleScrollPage)
        : elm.removeEventListener('scroll', handleScrollPage)
    })

    // add scroll event to panel
    const panels = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.winsight-panel'
    )
    panels.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('scroll', handleScrollPanel)
        : elm.removeEventListener('scroll', handleScrollPanel)
    })

    const buttons = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.winsight-button'
    )
    buttons.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })
    const options = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.option'
    )
    options.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })

    // attach click events to accordions
    const accordions = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.accordion'
    )
    accordions.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })

    // attach click event to dropdowns
    const dropdowns = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.selectTrigger'
    )
    dropdowns.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })

    // attach click event to passage
    const passages = frameRef.current?.contentWindow?.document?.body?.querySelectorAll(
      '.passageSelection'
    )
    passages.forEach((elm) => {
      type === 'attach'
        ? elm.addEventListener('click', copyDom)
        : elm.removeEventListener('click', copyDom)
    })
  }

  const showMagnifier = () => {
    updateTestPlayer({ enableMagnifier: true })
    if (frameRefForMagnifier.current) {
      setTimeout(attachDettachHandlerOnTab, 1000)
      copyDom()
    }
  }

  const hideMagnifier = () => {
    updateTestPlayer({ enableMagnifier: false })
    attachDettachHandlerOnTab('dettach')
  }

  const handleMagnifier = () => {
    if (!enableMagnifier) {
      setTimeout(showMagnifier, 1000)
    } else {
      hideMagnifier()
    }
  }

  const rerenderMagnifier = () => {
    if (enableMagnifier) {
      showMagnifier()
    }
  }

  const getEduQuestions = (testletItemId) =>
    filter(questions, (_q) =>
      (_q.testletQuestionId || '').includes(testletItemId)
    )

  const saveUserResponse = () => {
    if (!LCBPreviewModal && !previewPlayer) {
      const { currentPageIds, response } = frameController

      const timeSpent = Date.now() - lastTime.current
      const extData = {}
      lastTime.current = Date.now()
      // initialize assessment start time
      window.localStorage.assessmentLastTime = lastTime.current

      for (const scoringId in currentPageIds) {
        if (Object.prototype.hasOwnProperty.call(currentPageIds, scoringId)) {
          const eduQuestions = getEduQuestions(scoringId.trim())
          if (isEmpty(eduQuestions)) {
            continue
          }

          eduQuestions.forEach((eduQuestion) => {
            if (eduQuestion) {
              extData[eduQuestion.id] = {
                [scoringId]: getExtDataForQuestion(
                  eduQuestion,
                  response[scoringId]
                ),
              }
              onSubmitAnswer(eduQuestion.id, timeSpent, groupId, { extData })
            }
          })
        }
      }
    }
  }

  const nextQuestion = () => {
    saveUserResponse()
    if (currentPage < testletItems.length) {
      frameController.sendNext()
    } else if (!LCBPreviewModal) {
      if (hasSubmitButton) {
        submitTest(groupId)
      } else {
        gotoSummary()
      }
    }
    if (enableMagnifier) {
      hideMagnifier()
    }
  }

  const prevQuestion = () => {
    saveUserResponse()
    frameController.sendPrevDev()
    if (enableMagnifier) {
      hideMagnifier()
    }
  }

  const handleReponse = () => {
    if (LCBPreviewModal) {
      return
    }
    const { currentPageIds, response } = frameController
    for (const scoringId in currentPageIds) {
      if (Object.prototype.hasOwnProperty.call(currentPageIds, scoringId)) {
        const eduQuestions = getEduQuestions(scoringId.trim())
        if (isEmpty(eduQuestions)) {
          continue
        }
        eduQuestions.forEach((eduQuestion) => {
          const data = getUserResponse(eduQuestion, response)
          if (!previewPlayer && !isEmpty(data)) {
            setUserAnswer(eduQuestion.id, data)
          }
        })
      }
    }
  }

  const handleTestletState = (itemState, itemResponse) => {
    if (!LCBPreviewModal) {
      if (enableMagnifier) {
        setTimeout(showMagnifier, 1000)
      }
      const newState = {
        testletState: { state: itemState, response: itemResponse },
      }
      if (!isEqual(newState, testletState) && !previewPlayer) {
        setTestUserWork({
          [testActivityId]: newState,
        })
      }
    }
  }

  const finishedLoadTestlet = () => {
    insertTestletMML(frameRef.current)
  }

  useEffect(() => {
    if (testletConfig.testletURL && frameRef.current) {
      const { state: initState = {} } = testletState

      frameController = new ParentController(
        testletConfig.testletId,
        initState,
        testletState.response
      )
      frameController.connect(frameRef.current.contentWindow)
      frameController.setCallback({
        setCurrentQuestion,
        setQuestions,
        setUnlockNext,
        setCurrentScoring,
        handleReponse,
        handleTestletState,
        handleLog: previewPlayer ? () => null : saveTestletLog,
        submitTest: nextQuestion,
        finishedLoad: finishedLoadTestlet,
      })
      if (enableMagnifier) {
        setTimeout(showMagnifier, 1000)
      }
      return () => {
        frameController.disconnect()
      }
    }
  }, [testletConfig])

  useEffect(() => {
    window.addEventListener('resize', rerenderMagnifier)
    return () => window.removeEventListener('resize', rerenderMagnifier)
  }, [])

  useEffect(() => {
    if (currentPage > 0) {
      if (!LCBPreviewModal && !previewPlayer) {
        saveTestletState()
      }
      window.localStorage.assessmentLastTime = Date.now()
      frameController.getCurrentPageScoreID()
    }
    if (enableMagnifier) {
      setTimeout(showMagnifier, 1000)
    }
  }, [currentPage])

  const content = ({ fromContent }) => (
    <>
      <PlayerHeader
        title={title}
        dropdownOptions={testletItems}
        currentPage={currentPage}
        onOpenExitPopup={openExitPopup}
        onNextQuestion={nextQuestion}
        unlockNext={unlockNext || LCBPreviewModal}
        onPrevQuestion={prevQuestion}
        previewPlayer={previewPlayer}
        enableMagnifier={enableMagnifier}
        {...restProps}
        hasSubmitButton={hasSubmitButton}
        handleMagnifier={handleMagnifier}
        groupId={groupId}
      />
      <Main skinB="true" LCBPreviewModal={LCBPreviewModal}>
        <MainContent id={`${testletConfig.testletId}_magnifier`}>
          {LCBPreviewModal && currentScoring && <OverlayDiv />}
          {testletConfig.testletURL && (
            <iframe
              ref={fromContent ? frameRef : frameRefForMagnifier}
              id={`${testletConfig.testletId}_magnifier`}
              src={testletConfig.testletURL}
              title="testlet player"
            />
          )}
        </MainContent>
      </Main>
    </>
  )

  return (
    <Magnifier
      enable={enableMagnifier}
      zoomedContent={content}
      type="testlet"
      offset={{
        top: 70,
        left: 0,
      }}
    >
      {content({ fromContent: true })}
    </Magnifier>
  )
}

PlayerContent.propTypes = {
  openExitPopup: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  questions: PropTypes.object.isRequired,
  submitTest: PropTypes.func.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  onSubmitAnswer: PropTypes.func.isRequired,
  saveTestletState: PropTypes.func.isRequired,
  setTestUserWork: PropTypes.func.isRequired,
  gotoSummary: PropTypes.func.isRequired,
  testActivityId: PropTypes.string.isRequired,
  testletState: PropTypes.object.isRequired,
  LCBPreviewModal: PropTypes.bool,
  previewPlayer: PropTypes.bool,
  location: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  changeTool: PropTypes.func.isRequired,
  saveTestletLog: PropTypes.func.isRequired,
}

PlayerContent.defaultProps = {
  LCBPreviewModal: false,
  previewPlayer: false,
}

export default withRouter(PlayerContent)
