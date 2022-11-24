import React from 'react'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import loadable from '@loadable/component'
import Progress from '@edulastic/common/src/components/Progress'
import { connect } from 'react-redux'

import Question from '../../../components/Question/index'
import { Subtitle } from '../../../styled/Subtitle'
import { setQuestionDataAction } from '../../../../author/src/actions/question'

const FroalaEditor = loadable(() =>
  import(
    /* webpackChunkName: "froalaCommonChunk" */ '@edulastic/common/src/components/FroalaEditor'
  )
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
        placeholder={t('common.question.questionPlaceholder')}
        value={stimulus}
        toolbarId="toolbarId"
        onChange={onChangeQuestion}
        border="border"
      />
    </Question>
  )
}

export default connect(null, {
  setQuestionData: setQuestionDataAction,
})(ComposeQuestion)
