import React, { useState, useEffect, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { isEqual, get } from 'lodash'
import produce from 'immer'
import { connect } from 'react-redux'

import {
  FlexContainer,
  Stimulus,
  QuestionNumberLabel,
  AnswerContext,
  QuestionSubLabel,
  QuestionContentWrapper,
  QuestionLabelWrapper,
  HorizontalScrollContext,
  DragDrop,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ChoiceDimensions } from '@edulastic/constants'

import { compose } from 'redux'
import { withTheme } from 'styled-components'
import { CHECK, SHOW, CLEAR, EDIT } from '../../constants/constantsForQuestions'
import Instructions from '../../components/Instructions'
// import DropContainer from "../../components/DropContainer";

import ShowCorrect from './components/ShowCorrect'
import DragItem from './components/DragItem'
import { FullWidthContainer } from './styled/FullWidthContainer'
import { Title } from './styled/Title'
import { FlexWithMargins } from './styled/FlexWithMargins'
import { IconLeft } from './styled/IconLeft'
import { IconRight } from './styled/IconRight'
import { FlexCol } from './styled/FlexCol'
import { IconUp } from './styled/IconUp'
import { IconDown } from './styled/IconDown'
import { getFontSize } from '../../utils/helpers'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import { StyledPaperWrapper } from '../../styled/Widget'
import { Container } from './styled/Container'
import { checkAnswerInProgressSelector } from '../../selectors/test'

const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
  minHeight: choiceDefaultMinH,
  maxHeight: choiceDefaultMaxH,
} = ChoiceDimensions

const SortListPreview = ({
  previewTab: _previewTab,
  t,
  smallSize,
  item,
  view,
  userAnswer,
  saveAnswer,
  showQuestionNumber,
  disableResponse,
  changePreviewTab,
  isReviewTab,
  isPrintPreview,
  hideCorrectAnswer,
  evaluation,
  checkAnswerInProgress,
  showAnswerScore,
  hideEvaluation = false,
}) => {
  const previewRef = useRef()
  const answerContextConfig = useContext(AnswerContext)
  const { expressGrader, isAnswerModifiable } = answerContextConfig
  let previewTab = _previewTab
  if (expressGrader && !isAnswerModifiable) {
    /**
     * ideally wanted to be in CHECK mode.
     * But this component seems to be
     * written to work with only SHOW & CLEAR
     */
    previewTab = SHOW
  } else if (expressGrader && isAnswerModifiable) {
    previewTab = CLEAR
  }

  const { source = [], stimulus } = item

  const getItemsFromUserAnswer = () =>
    source.map((sourceItem, i) => {
      if (disableResponse || !userAnswer.includes(i)) {
        return sourceItem
      }
      return null
    })

  const getSelectedFromUserAnswer = () =>
    userAnswer && userAnswer.length > 0
      ? userAnswer.map((index) => (index !== null ? source[index] : null))
      : Array.from({ length: source.length }).fill(null)

  const [items, setItems] = useState(getItemsFromUserAnswer())
  const [selected, setSelected] = useState(getSelectedFromUserAnswer())

  const [active, setActive] = useState('')

  useEffect(() => {
    setItems(getItemsFromUserAnswer())
    setSelected(getSelectedFromUserAnswer())
    setActive('')
  }, [source, userAnswer])

  const setActiveItem = (activeItem) => {
    if (previewTab === CLEAR) {
      setActive(typeof activeItem === 'string' ? activeItem : '')
    } else {
      changePreviewTab(CLEAR)
      setActive(typeof activeItem === 'string' ? activeItem : '')
    }
  }

  const onRightLeftClick = () => {
    const { items: newItems, selected: newSelected } = produce(
      { items, selected },
      (draft) => {
        if (draft.items.includes(active)) {
          draft.items.splice(draft.items.indexOf(active), 1, null)
          draft.selected.splice(draft.selected.indexOf(null), 1, active)
        } else if (active && Object.keys(active).length !== 0) {
          draft.selected.splice(draft.selected.indexOf(active), 1, null)
          draft.items.splice(draft.items.indexOf(null), 1, active)
        }

        if (active) {
          saveAnswer(
            draft.selected.map((currentAns) =>
              currentAns ? source.indexOf(currentAns) : null
            )
          )
        }
      }
    )

    // we want users to be able to interact with the items,
    // when in other modes user can't do that
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR)
    }

    setItems(newItems)
    setSelected(newSelected)
  }

  const onUpDownClick = (indicator) => () => {
    let tmp

    setSelected(
      produce(selected, (draft) => {
        if (draft.includes(active)) {
          const activeIndex = draft.indexOf(active)
          if (indicator === 'Up' && activeIndex !== 0) {
            tmp = draft[activeIndex - 1]
            draft[activeIndex - 1] = draft[activeIndex]
            draft[activeIndex] = tmp
          }
          if (indicator === 'Down' && activeIndex !== draft.length - 1) {
            tmp = draft[activeIndex + 1]
            draft[activeIndex + 1] = draft[activeIndex]
            draft[activeIndex] = tmp
          }

          saveAnswer(
            draft.map((currentAns) =>
              currentAns ? source.indexOf(currentAns) : null
            )
          )
        }
      })
    )

    // we want users to be able to interact with the items,
    // when in other modes user can't do that
    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR)
    }
  }

  // const drop = ({ obj, index, flag }) => ({ obj, index, flag });

  const sourceLabel = get(
    item,
    'labels.source',
    t('component.sortList.containerSourcePreview')
  )
  const targetLabel = get(
    item,
    'labels.target',
    t('component.sortList.containerTargetPreview')
  )

  const fontSize = getFontSize(get(item, 'uiStyle.fontsize'))
  const orientation = get(item, 'uiStyle.orientation')
  const isVertical = orientation === 'vertical'
  const flexDirection = isPrintPreview || isVertical ? 'column' : 'row'
  const stemNumeration = get(item, 'uiStyle.validationStemNumeration', '')

  const validResponse = get(item, 'validation.validResponse.value', [])
  const altResponses = get(item, 'validation.altResponses', [])

  const validResponseScore = get(item, 'validation.validResponse.score')

  const validResponseCorrectList = source.map(
    (ans, i) => source[validResponse[i]]
  )
  const altResponseCorrectList = altResponses.map((altResponse, arIndex) =>
    source.map((ans, i) => source[altResponses[arIndex].value[i]])
  )

  const validRespCorrect = selected.filter(
    (selectedItem, i) =>
      selectedItem && selectedItem === source[validResponse[i]]
  )

  let altRespCorrect = [...validRespCorrect]

  altResponses.forEach((ob) => {
    const alt = selected.filter(
      (selectedItem, i) => selectedItem && selectedItem === source[ob.value[i]]
    )
    if (alt.length > altRespCorrect.length) {
      altRespCorrect = [...alt]
    }
  })

  /**
   * calculate styles based on question JSON here
   */
  const dragItemMinWidth = get(
    item,
    'uiStyle.choiceMinWidth',
    choiceDefaultMinW
  )
  const dragItemMaxWidth = get(
    item,
    'uiStyle.choiceMaxWidth',
    choiceDefaultMaxW
  )

  const paperStyle = {
    fontSize,
    padding: smallSize,
    boxShadow: smallSize ? 'none' : '',
    position: 'relative',
    overflow: isPrintPreview ? '' : 'auto',
  }

  const contentStyle = {
    minWidth: 580,
    maxWidth: isPrintPreview ? '100%' : 980,
    margin: 'auto',
  }

  const wrapperStyles = {
    marginTop: smallSize ? 0 : 40,
    width: isPrintPreview ? '100%' : dragItemMaxWidth * 2 + 180,
  }

  const dragItemStyle = {
    minWidth: dragItemMinWidth,
    maxWidth: dragItemMaxWidth,
    minHeight: choiceDefaultMinH,
    maxHeight: choiceDefaultMaxH,
    overflow: 'hidden',
  }

  const sourceItemStyle = {
    marginBottom: smallSize ? 6 : 12,
    borderRadius: 4,
    transform: 'translate3d(0px, 0px, 0px)',
    ...dragItemStyle,
  }

  const targetItemStyle = {
    marginBottom: smallSize ? 6 : 12,
    borderRadius: 4,
    transform: 'translate3d(0px, 0px, 0px)',
    ...dragItemStyle,
  }

  const showPreview = previewTab === CHECK || previewTab === SHOW
  const isChecked = !active && showPreview && !isReviewTab && !hideEvaluation

  const onDropHandler = (flag, index) => ({ data }) => {
    const { items: newItems, selected: newSelected } = produce(
      { items, selected },
      (draft) => {
        let tmp = []

        ;[tmp] = draft[data.flag].splice(data.index, 1, draft[flag][index])
        draft[flag][index] = tmp
      }
    )

    setItems(newItems)
    setSelected(newSelected)

    saveAnswer(
      newSelected.map((currentAns) =>
        currentAns ? source.indexOf(currentAns) : null
      )
    )

    if (previewTab !== CLEAR) {
      changePreviewTab(CLEAR)
    }
  }

  return (
    <HorizontalScrollContext.Provider
      value={{ getScrollElement: () => previewRef.current }}
    >
      <StyledPaperWrapper
        data-cy="sortListPreview"
        style={paperStyle}
        ref={previewRef}
      >
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
            <QuestionTitleWrapper>
              {stimulus && !smallSize && (
                <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
              )}
            </QuestionTitleWrapper>

            <Container style={contentStyle}>
              <FlexContainer
                data-cy="sortListComponent"
                flexDirection={flexDirection}
                alignItems="stretch"
                style={wrapperStyles}
                flexWrap="nowrap"
                className="sort-list-wrapper"
              >
                <FullWidthContainer isVertical={isVertical}>
                  {!smallSize && (
                    <Title data-cy="sourceTitle" smallSize={smallSize}>
                      {sourceLabel}
                    </Title>
                  )}
                  {items.map((draggableItem, i) => (
                    <DragDrop.DropContainer
                      key={i}
                      noBorder={!!draggableItem}
                      style={{
                        ...sourceItemStyle,
                        border: !!draggableItem && '2px solid',
                      }}
                      drop={onDropHandler('items', i)}
                    >
                      <DragItem
                        index={i}
                        smallSize={smallSize}
                        active={isEqual(active, draggableItem)}
                        onClick={setActiveItem}
                        items={selected}
                        flag="items"
                        obj={draggableItem}
                        style={dragItemStyle}
                        disableResponse={disableResponse || !isAnswerModifiable}
                        stemNumeration={stemNumeration}
                        isPrintPreview={isPrintPreview}
                        hideEvaluation={hideEvaluation}
                      />
                    </DragDrop.DropContainer>
                  ))}
                </FullWidthContainer>

                <FlexWithMargins
                  smallSize={smallSize}
                  flexDirection={flexDirection}
                  flexWrap="nowrap"
                >
                  {isVertical ? (
                    <>
                      <IconUp
                        smallSize={smallSize}
                        onClick={!disableResponse ? onRightLeftClick : () => {}}
                      />
                      <IconDown
                        smallSize={smallSize}
                        onClick={!disableResponse ? onRightLeftClick : () => {}}
                      />
                    </>
                  ) : (
                    <>
                      <IconLeft
                        smallSize={smallSize}
                        onClick={!disableResponse ? onRightLeftClick : () => {}}
                      />
                      <IconRight
                        smallSize={smallSize}
                        onClick={!disableResponse ? onRightLeftClick : () => {}}
                      />
                    </>
                  )}
                </FlexWithMargins>

                <FullWidthContainer isVertical={isVertical}>
                  {!smallSize && (
                    <Title data-cy="targetTitle" smallSize={smallSize}>
                      {targetLabel}
                    </Title>
                  )}
                  {selected.map((selectedItem, i) => (
                    <DragDrop.DropContainer
                      key={i}
                      noBorder={!!selectedItem && isChecked}
                      style={{
                        ...targetItemStyle,
                        border: !!selectedItem && !isChecked && '2px solid',
                      }}
                      drop={onDropHandler('selected', i)}
                      index={i}
                    >
                      <DragItem
                        index={i}
                        correct={
                          altRespCorrect.includes(selectedItem) ||
                          isReviewTab === true ||
                          evaluation?.[i]
                        }
                        smallSize={smallSize}
                        previewTab={previewTab}
                        flag="selected"
                        active={isEqual(active, selectedItem)}
                        onClick={setActiveItem}
                        items={items}
                        style={dragItemStyle}
                        obj={
                          userAnswer.length !== 0
                            ? selectedItem
                            : isReviewTab === true
                            ? validResponseCorrectList[i]
                            : null
                        }
                        isReviewTab={isReviewTab}
                        disableResponse={disableResponse || !isAnswerModifiable}
                        changePreviewTab={changePreviewTab}
                        stemNumeration={stemNumeration}
                        isPrintPreview={isPrintPreview}
                        hideEvaluation={hideEvaluation}
                        checkAnswerInProgress={checkAnswerInProgress}
                      />
                    </DragDrop.DropContainer>
                  ))}
                </FullWidthContainer>

                <FlexCol smallSize={smallSize}>
                  <IconUp
                    smallSize={smallSize}
                    onClick={!disableResponse ? onUpDownClick('Up') : () => {}}
                  />
                  <IconDown
                    smallSize={smallSize}
                    onClick={
                      !disableResponse ? onUpDownClick('Down') : () => {}
                    }
                  />
                </FlexCol>
              </FlexContainer>
            </Container>
            {view && view !== EDIT && <Instructions item={item} />}
            {(previewTab === SHOW || isReviewTab) && !hideCorrectAnswer && (
              <ShowCorrect
                source={source}
                list={validResponseCorrectList}
                altList={altResponseCorrectList}
                altResponses={altResponses}
                correctList={validResponse}
                itemStyle={{ ...dragItemStyle }}
                stemNumeration={stemNumeration}
                validResponseScore={validResponseScore}
                showAnswerScore={showAnswerScore}
              />
            )}
          </QuestionContentWrapper>
        </FlexContainer>
        <DragDrop.DragPreview />
      </StyledPaperWrapper>
    </HorizontalScrollContext.Provider>
  )
}

SortListPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  userAnswer: PropTypes.any.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  changePreviewTab: PropTypes.func.isRequired,
  isReviewTab: PropTypes.bool,
  hideEvaluation: PropTypes.bool,
}

SortListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false,
  hideEvaluation: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect((state) => ({
    checkAnswerInProgress: checkAnswerInProgressSelector(state),
  }))
)

export default enhance(SortListPreview)
