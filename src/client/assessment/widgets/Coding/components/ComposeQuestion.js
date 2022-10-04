import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import produce from 'immer'
import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import loadable from '@loadable/component'
import Progress from '@edulastic/common/src/components/Progress'
import Question from '../../../components/Question'
import { TextInputStyled } from '../../../styled/InputStyles'
import { Subtitle } from '../../../styled/Subtitle'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import { Row } from '../../../styled/WidgetOptions/Row'
import { updateVariables } from '../../../utils/variables'

const FroalaEditor = loadable(() =>
  import(
    /* webpackChunkName: "froalaCommonChunk" */ '@edulastic/common/src/components/FroalaEditor'
  )
)

const ComposeQuestion = ({
  t,
  item,
  toolbarId,
  fillSections,
  cleanSections,
  fontSize,
  setQuestionData,
}) => {
  const onChangeQuestionTitle = (e) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.stimulus = e.target.value
        updateVariables(draft)
      })
    )
  }

  const onChangeQuestion = (stimulus) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.stimulusBody = stimulus
        updateVariables(draft)
      })
    )
  }
  console.log(item.title)
  return (
    <Question
      dataCy="questiontext"
      questionTextArea
      section="main"
      label={t('component.coding.composeQuestion')}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle
        id={getFormattedAttrId(
          `${item?.title}-${t('component.coding.composeQuestion')}`
        )}
        textStyles={{ margin: '0' }}
        showIcon
      >
        {t('component.coding.composeQuestion')}
      </Subtitle>
      <Row>
        <Col span={24}>
          <Label>{t('component.coding.questionTitle')}</Label>
          <TextInputStyled
            type="text"
            name="title"
            placeholder={t('component.coding.questionTitlePlaceholder')}
            value={item.stimulus}
            onChange={onChangeQuestionTitle}
            disabled={false}
          />
        </Col>
        <Col span={24}>
          <FroalaEditor
            fallback={<Progress />}
            placeholder={t('component.coding.questionPlaceholder')}
            value={item.stimulusBody}
            toolbarId={toolbarId}
            onChange={onChangeQuestion}
            border="border"
            fontSize={fontSize}
          />
        </Col>
      </Row>
    </Question>
  )
}

ComposeQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  toolbarId: PropTypes.string,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  setQuestionData: PropTypes.func.isRequired,
}

ComposeQuestion.defaultProps = {
  toolbarId: 'compose-question',
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(ComposeQuestion)
