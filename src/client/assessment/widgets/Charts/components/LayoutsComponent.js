import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { questionType } from '@edulastic/constants'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { Layout } from '../../../containers/WidgetOptions/components'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import {
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../../author/QuestionEditor/ducks'
import Question from '../../../components/Question'
import PointStyleOption from './PointStyle'
import MulticolorBarsOption from './MulticolorBarsOption'
import { Label } from '../../../styled/WidgetOptions/Label'
import { TextInputStyled } from '../../../styled/InputStyles'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import FontSizeSelect from '../../../components/FontSizeSelect'

const InputField = ({ name, value, onChange, type = 'number', t }) => (
  <>
    <Label>{t(`component.chart.${name}`)}</Label>
    <TextInputStyled
      size="large"
      type={type}
      value={value}
      onChange={(e) =>
        onChange(name, type === 'text' ? e.target.value : +e.target.value)
      }
    />
  </>
)

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
}

InputField.defaultProps = {
  type: 'number',
}

const CheckboxField = ({ t, onChange, value, name }) => (
  <CheckboxLabel
    onChange={onChange}
    checked={!!value}
    textTransform="uppercase"
  >
    {t(`component.chart.${name}`)}
  </CheckboxLabel>
)

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

class LayoutsComponent extends Component {
  render() {
    const {
      item,
      setQuestionData,
      advancedAreOpen,
      fillSections,
      cleanSections,
      t,
    } = this.props
    const chartType = get(item, 'uiStyle.chartType')
    const uiStyle = get(item, 'uiStyle', {})

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

    const getLayoutSettings = (_chartType) => {
      const settings = [
        <InputField
          name="width"
          value={parseInt(uiStyle.width, 10) < 1 ? null : uiStyle.width}
          onChange={changeUIStyle}
          type="number"
          t={t}
        />,
        <InputField
          name="height"
          value={parseInt(uiStyle.height, 10) < 1 ? null : uiStyle.height}
          onChange={changeUIStyle}
          type="number"
          t={t}
        />,
        <InputField
          name="layoutMargin"
          value={
            parseInt(uiStyle.layoutMargin, 10) < 1 ? null : uiStyle.layoutMargin
          }
          onChange={changeUIStyle}
          type="number"
          t={t}
        />,
        <FontSizeSelect
          data-cy="fontSize"
          value={get(item, 'uiStyle.fontsize', 'normal')}
          onChange={(val) => changeUIStyle('fontsize', val)}
        />,
      ]

      settings.push(
        <CheckboxField
          t={t}
          name="showGridlines"
          value={uiStyle.showGridlines}
          onChange={() =>
            changeUIStyle('showGridlines', !uiStyle.showGridlines)
          }
        />
      )

      settings.push(
        <CheckboxField
          t={t}
          name="displayPositionOnHover"
          value={uiStyle.displayPositionOnHover}
          onChange={() =>
            changeUIStyle(
              'displayPositionOnHover',
              !uiStyle.displayPositionOnHover
            )
          }
        />
      )

      settings.push(
        <CheckboxField
          t={t}
          name="drawLabelZero"
          value={uiStyle.drawLabelZero}
          onChange={() =>
            changeUIStyle('drawLabelZero', !uiStyle.drawLabelZero)
          }
        />
      )

      settings.push(
        <CheckboxField
          t={t}
          name="snapToGrid"
          value={uiStyle.snapToGrid}
          onChange={() => changeUIStyle('snapToGrid', !uiStyle.snapToGrid)}
        />
      )

      if (_chartType === questionType.LINE_CHART) {
        settings.push(
          <PointStyleOption
            onChange={(val) => changeUIStyle('pointStyle', val)}
            value={get(item, 'uiStyle.pointStyle', 'dot')}
          />
        )
      }

      if (_chartType === questionType.HISTOGRAM) {
        settings.push(
          <MulticolorBarsOption
            onChange={(val) => changeUIStyle('multicolorBars', val)}
            value={get(item, 'uiStyle.multicolorBars', true)}
            data-cy="multiColorBar"
          />
        )
      }

      return settings
    }

    const settings = getLayoutSettings(chartType)

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
          {settings.map((setting, index) => (
            <Fragment key={`fragment-${index}`}>
              {index % 2 === 0 && (
                <Row gutter={24}>
                  <Col md={12}>{settings[index]}</Col>
                  <Col md={12}>{settings[index + 1]}</Col>
                </Row>
              )}
            </Fragment>
          ))}
        </Layout>
      </Question>
    )
  }
}

LayoutsComponent.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

LayoutsComponent.defaultProps = {
  advancedAreOpen: false,
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

export default enhance(LayoutsComponent)
