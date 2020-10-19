import React, { Component } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import {
  Layout,
  SpecialCharactersOption,
  BrowserSpellcheckOption,
  CharactersToDisplayOption,
  PlaceholderOption,
  FontSizeOption,
  InputTypeOption,
} from '../../../containers/WidgetOptions/components'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import Question from '../../../components/Question'
import {
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../../author/QuestionEditor/ducks'

class LayoutComponent extends Component {
  render() {
    const {
      item,
      setQuestionData,
      t,
      advancedAreOpen,
      fillSections,
      cleanSections,
    } = this.props
    const inputType = get(item, ['uiStyle', 'input_type'], 'text')

    const _change = (prop, uiStyle) => {
      setQuestionData(
        produce(item, (draft) => {
          draft[prop] = uiStyle
        })
      )
    }

    const _uiStyleChange = (prop, val) => {
      setQuestionData(
        produce(item, (draft) => {
          if (!draft.uiStyle) {
            draft.uiStyle = {}
          }

          draft.uiStyle[prop] = val
        })
      )
    }

    const handleInputTypeChange = (val) => {
      setQuestionData(
        produce(item, (draft) => {
          draft.uiStyle = draft.uiStyle || {}
          /**
           * if input type number unset the special characters
           * @see https://snapwiz.atlassian.net/browse/EV-14790 comments
           */
          if (val === 'number') {
            draft.characterMap = undefined
          }
          draft.uiStyle.input_type = val
        })
      )
    }

    return (
      <Question
        section="advanced"
        label={t('component.options.display')}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout
          id={getFormattedAttrId(
            `${item?.title}-${t('component.options.display')}`
          )}
        >
          <Row gutter={24}>
            <Col md={12}>
              <SpecialCharactersOption
                disabled={inputType === 'number'}
                onChange={(checked) => {
                  if (checked) {
                    _change('characterMap', [])
                  } else {
                    _change('characterMap', undefined)
                  }
                }}
                checked={!!item.characterMap}
              />
            </Col>
            <Col md={12}>
              <BrowserSpellcheckOption
                data-cy="browserSpellCheckOption"
                onChange={(checked) => _change('spellcheck', checked)}
                checked={!!item.spellcheck}
              />
            </Col>
          </Row>

          {Array.isArray(item.characterMap) && (
            <Row gutter={24}>
              <Col md={12}>
                <CharactersToDisplayOption
                  onChange={(val) =>
                    _change(
                      'characterMap',
                      val
                        .split('')
                        .reduce(
                          (acc, cur) =>
                            acc.includes(cur) ? acc : [...acc, cur],
                          []
                        )
                    )
                  }
                  value={item.characterMap.join('')}
                />
              </Col>
            </Row>
          )}

          <Row gutter={24}>
            <Col md={12}>
              <InputTypeOption
                onChange={handleInputTypeChange}
                value={inputType}
              />
            </Col>
            <Col md={12}>
              <PlaceholderOption
                onChange={(val) => _change('placeholder', val)}
                value={item.placeholder}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <FontSizeOption
                onChange={(val) => _uiStyleChange('fontsize', val)}
                value={get(item, 'uiStyle.fontsize', 'normal')}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    )
  }
}

LayoutComponent.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

LayoutComponent.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
  advancedAreOpen: false,
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

export default enhance(LayoutComponent)
