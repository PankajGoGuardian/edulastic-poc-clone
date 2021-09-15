import React, { Component } from 'react'
import { get } from 'lodash'
import produce from 'immer'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import {
  Layout,
  FontSizeOption,
  ResponseContainerPositionOption,
  StemNumerationOption,
} from '../../../containers/WidgetOptions/components'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import Question from '../../../components/Question'

class LayoutWrapper extends Component {
  render() {
    const {
      item,
      setQuestionData,
      advancedAreOpen,
      fillSections,
      cleanSections,
      t,
    } = this.props

    const changeUIStyle = (prop, val) => {
      setQuestionData(
        produce(item, (draft) => {
          if (!draft.uiStyle) {
            draft.uiStyle = {}
          }
          draft.uiStyle[prop] = val
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
              <ResponseContainerPositionOption
                onChange={(val) =>
                  changeUIStyle('possibilityListPosition', val)
                }
                value={get(item, 'uiStyle.possibilityListPosition', 'left')}
              />
            </Col>
            <Col md={12}>
              <StemNumerationOption
                onChange={(val) =>
                  changeUIStyle('validationStemNumeration', val)
                }
                value={get(
                  item,
                  'uiStyle.validationStemNumeration',
                  'numerical'
                )}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <FontSizeOption
                onChange={(val) => changeUIStyle('fontsize', val)}
                value={get(item, 'uiStyle.fontsize', 'normal')}
              />
            </Col>
          </Row>
        </Layout>
      </Question>
    )
  }
}

LayoutWrapper.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

LayoutWrapper.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

export default React.memo(withNamespaces('assessment')(LayoutWrapper))
