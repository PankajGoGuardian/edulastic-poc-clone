import React from 'react'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import loadable from '@loadable/component'
import { Progress } from '@edulastic/common/src/components/Progress'

import Question from '../../../components/Question/index'
import { Subtitle } from '../../../styled/Subtitle'

const FroalaEditor = loadable(() =>
  import('@edulastic/common/src/components/FroalaEditor')
)

const ComposeQuestion = ({
  fillSections,
  cleanSections,
  t,
  stimulus,
  setQuestionData,
  produce,
  item,
}) => {
  const onChangeQuestion = (_stimulus) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.stimulus = _stimulus
      })
    )
  }
  return (
    <Question
      section="main"
      label={t('common.question.composeQuestion')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('common.question.composeQuestion')}`
        )}
      >
        {t('common.question.composeQuestion')}
      </Subtitle>
      <FroalaEditor
        fallback={<Progress />}
        tag="textarea"
        placeholder={t('common.question.questionPlaceholder')}
        value={stimulus}
        toolbarId="toolbarId"
        onChange={onChangeQuestion}
        border="border"
      />
    </Question>
  )
}

export default ComposeQuestion
