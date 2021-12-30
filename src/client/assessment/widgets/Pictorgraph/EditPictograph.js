import React, { useState, useEffect } from 'react'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import produce from 'immer'
import { compose } from 'redux'

import { withNamespaces } from '@edulastic/localization'
import { clozeImage } from '@edulastic/constants'

import PossibleResponses from './components/PossibleResponses'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import Question from '../../components/Question'
import { updateVariables } from '../../utils/variables'
import CorrectAnswers from '../../components/CorrectAnswers'
import PreviewPictograph from './PreviewPictograph'
import QuestionLayer from './components/QuestionLayer'
import Options from './components/Options'
import ComposeQuestion from '../OrderList/ComposeQuestion'
import Classifications from './components/Classifications'
import { EDIT } from '../../constants/constantsForQuestions'
import AddBackgroundImage from './components/AddBackgroundImage'
import BackgroundImage from './components/BackgroundImage'

function getImageDimensions(that) {
  const { maxHeight, maxWidth } = clozeImage
  let height
  let width
  if (that.naturalHeight > maxHeight || that.naturalWidth > maxWidth) {
    const fitHeight = Math.floor(
      maxWidth * (that.naturalHeight / that.naturalWidth)
    )
    const fitWidth = Math.floor(
      maxHeight * (that.naturalWidth / that.naturalHeight)
    )
    if (fitWidth > maxWidth) {
      width = maxWidth
      height = fitHeight
    } else {
      height = maxHeight
      width = fitWidth
    }
  } else {
    width = that.naturalWidth
    height = that.naturalHeight
  }

  return [height, width]
}

const EditPictograph = ({
  t,
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedLink,
  advancedAreOpen,
}) => {
  const { classifications, uiStyle, showClassName, imageOptions } = item
  const [correctTab, setCorrectTab] = useState(0)
  const [dragItem, setDragItem] = useState(
    imageOptions || { width: 0, height: 0, x: 0, y: 0 }
  )
  const { width: dragItemWidth, height: dragItemHeight } = dragItem

  useEffect(() => {
    setQuestionData(
      produce(item, (draft) => {
        draft.imageOptions = { ...imageOptions, ...dragItem }
      })
    )
  }, [dragItemWidth, dragItemHeight])

  const getInitalAnswerMap = () => {
    const initalAnswerMap = {}
    classifications.forEach((classification) => {
      initalAnswerMap[classification.id] =
        initalAnswerMap[classification.id] || []
    })
    return initalAnswerMap
  }

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, (draft) => {
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = []
        }
        draft.validation.altResponses.push({
          score: draft?.validation?.validResponse?.score,
          value: getInitalAnswerMap(),
        })

        updateVariables(draft)
      })
    )
    setCorrectTab(correctTab + 1)
  }

  const handleCloseTab = (tabIndex) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.altResponses.splice(tabIndex, 1)
        updateVariables(draft)
      })
    )
    setCorrectTab(0)
  }

  const handlePointsChange = (val) => {
    if (!(val > 0)) {
      return
    }
    const points = parseFloat(val, 10)
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = points
        } else {
          draft.validation.altResponses[correctTab - 1].score = points
        }
        updateVariables(draft)
      })
    )
  }

  const handleDroppedChoices = (droppedChoice) => {
    setQuestionData(
      produce(item, (draft) => {
        if (draft.droppedChoices) {
          draft.droppedChoices = droppedChoice
        }
        updateVariables(draft)
      })
    )
  }

  const handleAnswerChange = (answer) => {
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          if (draft.validation && draft.validation.validResponse) {
            draft.validation.validResponse.value = answer
          }
        } else if (
          draft.validation &&
          draft.validation.altResponses &&
          draft.validation.altResponses[correctTab - 1]
        )
          draft.validation.altResponses[correctTab - 1].value = answer

        updateVariables(draft)
      })
    )
  }

  const handleItemChangeChange = (key, val) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[key] = val
        if (key === 'duplicateResponses') {
          draft.validation.validResponse.value = getInitalAnswerMap()
          draft.validation.altResponses.forEach((altResponse) => {
            altResponse.value = getInitalAnswerMap()
          })
        }
        updateVariables(draft)
      })
    )
  }

  const setImageDimensions = (url, isNew) => {
    const img = new Image()
    // eslint-disable-next-line func-names
    img.addEventListener('load', function () {
      const [height, width] = getImageDimensions(this)
      console.log({ height, width })
      setQuestionData(
        produce(item, (draft) => {
          if (isNew) {
            draft.imageHeight = undefined
            draft.imageWidth = undefined
          }
          draft.imageUrl = url
          draft.imageOriginalHeight = height
          draft.imageOriginalWidth = width
        })
      )
      setDragItem({ ...dragItem, width, height })
    })
    img.src = url
  }

  const correctAnswers =
    correctTab === 0
      ? item.validation.validResponse.value
      : item.validation.altResponses[correctTab - 1].value

  const { droppedChoices } = item

  const renderOptions = () => (
    <PreviewPictograph
      item={item}
      saveAnswer={handleAnswerChange}
      editCorrectAnswers={correctAnswers}
      droppedChoices={droppedChoices}
      setQuestionData={setQuestionData}
      showClassName={showClassName}
      view={EDIT}
    />
  )

  const renderOptionsQuestionLayer = () => (
    <PreviewPictograph
      item={item}
      saveAnswer={handleDroppedChoices}
      editCorrectAnswers={droppedChoices}
      setQuestionData={setQuestionData}
      showClassName={showClassName}
      view={EDIT}
      isQuestionLayer
    />
  )

  const handleDrag = (e, d) => {
    setDragItem({ ...dragItem, x: d.x, y: d.y })
    setQuestionData(
      produce(item, (draft) => {
        draft.imageOptions = { ...{ ...dragItem, x: d.x, y: d.y } }
      })
    )
  }

  const handleResize = (e, direction, ref, delta, position) => {
    const width =
      typeof ref.style.width === 'number'
        ? ref.style.width
        : parseInt(ref.style.width.split('px')[0], 10)

    const height =
      typeof ref.style.height === 'number'
        ? ref.style.height
        : parseInt(ref.style.height.split('px')[0], 10)

    setDragItem({
      width: width >= 700 ? 700 : width,
      height: height >= 600 ? 600 : height,
      ...position,
    })
  }

  const handleDragAndResizeStop = () => {
    setQuestionData(
      produce(item, (draft) => {
        draft.imageOptions = { ...dragItem }
      })
    )
  }

  const deleteBgImg = () => {
    setDragItem({ x: 0, y: 0, width: 0, height: 0 })
    setQuestionData(
      produce(item, (draft) => {
        draft.imageOptions = { x: 0, y: 0, width: 0, height: 0 }
        draft.imageUrl = ''
      })
    )
  }

  return (
    <>
      <ComposeQuestion
        item={item}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <Question
        section="main"
        label="Background Image"
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        {item.imageUrl ? (
          <BackgroundImage
            dragItem={dragItem}
            imageOptions={imageOptions}
            t={t}
            handleDrag={handleDrag}
            handleResize={handleResize}
            handleDragAndResizeStop={handleDragAndResizeStop}
            imageUrl={item.imageUrl}
            deleteBgImg={deleteBgImg}
          />
        ) : (
          <AddBackgroundImage
            t={t}
            title={item?.title}
            setImageDimensions={setImageDimensions}
          />
        )}
      </Question>

      <Question
        section="main"
        label={t('component.pictograph.classifications')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Classifications
          item={item}
          setQuestionData={setQuestionData}
          handleItemChangeChange={handleItemChangeChange}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.enterElements')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <PossibleResponses
          item={item}
          setQuestionData={setQuestionData}
          getInitalAnswerMap={getInitalAnswerMap}
          uiStyle={uiStyle}
          handleItemChangeChange={handleItemChangeChange}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.questionLayer')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <QuestionLayer
          fillSections={fillSections}
          cleanSections={cleanSections}
          options={renderOptionsQuestionLayer()}
        />
      </Question>
      <Question
        section="main"
        label={t('component.pictograph.correctAnswer')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <CorrectAnswers
          onTabChange={setCorrectTab}
          correctTab={correctTab}
          onAdd={handleAddAnswer}
          validation={item.validation}
          options={renderOptions()}
          onCloseTab={handleCloseTab}
          fillSections={fillSections}
          cleanSections={cleanSections}
          marginBottom="-50px"
          questionType={item?.title}
          points={
            correctTab === 0
              ? item.validation.validResponse.score
              : item.validation.altResponses[correctTab - 1].score
          }
          onChangePoints={handlePointsChange}
          isCorrectAnsTab={correctTab === 0}
          noAlternateAnswer
        />
      </Question>
      {advancedLink}

      <Options
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />
    </>
  )
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(EditPictograph)
