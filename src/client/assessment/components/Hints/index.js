import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import get from 'lodash/get'
import { connect } from 'react-redux'
import styled from 'styled-components'

import {
  EduButton,
  FlexContainer,
  QuestionLabelWrapper as LabelWrapper,
  QuestionSubLabel as SubLabel,
  MathFormulaDisplay,
} from '@edulastic/common'
import {
  mainTextColor,
  backgroundGrey,
  greyThemeLighter,
  title,
  themeColorBlue,
  themeColor,
} from '@edulastic/colors'

import { getFontSize } from '../../utils/helpers'
import { Label } from '../../styled/WidgetOptions/Label'
import {
  getRubricByIdRequestAction,
  getRubricDataLoadingSelector,
  getCurrentRubricDataSelector,
} from '../../../author/GradingRubric/ducks'
import PreviewRubricModal from '../../../author/GradingRubric/Components/common/PreviewRubricModal'

const InfoButtons = ({
  showHintHandler,
  toggleHints,
  isStudentReport,
  hintCount,
  isStudent,
  handleShowRubricClick,
  displayRubricInfoButton,
}) => {
  return (
    <FlexContainer justifyContent="flex-start" mt="20px">
      {!isStudentReport && hintCount > 0 && (
        <ShowHint
          height="30px"
          isGhost
          onClick={showHintHandler}
          isStudent={isStudent}
          tabIndex="-1"
          data-cy="hints-button"
        >
          {toggleHints ? 'Show' : 'Hide'} Hint
        </ShowHint>
      )}

      {displayRubricInfoButton && (
        <ShowRubricButton
          onClick={handleShowRubricClick}
          height="30px"
          data-cy="show-rubric-button"
          isGhost
        >
          SHOW RUBRIC
        </ShowRubricButton>
      )}
    </FlexContainer>
  )
}

// TODO: rename this file and use it as a miscellaneous component as it is not being used only for Hints
const Hints = ({
  question,
  showHints,
  enableMagnifier,
  isStudent,
  itemIndex,
  saveHintUsage,
  isLCBView,
  isExpressGrader,
  isStudentReport,
  displayRubricInfoButton,
  rubricDetails,
  getRubricById,
  rubricDataLoading,
  storeRubricData,
  showHintsToStudents,
  penaltyOnUsingHints,
  viewAsStudent,
}) => {
  if (showHintsToStudents === false) {
    return null
  }
  const { id, testItemId } = question
  const validHints = useMemo(() => {
    return (question?.hints || []).filter((hint) => hint?.label)
  }, [question])

  const currentRubricData = useMemo(() => {
    if (rubricDetails?.criteria) {
      return rubricDetails
    }
    if (rubricDetails?._id === storeRubricData?._id) {
      return storeRubricData
    }
    return {}
  }, [rubricDetails, storeRubricData])

  const hintCount = validHints.length
  const fontSize = getFontSize(
    get(question, 'uiStyle.fontSize') || get(question, 'uiStyle.fontsize')
  )
  const hintContRef = useRef()

  const [showCount, updateShowCount] = useState(0)
  const [toggleHints, setToggleHints] = useState(true)
  const [showRubricInfoModal, setShowRubricInfoModal] = useState(false)

  const showHintHandler = (e) => {
    e.stopPropagation()
    if (isLCBView || isExpressGrader) {
      updateShowCount(hintCount)
    } else {
      updateShowCount(1)
    }
    setToggleHints(!toggleHints)
  }

  const handleShowHints = (e) => {
    e.stopPropagation()
    if (
      (isStudent || viewAsStudent) &&
      penaltyOnUsingHints > 0 &&
      showCount === 0
    ) {
      Modal.confirm({
        title: 'Do you want to proceed?',
        content:
          'Are you sure that you want to use a hint? Using hint might reduce your score.',
        onOk: () => {
          showHintHandler(e)
          return Modal.destroyAll()
        },
        onCancel: () => Modal.destroyAll(),
        okText: 'Proceed',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor },
        },
      })
      return
    }
    return showHintHandler(e)
  }

  const showMoreHints = (e) => {
    e.stopPropagation()
    updateShowCount(showCount + 1)
  }

  /**
   * In 'view as student' view question data doesn't have complete rubric details,
   * thus call rubric api to fetch the rubric data and use the same
   * In student attempt complete rubric details are present in question data and use the same
   */
  const handleShowRubricClick = () => {
    if (
      rubricDetails?.criteria ||
      rubricDetails?._id === storeRubricData?._id
    ) {
      setShowRubricInfoModal(true)
    } else if (rubricDetails?._id && !rubricDetails?.criteria) {
      setShowRubricInfoModal(true)
      getRubricById(rubricDetails._id)
    }
  }

  useEffect(() => {
    if (itemIndex === 0 && showCount === 0 && showHints) {
      updateShowCount(1)
      if (hintContRef.current) {
        setTimeout(() => {
          hintContRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          })
        }, 500)
      }
    } else {
      updateShowCount(0)
    }
  }, [showHints, itemIndex])

  useEffect(() => {
    if (enableMagnifier) {
      setTimeout(() => {
        const dragElements = document.querySelectorAll(
          '.zoomed-container-wrapper .hint-container'
        )
        if (dragElements.length > 0) {
          document
            .querySelectorAll('.unzoom-container-wrapper .hint-container')
            .forEach((elm, i) => {
              dragElements[i].innerHTML = elm.innerHTML
            })
        }
      }, 500)
    }
    if (showCount) {
      const payload = {
        event: 'HintClicked',
        id,
        time: Date.now(),
      }
      const currentHintId = validHints?.[showCount - 1]?.value
      if (currentHintId) {
        Object.assign(payload, { hintId: currentHintId })
      }
      saveHintUsage(payload)
    }
  }, [showCount])

  useEffect(() => {
    updateShowCount(0)
    setToggleHints(true)
  }, [id, testItemId])

  if (
    question.type === 'passage' ||
    question.type === 'passageWithQuestions' ||
    question.type === 'video' ||
    question.type === 'resource' ||
    question.type === 'text'
  ) {
    return null
  }

  return (
    <>
      <InfoButtons
        showHintHandler={handleShowHints}
        toggleHints={toggleHints}
        isStudentReport={isStudentReport}
        hintCount={hintCount}
        isStudent={isStudent}
        handleShowRubricClick={handleShowRubricClick}
        displayRubricInfoButton={displayRubricInfoButton}
      />
      {!isStudentReport && hintCount > 0 && (
        <HintsContainer toggleHints={toggleHints}>
          <HintCont
            data-cy="hint-container"
            className="hint-container"
            ref={hintContRef}
          >
            {!!showCount && !toggleHints && (
              <>
                <QuestionLabel>Hint(s)</QuestionLabel>
                {validHints.map(
                  ({ value, label }, index) =>
                    index + 1 <= showCount && (
                      <HintItem data-cy="hint-subcontainer" key={value}>
                        <LabelWrapper>
                          <HintLabel>
                            <Label data-cy="hint-count" marginBottom="0px">
                              {`${index + 1}/${hintCount}`}
                            </Label>
                          </HintLabel>
                        </LabelWrapper>

                        <div style={{ width: '100%' }}>
                          {/* stretch to full width of the container, otherwise videos and other embeds wont have width */}
                          {/* https://snapwiz.atlassian.net/browse/EV-13446 */}
                          <HintContent>
                            <MathFormulaDisplay
                              fontSize={fontSize}
                              dangerouslySetInnerHTML={{ __html: label }}
                            />
                          </HintContent>
                          {index + 1 === showCount && showCount < hintCount && (
                            <ShowMoreHint
                              data-cy="more-hint"
                              onClick={showMoreHints}
                            >
                              + Get Another Hint {`${index + 1}/${hintCount}`}
                            </ShowMoreHint>
                          )}
                        </div>
                      </HintItem>
                    )
                )}
              </>
            )}
          </HintCont>
        </HintsContainer>
      )}

      {isStudentReport && hintCount > 0 && (
        <HintCont
          data-cy="hint-container"
          className="hint-container"
          ref={hintContRef}
          style={{ width: '63%' }}
        >
          <QuestionLabel isStudentReport={isStudentReport}>
            <span style={{ color: '#4aac8b' }}>{question.barLabel}</span> -
            Hint(s)
          </QuestionLabel>

          {validHints.map(({ value, label }, index) => (
            <HintItem
              isStudentReport={isStudentReport}
              data-cy="hint-subcontainer"
              key={value}
            >
              <HintLabel className="hint-label">
                <div>HINT</div>
                <span data-cy="hint-count">{`${index + 1}/${hintCount}`}</span>
              </HintLabel>
              <HintContent className="hint-content">
                <MathFormulaDisplay
                  fontSize={fontSize}
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              </HintContent>
            </HintItem>
          ))}
        </HintCont>
      )}

      {showRubricInfoModal && (
        <PreviewRubricModal
          visible={showRubricInfoModal}
          toggleModal={() => setShowRubricInfoModal(false)}
          currentRubricData={currentRubricData}
          shouldValidate={false}
          rubricDataLoading={rubricDataLoading}
          isDisabled
          hideTotalPoints
        />
      )}
    </>
  )
}

Hints.propTypes = {
  question: PropTypes.object,
  displayRubricInfoButton: PropTypes.bool,
  rubricDetails: PropTypes.object,
  getRubricById: PropTypes.func,
  rubricDataLoading: PropTypes.bool,
  storeRubricData: PropTypes.object,
}

Hints.defaultProps = {
  question: {
    hints: [],
  },
  displayRubricInfoButton: false,
  rubricDetails: {},
  getRubricById: () => {},
  rubricDataLoading: false,
  storeRubricData: {},
}

export default connect(
  (state) => ({
    showHints: state.test.showHints,
    rubricDataLoading: getRubricDataLoadingSelector(state),
    storeRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    getRubricById: getRubricByIdRequestAction,
  }
)(Hints)

const HintCont = styled.div`
  margin-top: 10px;
`

const HintItem = styled(FlexContainer)`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 8px;
  padding-left: ${(props) => (props.isStudentReport ? '0px' : '34px')};
  justify-content: flex-start;
  align-items: flex-start;

  .hint-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
    color: ${title};
    font-size: 11px;
    span {
      font-size: 12px;
      font-weight: bold;
    }
  }
  .hint-content {
    background: ${greyThemeLighter};
    width: calc(100% - 50px);
    padding: 10px;
    border: none;
    border-radius: 4px;
  }
`

const HintLabel = styled(SubLabel)`
  padding-left: 0px;
  & label {
    text-align: center;
  }
`

const HintContent = styled.div`
  width: 100%;
  padding: 8px 16px;
  border-left: 3px solid ${themeColorBlue};
  justify-content: flex-start;
`

const ShowHint = styled(EduButton)`
  margin-left: ${({ isStudent }) => `${isStudent ? 50 : 0}px`};
  position: relative;
  z-index: 998; /* header has z-index 999 */
`
const ShowRubricButton = styled(EduButton)`
  z-index: 998; /* header has z-index 999 */
`

const ShowMoreHint = styled.div`
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  color: ${themeColorBlue};
  font-size: 0.8em;
  padding: 8px 16px;
  position: relative;
  z-index: 998; /* header has z-index 999 */
`

const QuestionLabel = styled.div`
  color: ${mainTextColor};
  font-weight: 700;
  font-size: 16px;
  padding: ${(props) =>
    props.isStudentReport ? '1rem 0px' : '1.5rem 0 1rem 11px'};
  margin-bottom: 16px;
  border-bottom: 0.05rem solid ${backgroundGrey};
`
const HintsContainer = styled.div`
  min-width: ${(props) => (props.toggleHints ? 'auto' : '100%')};
`
