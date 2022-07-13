import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import Question from '../../components/Question'

import {
  Layout,
  FontSizeOption,
  PlaceholderOption,
  MinHeightOption,
  MaxHeightOption,
  SpecialCharactersOption,
  CharactersToDisplayOption,
} from '../../containers/WidgetOptions/components'
import { Row } from '../../styled/WidgetOptions/Row'
import { Col } from '../../styled/WidgetOptions/Col'

import {
  changeItemAction,
  changeUIStyleAction,
} from '../../../author/src/actions/question'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

const LayoutComponent = ({
  item,
  changeItem,
  changeUIStyle,
  setQuestionData,
  advancedAreOpen,
  fillSections,
  cleanSections,
  t,
}) => {
  const changeQuestion = (prop, updatedValue) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[prop] = updatedValue
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
        <Row gutter={24} type="flex" align="middle">
          <Col md={12}>
            <SpecialCharactersOption
              data-cy="specialCharactersOption"
              onChange={(checked) => {
                if (checked) {
                  changeItem('characterMap', [])
                } else {
                  changeItem('characterMap', undefined)
                }
              }}
              checked={!!item.characterMap}
            />
          </Col>
          {Array.isArray(item.characterMap) && (
            <Col md={12}>
              <CharactersToDisplayOption
                disabled
                onChange={(val) =>
                  changeItem(
                    'characterMap',
                    val
                      .split('')
                      .reduce(
                        (acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]),
                        []
                      )
                  )
                }
                value={item.characterMap.join('')}
              />
            </Col>
          )}
        </Row>

        <Row gutter={24}>
          <Col md={12}>
            <MinHeightOption
              onChange={(val) => changeUIStyle('minHeight', +val)}
              value={get(item, 'uiStyle.minHeight', 300)}
            />
          </Col>
          <Col md={12}>
            <MaxHeightOption
              onChange={(val) => changeUIStyle('maxHeight', +val)}
              value={get(item, 'uiStyle.maxHeight', 300)}
            />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col md={12}>
            <PlaceholderOption
              onChange={(val) => {
                changeQuestion('placeholder', val)
              }}
              type="text"
              value={get(item, 'placeholder', '')}
            />
          </Col>
          <Col md={12}>
            <FontSizeOption
              onChange={(val) => changeUIStyle('fontsize', val)}
              value={get(item, 'uiStyle.fontsize', 'normal')}
            />
          </Col>
        </Row>

        {/* TODO: Remove "submitOverLimit (EV-15489)" if not needed */}
        {/* <Row gutter={24}>
          <Col md={12}>
            <CheckboxLabel
              defaultChecked={item && item.validation && item.validation.submitOverLimit}
              onChange={e => handleValidationChange("submitOverLimit", e.target.checked)}
            >
              {t("component.essayText.submitOverLimit")}
            </CheckboxLabel>
          </Col>
        </Row> */}
      </Layout>
    </Question>
  )
}

LayoutComponent.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  changeUIStyle: PropTypes.func.isRequired,
  changeItem: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

LayoutComponent.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

export default compose(
  withNamespaces('assessment'),
  connect(({ user }) => ({ user }), {
    changeItem: changeItemAction,
    changeUIStyle: changeUIStyleAction,
    setQuestionData: setQuestionDataAction,
  })
)(LayoutComponent)
