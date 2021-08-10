import React from 'react'
import Display from '../../../client/assessment/widgets/MultipleChoice/components/Display'

const Multiplechoice = ({
  previewTab,
  view,
  evaluation,
  item,
  userAnswer = {},
  qIndex,
  flowLayout,
  itemIndex,
  saveAnswer,
}) => {
  console.log('DEBUGGER', userAnswer, item.id)
  const handleAddAnswer = (qid) => {
    if (item.multipleResponses) {
      const _userAnswer = [...userAnswer[item.id]]
      if (_userAnswer.includes(qid)) {
        const removeIndex = _userAnswer.findIndex((el) => el === qid)
        _userAnswer.splice(removeIndex, 1)
        saveAnswer({ questionId: item.id, answer: _userAnswer })
      } else {
        saveAnswer({ questionId: item.id, answer: [..._userAnswer, qid] })
      }
    } else {
      saveAnswer({ questionId: item.id, answer: [qid] })
    }
  }

  return (
    <Display
      // showAnswer={true}
      preview={previewTab === 'preview'}
      view={view}
      smallSize={item.smallSize}
      options={item.options}
      question={item.stimulus}
      userSelections={userAnswer[item.id]}
      evaluation={evaluation}
      // validation={item.validation}
      onChange={handleAddAnswer}
      uiStyle={item.uiStyle}
      qIndex={qIndex}
      qId={item.id}
      multipleResponses={item.maxRespCount > 1}
      flowLayout={flowLayout}
      qLabel={item.qLabel || itemIndex + 1}
      qSubLabel={item.qSubLabel}
      // testItem={item}
      styleType="primary"
      item={item}
      fontSize="16px"
      showQuestionNumber
      isBroadcasted
    />
  )
}

export default Multiplechoice
