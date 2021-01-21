import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import styled from 'styled-components'

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
import { getFontSize } from '../../utils/helpers'
import { SectionHeading } from '../../styled/WidgetOptions/SectionHeading'
import Question from '../../components/Question'

class Extras extends Component {
  render() {
    const {
      t,
      children,
      item,
      setQuestionData,
      isSection,
      fillSections,
      cleanSections,
      advancedAreOpen,
      isPremiumUser,
    } = this.props
    const _change = change({ item, setQuestionData })
    const fontSize = getFontSize(item.uiStyle)

    return (
      <QuestionContainer fontSize={fontSize}>
        <Question
          section={isPremiumUser ? 'advanced' : 'main'}
          label={t('component.options.solution')}
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={isPremiumUser ? advancedAreOpen : true}
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
                  onChange={(value) => _change('instructorStimulus', value)}
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
                  onChange={(value) => _change('sampleAnswer', value)}
                  value={get(item, 'sampleAnswer', '')}
                />
              </WidgetFRInput>
            </Col>
          </Row>

          <QuillSortableHintsList />
        </Question>

        {children}
      </QuestionContainer>
    )
  }
}

Extras.Distractors = Distractors
Extras.Hints = Hints

Extras.propTypes = {
  children: PropTypes.any,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isSection: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isPremiumUser: PropTypes.bool,
}

Extras.defaultProps = {
  children: null,
  isSection: false,
  advancedAreOpen: true,
  fillSections: () => {},
  cleanSections: () => {},
  isPremiumUser: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      item: getQuestionDataSelector(state),
      isPremiumUser: get(state, ['user', 'user', 'features', 'premium'], false),
    }),
    {
      setQuestionData: setQuestionDataAction,
    }
  )
)

export default enhance(Extras)

const QuestionContainer = styled.div`
  .fr-wrapper.show-placeholder .fr-placeholder {
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
