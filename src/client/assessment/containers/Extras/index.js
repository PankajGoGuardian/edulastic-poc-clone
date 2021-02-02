import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import QuestionTextArea from '../../components/QuestionTextArea'
import {
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../author/QuestionEditor/ducks'
import QuillSortableHintsList from '../../components/QuillSortableHintsList'

import { WidgetFRInput } from '../../styled/Widget'
import { Subtitle } from '../../styled/Subtitle'
import { Label } from '../../styled/WidgetOptions/Label'

import Distractors from './Distractors'
import Hints from './Hints'
import { change } from './helpers'
import { Row } from '../../styled/WidgetOptions/Row'
import { Col } from '../../styled/WidgetOptions/Col'
import { SectionHeading } from '../../styled/WidgetOptions/SectionHeading'
import Question from '../../components/Question'

const Extras = ({
  t,
  item,
  setQuestionData,
  isSection,
  fillSections,
  cleanSections,
  advancedAreOpen,
}) => {
  const handleChange = change({ item, setQuestionData })

  return (
    <Question
      section="advanced"
      label={t('component.options.solution')}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      {isSection && (
        <SectionHeading>{t('component.options.solution')}</SectionHeading>
      )}
      {!isSection && (
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.options.solution')}`
          )}
        >
          {t('component.options.solution')}
        </Subtitle>
      )}

      <Row gutter={24}>
        <Col md={24}>
          <Label data-cy="instructor_stimulus">
            {t('component.options.overallDistractorRationale')}
          </Label>

          <WidgetFRInput>
            <QuestionTextArea
              toolbarId="instructor_stimulus"
              toolbarSize="SM"
              placeholder={t(
                'component.options.enterDistractorRationaleQuestion'
              )}
              onChange={(value) => handleChange('instructorStimulus', value)}
              value={get(item, 'instructorStimulus', '')}
            />
          </WidgetFRInput>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col md={24}>
          <Label data-cy="sample_answer">
            {t('component.options.explanation')}
          </Label>

          <WidgetFRInput>
            <QuestionTextArea
              placeholder={t('component.options.enterSampleAnswer')}
              toolbarId="sample_answer"
              toolbarSize="SM"
              onChange={(value) => handleChange('sampleAnswer', value)}
              value={get(item, 'sampleAnswer', '')}
            />
          </WidgetFRInput>
        </Col>
      </Row>

      {advancedAreOpen && <Distractors />}
      {advancedAreOpen && <QuillSortableHintsList />}
    </Question>
  )
}

Extras.Distractors = Distractors
Extras.Hints = Hints

Extras.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isSection: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

Extras.defaultProps = {
  isSection: false,
  advancedAreOpen: true,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      item: getQuestionDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
    }
  )
)

export default enhance(Extras)
