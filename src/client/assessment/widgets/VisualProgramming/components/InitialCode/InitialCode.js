import React from 'react'

import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import loadable from '@loadable/component'
import { connect } from 'react-redux'

import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import Question from '../../../../components/Question/index'
import { Subtitle } from '../../../../styled/Subtitle'
import { setQuestionDataAction } from '../../../../../author/src/actions/question'
import VisualEditor from '../VisualEditor/VisualEditor'

const FroalaEditor = loadable(() =>
  import(
    /* webpackChunkName: "froalaCommonChunk" */ '@edulastic/common/src/components/FroalaEditor'
  )
)

const InitialCode = ({
  fillSections,
  cleanSections,
  t,
  stimulus,
  setQuestionData,
  produce,
  item,
}) => {
  const onChangeQuestion = (initialCode) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.initialCode = initialCode
      })
    )
  }
  return (
    <Question
      section="main"
      label={t('common.question.initialCode')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('common.question.initialCode')}`
        )}
      >
        {t('common.question.initialCode')}
      </Subtitle>
      <VisualEditor
        initialCode={item.initialCode}
        onChange={onChangeQuestion}
      />
    </Question>
  )
}

export default compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)(InitialCode)
