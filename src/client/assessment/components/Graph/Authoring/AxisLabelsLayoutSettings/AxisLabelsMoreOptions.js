import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Select } from 'antd'
import { notification, getFormattedAttrId } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import LabelWithHelper from '../../components/LabelWithHelper'
import { fractionStringToNumber } from '../../../../utils/helpers'
import { FRACTION_FORMATS } from '../../../../constants/constantsForQuestions'
import { RENDERING_BASE } from '../../Builder/config/constants'
import Extras from '../../../../containers/Extras'

import { Row } from '../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'
import { Subtitle } from '../../../../styled/Subtitle'

import { ScoreSettings } from '..'
import Question from '../../../Question'
import {
  TextInputStyled,
  SelectInputStyled,
} from '../../../../styled/InputStyles'
import { CheckboxLabel } from '../../../../styled/CheckboxWithLabel'
import { validations } from '../../../../utils/inputsValidations'
import FontSizeSelect from '../../../FontSizeSelect'

class AxisLabelsMoreOptions extends Component {
  constructor(props) {
    super(props)

    const {
      graphData: {
        numberlineAxis: { ticksDistance },
      },
    } = this.props

    this.state = {
      currentRenderingBaseItem: {
        id: RENDERING_BASE.LINE_MINIMUM_VALUE,
        value: 'Line minimum value',
        label: 'Line minimum value',
        selected: true,
      },
      ticksDistance,
    }
  }

  scoringTypes = [
    { label: 'Exact match', value: 'exactMatch' },
    { label: 'Partial match', value: 'partialMatch' },
  ]

  getFractionFormatSettings = () => {
    const { t } = this.props
    return [
      {
        label: t('component.options.fractionFormatOptions.decimal'),
        value: FRACTION_FORMATS.decimal,
      },
      {
        label: t('component.options.fractionFormatOptions.fraction'),
        value: FRACTION_FORMATS.fraction,
      },
      {
        label: t('component.options.fractionFormatOptions.mixedFraction'),
        value: FRACTION_FORMATS.mixedFraction,
      },
    ]
  }

  handleNumberlineCheckboxChange = (name, checked) => {
    const { graphData, setNumberline } = this.props
    const { numberlineAxis } = graphData
    setNumberline({ ...numberlineAxis, [name]: !checked })
  }

  handleTicksDistanceInputChange = (event) => {
    const {
      target: { value },
    } = event
    this.setState({ ticksDistance: value })
  }

  handleTicksDistanceInputBlur = () => {
    const { ticksDistance: value } = this.state
    const { graphData, setNumberline } = this.props
    const {
      numberlineAxis,
      canvas: { xMin, xMax },
    } = graphData

    const parsedValue = fractionStringToNumber(value)
    if (Number.isNaN(parsedValue)) {
      setNumberline({ ...numberlineAxis, ticksDistance: value })
      return
    }

    if (Math.abs(xMax - xMin) / parsedValue > 20) {
      const ticksDistance = +(Math.abs(xMax - xMin) / 20).toFixed(1)
      notification({
        type: 'warn',
        msg: `For the range from "${xMin}" to "${xMax}" the minimum tick distance "${ticksDistance}" is recommended`,
      })
      this.setState({ ticksDistance })
      setNumberline({ ...numberlineAxis, ticksDistance })
      return
    }

    setNumberline({ ...numberlineAxis, ticksDistance: value })
  }

  handleNumberlineInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setNumberline } = this.props
    const { numberlineAxis } = graphData

    let valid = true
    if (validations[name]) {
      valid = validations[name](value)
    }

    if (!valid) {
      return
    }

    if (name !== 'specificPoints' && !value) {
      setNumberline({ ...numberlineAxis, [name]: 0 })
    } else if (name === 'minorTicks') {
      setNumberline({ ...numberlineAxis, [name]: +value })
    } else {
      setNumberline({ ...numberlineAxis, [name]: value })
    }
  }

  handleCanvasInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setCanvas } = this.props
    const { canvas } = graphData
    if (!value) {
      setCanvas({ ...canvas, [name]: 0 })
    } else {
      setCanvas({ ...canvas, [name]: value })
    }
  }

  handleOptionsInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData

    if (!value) {
      setOptions({ ...uiStyle, [name]: '' })
    } else {
      setOptions({ ...uiStyle, [name]: value })
    }
  }

  handleInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData
    setOptions({ ...uiStyle, [name]: value })
  }

  getResponseBoxPositionItem = () => {
    const { responseBoxPositionList, graphData } = this.props
    const { numberlineAxis } = graphData
    return responseBoxPositionList.find(
      (item) => item.id === (numberlineAxis.responseBoxPosition || 'bottom')
    )
  }

  changeFontSize = (fontSize) => {
    const { setOptions, graphData } = this.props
    const { uiStyle } = graphData
    setOptions({ ...uiStyle, fontSize })
  }

  changeFractionsFormat = (e) => {
    const { setNumberline, graphData } = this.props
    const { numberlineAxis } = graphData
    setNumberline({ ...numberlineAxis, fractionsFormat: e })
  }

  changeRenderingBase = (e) => {
    const { setNumberline, graphData, renderingBaseList } = this.props
    const { numberlineAxis } = graphData
    const findItem = renderingBaseList.find(
      (renderingItem) => renderingItem.value.toLowerCase() === e.toLowerCase()
    )

    if (findItem) {
      findItem.selected = true

      setNumberline({ ...numberlineAxis, renderingBase: findItem.id })

      this.setState(() => ({
        currentRenderingBaseItem: findItem,
      }))
    }
  }

  changeResponseBoxPosition = (event) => {
    const { setNumberline, graphData } = this.props
    const { numberlineAxis } = graphData
    setNumberline({ ...numberlineAxis, responseBoxPosition: event })
  }

  render() {
    const { currentRenderingBaseItem, ticksDistance } = this.state

    const {
      t,
      renderingBaseList,
      responseBoxPositionList,
      fillSections,
      cleanSections,
      graphData,
      setValidation,
      advancedAreOpen,
    } = this.props

    const { canvas, uiStyle, numberlineAxis } = graphData
    const { fractionsFormat } = numberlineAxis
    return (
      <>
        <Question
          padding="0px"
          section="advanced"
          label="Scoring"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <ScoreSettings
            scoringTypes={this.scoringTypes}
            setValidation={setValidation}
            graphData={graphData}
            advancedAreOpen={advancedAreOpen}
          />
        </Question>

        <Question
          section="advanced"
          label={t('component.graphing.display')}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.display')}`
            )}
          >
            {t('component.graphing.display')}
          </Subtitle>

          <Row gutter={24}>
            <Col md={12}>
              <Label>{t('component.graphing.layoutoptions.width')}</Label>
              <TextInputStyled
                type="text"
                name="layoutWidth"
                placeholder="0"
                value={uiStyle.layoutWidth === 0 ? null : uiStyle.layoutWidth}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t('component.graphing.layoutoptions.height')}</Label>
              <TextInputStyled
                type="text"
                name="layoutHeight"
                value={uiStyle.layoutHeight}
                onChange={this.handleInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t('component.graphing.layoutoptions.linemargin')}</Label>
              <TextInputStyled
                type="text"
                name="margin"
                placeholder="0"
                value={canvas.margin === 0 ? null : canvas.margin}
                onChange={this.handleCanvasInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>
                {t('component.graphing.layoutoptions.lineposition')}
              </Label>
              <TextInputStyled
                type="text"
                name="linePosition"
                placeholder="0"
                value={uiStyle.linePosition === 0 ? null : uiStyle.linePosition}
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>
                {t('component.graphing.layoutoptions.separationdistancex')}
              </Label>
              <TextInputStyled
                type="text"
                name="separationDistanceX"
                placeholder="0"
                value={
                  numberlineAxis.separationDistanceX === 0
                    ? null
                    : numberlineAxis.separationDistanceX
                }
                onChange={this.handleNumberlineInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>
                {t('component.graphing.layoutoptions.separationdistancey')}
              </Label>
              <TextInputStyled
                type="text"
                placeholder="0"
                name="separationDistanceY"
                value={
                  numberlineAxis.separationDistanceY === 0
                    ? null
                    : numberlineAxis.separationDistanceY
                }
                onChange={this.handleNumberlineInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>
                {t('component.graphing.layoutoptions.titleposition')}
              </Label>
              <TextInputStyled
                type="text"
                name="titlePosition"
                placeholder="0"
                value={
                  uiStyle.titlePosition === 0 ? null : uiStyle.titlePosition
                }
                onChange={this.handleOptionsInputChange}
              />
            </Col>

            <Col md={12}>
              <Label>{t('component.options.responsecontainerposition')}</Label>
              <SelectInputStyled
                data-cy="responseBoxPosition"
                style={{ width: '100%' }}
                onChange={this.changeResponseBoxPosition}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={this.getResponseBoxPositionItem().label}
              >
                {responseBoxPositionList.map((option) => (
                  <Select.Option data-cy={option.id} key={option.id}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>

            <Col md={12}>
              <FontSizeSelect
                data-cy="fontSize"
                value={uiStyle.fontSize}
                onChange={(val) => this.changeFontSize(val)}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'leftArrow',
                    numberlineAxis.leftArrow
                  )
                }
                name="leftArrow"
                data-cy="checkLeftArrow"
                checked={numberlineAxis.leftArrow}
              >
                {t('component.graphing.layoutoptions.showleftarrow')}
              </CheckboxLabel>
            </Col>

            <Col md={12}>
              <CheckboxLabel
                name="rightArrow"
                data-cy="checkRightArrow"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'rightArrow',
                    numberlineAxis.rightArrow
                  )
                }
                checked={numberlineAxis.rightArrow}
              >
                {t('component.graphing.layoutoptions.showrightarrow')}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Ticks"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.ticksoptionstitle')}`
            )}
          >
            {t('component.graphing.ticksoptionstitle')}
          </Subtitle>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t('component.graphing.ticksoptions.tickdistance')}</Label>
              <TextInputStyled
                type="text"
                name="ticksDistance"
                placeholder="1, 1/2, 1 1/2"
                onChange={this.handleTicksDistanceInputChange}
                onBlur={this.handleTicksDistanceInputBlur}
                value={ticksDistance}
              />
            </Col>
            <Col md={12}>
              <LabelWithHelper helperKey="minorTicks">
                {t('component.graphing.ticksoptions.minorTicks')}
              </LabelWithHelper>
              <TextInputStyled
                type="text"
                name="minorTicks"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.minorTicks}
              />
            </Col>
            <Col md={12}>
              <Label>{t('component.options.fractionFormat')}</Label>
              <SelectInputStyled
                style={{ width: '100%' }}
                onChange={this.changeFractionsFormat}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={fractionsFormat || FRACTION_FORMATS.decimal}
              >
                {this.getFractionFormatSettings().map((option) => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
            <Col md={12}>
              <Label>
                {t('component.graphing.ticksoptions.renderingbase')}
              </Label>
              <SelectInputStyled
                style={{ width: '100%' }}
                onChange={this.changeRenderingBase}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={currentRenderingBaseItem.label}
              >
                {renderingBaseList.map((option) => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {t(`component.options.${option.label}`)}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                name="showTicks"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'showTicks',
                    numberlineAxis.showTicks
                  )
                }
                checked={numberlineAxis.showTicks}
              >
                {t('component.graphing.ticksoptions.showticks')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showMax"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'showMax',
                    numberlineAxis.showMax
                  )
                }
                checked={numberlineAxis.showMax}
              >
                {t('component.graphing.labelsoptions.showmax')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showMin"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'showMin',
                    numberlineAxis.showMin
                  )
                }
                checked={numberlineAxis.showMin}
              >
                {t('component.graphing.labelsoptions.showmin')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="snapToTicks"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'snapToTicks',
                    numberlineAxis.snapToTicks
                  )
                }
                checked={numberlineAxis.snapToTicks}
              >
                {t('component.graphing.ticksoptions.snaptoticks')}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Labels"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.labelstitle')}`
            )}
          >
            {t('component.graphing.labelstitle')}
          </Subtitle>

          <Row gutter={24}>
            <Col md={12}>
              <Label>{t('component.graphing.labelsoptions.frequency')}</Label>
              <TextInputStyled
                value={
                  numberlineAxis.labelsFrequency === 0
                    ? null
                    : numberlineAxis.labelsFrequency
                }
                onChange={this.handleNumberlineInputChange}
                name="labelsFrequency"
                type="number"
              />
            </Col>
            <Col md={12}>
              <Label>
                {t('component.graphing.labelsoptions.displayspecificpoints')}
              </Label>
              <TextInputStyled
                type="text"
                name="specificPoints"
                onChange={this.handleNumberlineInputChange}
                value={numberlineAxis.specificPoints}
              />
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showLabels"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'showLabels',
                    numberlineAxis.showLabels
                  )
                }
                checked={numberlineAxis.showLabels}
              >
                {t('component.graphing.labelsoptions.showLabels')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="labelShowMin"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'labelShowMin',
                    numberlineAxis.labelShowMin
                  )
                }
                checked={numberlineAxis.labelShowMin}
              >
                {t('component.graphing.labelsoptions.showmin')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="labelShowMax"
                onChange={() =>
                  this.handleNumberlineCheckboxChange(
                    'labelShowMax',
                    numberlineAxis.labelShowMax
                  )
                }
                checked={numberlineAxis.labelShowMax}
              >
                {t('component.graphing.labelsoptions.showmax')}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        <Extras
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
        />
      </>
    )
  }
}

AxisLabelsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  renderingBaseList: PropTypes.array.isRequired,
  responseBoxPositionList: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
}

AxisLabelsMoreOptions.defaultProps = {
  advancedAreOpen: false,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(AxisLabelsMoreOptions)
