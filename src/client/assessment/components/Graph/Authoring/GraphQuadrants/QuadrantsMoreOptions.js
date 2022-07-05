import {
  getFormattedAttrId,
  TextInputStyled,
  CustomModalStyled,
  beforeUpload,
  notification,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { evaluationType, aws } from '@edulastic/constants'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { compose } from 'redux'
import { isNaN, isEqual, isEmpty } from 'lodash'
import { AnnotationSettings, ScoreSettings } from '..'
import Extras from '../../../../containers/Extras'
import { CheckboxLabel } from '../../../../styled/CheckboxWithLabel'
import { CustomStyleBtn } from '../../../../styled/ButtonStyles'
import { ColumnLabel } from '../../../../styled/Grid'
import { Subtitle } from '../../../../styled/Subtitle'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'
import { Row } from '../../../../styled/WidgetOptions/Row'
import Question from '../../../Question'
import Tools from '../../common/Tools'
import GraphToolsParams from '../../components/GraphToolsParams'
import RadiansDropdown from '../../components/RadiansDropdown'
import RadianInput from '../../components/RadianInput'
import { calcDistance, isValidMinMax } from '../../common/utils'
import { uploadToS3 } from '../../../../../author/src/utils/upload'
import {
  UploadButton,
  GridSettingHelpText,
} from '../../common/styled_components'
import FontSizeSelect from '../../../FontSizeSelect'
import { CONSTANT } from '../../Builder/config'

const types = [evaluationType.exactMatch, evaluationType.partialMatch]

const gridOpts = [
  'xMin',
  'xMax',
  'xDistance',
  'yMin',
  'yMax',
  'yDistance',
  'layoutWidth',
  'layoutHeight',
]
class QuadrantsMoreOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.graphData.canvas,
      ...props.graphData.uiStyle,
      changedCertainOpts: false,
      showConfirmModal: false,
    }
    this.reg = new RegExp('^[-.0-9]+$')
  }

  componentDidUpdate(prevProps) {
    const {
      graphData: { canvas, uiStyle },
    } = this.props

    if (
      prevProps.graphData &&
      (!isEqual(canvas, prevProps.graphData.canvas) ||
        !isEqual(uiStyle, prevProps.graphData.uiStyle))
    ) {
      this.updateState()
    }
  }

  updateState() {
    const {
      graphData: { canvas, uiStyle },
    } = this.props
    // uiStyle doesn't have xRadians and yRadians at first time
    // need to distract them
    const { xRadians, yRadians } = uiStyle
    this.setState({
      ...canvas,
      ...uiStyle,
      xRadians,
      yRadians,
      changedCertainOpts: false,
      showConfirmModal: false,
    })
  }

  checkElements = () => {
    const { graphData } = this.props
    const { background_shapes, validation } = graphData

    const hasElements =
      !isEmpty(background_shapes) ||
      !isEmpty(validation.validResponse.value) ||
      validation.altResponses.some((alt) => !isEmpty(alt.value))

    return hasElements
  }

  checkGridSettings = () => {
    const {
      graphData: { uiStyle },
    } = this.props
    const { layoutWidth, layoutHeight } = uiStyle
    const { yMax, yMin, xMax, xMin, xDistance, yDistance } = this.state

    let xGirdDistance =
      (Math.abs(xMin) +
        Math.abs(xDistance) +
        Math.abs(xMax) +
        Math.abs(xDistance)) /
      xDistance
    xGirdDistance = parseFloat(layoutWidth) / xGirdDistance
    xGirdDistance *= Math.abs(xMin) / xDistance + 1

    let yGirdDistance =
      (Math.abs(yMax) +
        Math.abs(yDistance) +
        Math.abs(yMin) +
        Math.abs(yDistance)) /
      yDistance
    yGirdDistance = parseFloat(layoutHeight) / yGirdDistance
    yGirdDistance *= Math.abs(yMin) / yDistance + 1

    return xGirdDistance < 28 || yGirdDistance < 28
  }

  handleGridChange = (event) => {
    const { name, value } = event.target
    if (
      name !== 'xAxisLabel' &&
      name !== 'yAxisLabel' &&
      (value === '' || this.reg.test(value))
    ) {
      this.setState({ [name]: value, changedCertainOpts: true })
    } else if (name === 'xAxisLabel' || name === 'yAxisLabel') {
      this.setState({ [name]: value })
    }
  }

  handleMinMaxChange = (event) => {
    const { value, name } = event.target
    if (!this.reg.test(value) && value !== '') {
      return
    }

    const {
      graphData: {
        uiStyle: { xRadians, yRadians },
      },
    } = this.props

    const { xMin, xMax, yMin, yMax } = this.state
    let { xDistance, yDistance, xTickDistance, yTickDistance } = this.state
    if (name === 'xMin' && !xRadians) {
      xDistance = calcDistance(value, xMax)
    }
    if (name === 'xMax' && !xRadians) {
      xDistance = calcDistance(xMin, value)
    }
    if (name === 'yMin' && !yRadians) {
      yDistance = calcDistance(value, yMax)
    }
    if (name === 'yMax' && !yRadians) {
      yDistance = calcDistance(yMin, value)
    }

    if (isNaN(xDistance)) {
      xDistance = 1
    }
    if (isNaN(yDistance)) {
      yDistance = 1
    }

    xTickDistance = xDistance
    yTickDistance = yDistance

    this.setState({
      [name]: value,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance,
      changedCertainOpts: true,
    })
  }

  handleCertainOptsBlur = (evt) => {
    const { xMin, xMax, yMin, yMax, changedCertainOpts } = this.state
    const { name, value } = evt.target
    if (isNaN(parseFloat(value))) {
      return this.updateState()
    }
    if (
      (name === 'xMin' && !isValidMinMax(value, xMax)) ||
      (name === 'xMax' && !isValidMinMax(xMin, value)) ||
      (name === 'yMin' && !isValidMinMax(value, yMax)) ||
      (name === 'yMax' && !isValidMinMax(yMin, value))
    ) {
      this.updateState()
      return
    }
    if (gridOpts.includes(evt.target.name) && changedCertainOpts) {
      const hasElements = this.checkElements()

      if (hasElements && changedCertainOpts) {
        this.setState({ showConfirmModal: true })
      } else {
        this.handleConfirmOptsChanges()
      }
    }
  }

  handleChangeRadians = (name, value) => {
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData

    const hasElements = this.checkElements()
    const newState = { [name]: value }

    if (value && name === 'xRadians') {
      newState.xDistance = 1
      newState.xTickDistance = 1
    }

    if (value && name === 'yRadians') {
      newState.yDistance = 1
      newState.yTickDistance = 1
    }

    if (hasElements) {
      this.setState({ ...newState, showConfirmModal: true })
    } else {
      setOptions({ ...uiStyle, ...newState })
    }
  }

  isQuadrantsPlacement = () => {
    const { graphData } = this.props
    const { graphType } = graphData
    return graphType === 'quadrantsPlacement'
  }

  handleCheckbox = (name, checked) => {
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData
    setOptions({ ...uiStyle, [name]: !checked })
  }

  handleInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData

    if (
      event.target.name === 'xDistance' ||
      event.target.name === 'xTickDistance' ||
      event.target.name === 'yDistance' ||
      event.target.name === 'yTickDistance'
    ) {
      const _value = parseFloat(value)
      if (!isNaN(_value)) {
        setOptions({ ...uiStyle, [name]: Math.abs(_value) })
        this.setState({ [name]: Math.abs(_value) })
      } else {
        this.setState({ [name]: uiStyle[name] })
      }
    } else {
      setOptions({ ...uiStyle, [name]: value })
    }
  }

  handleSelect = (name, value) => {
    const { graphData, setOptions } = this.props
    const { uiStyle } = graphData
    setOptions({ ...uiStyle, [name]: value })
  }

  handleBgImgCheckbox = (name, checked) => {
    const { graphData, setBgImg } = this.props
    const { backgroundImage } = graphData
    setBgImg({ ...backgroundImage, [name]: !checked })
  }

  handleBgImgInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    const { graphData, setBgImg } = this.props
    const { backgroundImage } = graphData
    setBgImg({ ...backgroundImage, [name]: value })
  }

  allControls = [
    CONSTANT.TOOLS.EDIT_LABEL,
    CONSTANT.TOOLS.UNDO,
    CONSTANT.TOOLS.REDO,
    CONSTANT.TOOLS.RESET,
    CONSTANT.TOOLS.DELETE,
  ]

  onSelectControl = (control) => {
    const { graphData, setControls } = this.props
    const { controlbar } = graphData

    let newControls = [...controlbar.controls]
    if (newControls.includes(control)) {
      newControls = newControls.filter((item) => item !== control)
    } else {
      newControls.push(control)
    }

    setControls({
      ...controlbar,
      controls: [
        ...this.allControls.filter((item) => newControls.includes(item)),
      ],
    })
  }

  handleConfirmOptsChanges = () => {
    const {
      xMin,
      xMax,
      yMin,
      yMax,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance,
      xRadians,
      yRadians,
    } = this.state
    const { graphData, setCanvas } = this.props
    const { uiStyle, canvas } = graphData

    this.setState(
      { changedCertainOpts: false, showConfirmModal: false },
      () => {
        if (
          !isNaN(parseFloat(xMin)) &&
          !isNaN(parseFloat(xMax)) &&
          !isNaN(parseFloat(yMin)) &&
          !isNaN(parseFloat(yMax)) &&
          !isNaN(parseFloat(xDistance)) &&
          !isNaN(parseFloat(yDistance)) &&
          !isNaN(parseFloat(xTickDistance)) &&
          !isNaN(parseFloat(yTickDistance))
        ) {
          const newCanvas = {
            ...canvas,
            xMin,
            xMax,
            yMin,
            yMax,
          }
          const newUiStyle = {
            ...uiStyle,
            xDistance,
            yDistance,
            xTickDistance,
            yTickDistance,
            xRadians,
            yRadians,
          }
          setCanvas(newCanvas, newUiStyle, true)
        }
      }
    )
  }

  handleCancelOptsChanges = () => {
    this.updateState()
  }

  handleBackgroundImageUpload = async (fileInfo) => {
    const { t, graphData, setBgImg } = this.props
    const { backgroundImage } = graphData
    try {
      const { file } = fileInfo
      if (!beforeUpload(file)) {
        return
      }
      const imageUrl = await uploadToS3(file, aws.s3Folders.DEFAULT)
      setBgImg({ ...backgroundImage, src: imageUrl })
      notification({
        type: 'success',
        msg: `${fileInfo.file.name} ${t(
          'component.graphing.background_options.fileUploadedSuccessfully'
        )}.`,
      })
    } catch (e) {
      console.log(e)
      // eslint-disable-next-line no-undef
      notification({
        msg: `${fileInfo.file.name} ${t(
          'component.graphing.background_options.fileUploadFailed'
        )}.`,
      })
    }
  }

  render() {
    const {
      t,
      graphData,
      fillSections,
      cleanSections,
      setToolbar,
      setAnnotation,
      setValidation,
      advancedAreOpen,
      changeLabel,
    } = this.props

    const {
      uiStyle,
      backgroundImage,
      controlbar,
      annotation,
      toolbar,
    } = graphData

    const {
      drawLabelZero,
      displayPositionOnHover,
      displayPositionPoint = true,
      fontSize,
      xShowAxisLabel,
      xHideTicks,
      xDrawLabel,
      xMaxArrow,
      xMinArrow,
      xCommaInLabel,
      yShowAxisLabel,
      yHideTicks,
      yDrawLabel,
      yMaxArrow,
      yMinArrow,
      yCommaInLabel,
      layoutWidth,
      layoutHeight,
      layoutMargin,
      layoutSnapto,
      xShowAxis = true,
      yShowAxis = true,
      showGrid = true,
    } = uiStyle

    const {
      yMax,
      yMin,
      xMax,
      xMin,
      xAxisLabel,
      yAxisLabel,
      xDistance,
      yDistance,
      xTickDistance,
      yTickDistance,
      showConfirmModal,
      xRadians,
      yRadians,
    } = this.state

    const gridWillCutOff = this.checkGridSettings()

    return (
      <>
        {!this.isQuadrantsPlacement() && (
          <Question
            section="main"
            label={t('component.graphing.studentInteraction')}
            cleanSections={cleanSections}
            fillSections={fillSections}
            advancedAreOpen
          >
            <Subtitle
              id={getFormattedAttrId(
                `${graphData?.title}-${t(
                  'component.graphing.studentInteraction'
                )}`
              )}
            >
              {t('component.graphing.studentInteraction')}
            </Subtitle>
            <GraphToolsParams
              toolbar={toolbar}
              setToolbar={setToolbar}
              changeLabel={changeLabel}
            />
          </Question>
        )}
        <Question
          padding="0px"
          section="advanced"
          label="Scoring"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <ScoreSettings
            scoringTypes={types}
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
                defaultValue="600"
                name="layoutWidth"
                value={layoutWidth}
                onChange={this.handleInputChange}
                data-cy="width"
              />
            </Col>
            <Col md={12}>
              <Label>{t('component.graphing.layoutoptions.height')}</Label>
              <TextInputStyled
                type="text"
                defaultValue="600"
                name="layoutHeight"
                value={layoutHeight}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t('component.graphing.layoutoptions.margin')}</Label>
              <TextInputStyled
                type="text"
                defaultValue="0"
                name="layoutMargin"
                value={layoutMargin}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={12}>
              <FontSizeSelect
                data-cy="fontSize"
                value={fontSize}
                onChange={(val) => {
                  this.handleSelect('fontSize', val)
                }}
              />
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="showGrid"
                onChange={() => this.handleCheckbox('showGrid', showGrid)}
                checked={showGrid}
                textTransform="uppercase"
              >
                {t('component.graphing.grid_options.show_grid')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="displayPositionOnHover"
                onChange={() =>
                  this.handleCheckbox(
                    'displayPositionOnHover',
                    displayPositionOnHover
                  )
                }
                checked={displayPositionOnHover}
                textTransform="uppercase"
              >
                {t('component.graphing.layoutoptions.displayPositionOnHover')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() =>
                  this.handleCheckbox('drawLabelZero', drawLabelZero)
                }
                checked={drawLabelZero}
                textTransform="uppercase"
              >
                {t('component.graphing.layoutoptions.drawLabelzero')}
              </CheckboxLabel>
            </Col>
            <Col md={12}>
              <CheckboxLabel
                name="layoutSnapto"
                onChange={() =>
                  this.handleCheckbox('layoutSnapto', layoutSnapto)
                }
                checked={layoutSnapto}
                textTransform="uppercase"
              >
                {t('component.graphing.layoutoptions.snapToGrid')}
              </CheckboxLabel>
            </Col>
            {this.isQuadrantsPlacement() && (
              <Col md={24}>
                <CheckboxLabel
                  name="displayPositionPoint"
                  onChange={() =>
                    this.handleCheckbox(
                      'displayPositionPoint',
                      displayPositionPoint
                    )
                  }
                  checked={displayPositionPoint}
                  textTransform="uppercase"
                >
                  {t('component.graphing.layoutoptions.displayPositionPoint')}
                </CheckboxLabel>
              </Col>
            )}
          </Row>
        </Question>

        <Question
          section="advanced"
          label="Grid"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.grid_options.grid')}`
            )}
          >
            {t('component.graphing.grid_options.grid')}
          </Subtitle>
          <Row gutter={4} type="flex" align="middle">
            <Col md={11} marginBottom="0px">
              <Row type="flex" align="middle">
                <Col align="center" md={4} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.axes')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={6} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.min')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={6} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.max')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={4} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.distance')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={4} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.tick_distance')}
                  </ColumnLabel>
                </Col>
              </Row>
            </Col>
            <Col md={13} marginBottom="0px">
              <Row type="flex" align="middle" justify="space-between">
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.show_axis')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.show_label')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.hide_ticks')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.min_arrow')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.max_arrow')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.comma_in_label')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.draw_label')}
                  </ColumnLabel>
                </Col>
                <Col align="center" md={3} marginBottom="6px">
                  <ColumnLabel>
                    {t('component.graphing.grid_options.use_radians')}
                  </ColumnLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row center gutter={4} mb="4">
            <Col md={11} marginBottom="0px">
              <Col md={4} marginBottom="0px">
                <TextInputStyled
                  type="text"
                  defaultValue="X"
                  name="xAxisLabel"
                  value={xAxisLabel}
                  align="center"
                  padding="0px 4px"
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                />
              </Col>
              <Col md={6} marginBottom="0px">
                {xRadians ? (
                  <RadianInput
                    name="xMin"
                    value={xMin}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                  />
                ) : (
                  <TextInputStyled
                    type="text"
                    name="xMin"
                    value={xMin}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                    align="center"
                    padding="0px 4px"
                  />
                )}
              </Col>
              <Col md={6} marginBottom="0px">
                {xRadians ? (
                  <RadianInput
                    name="xMax"
                    value={xMax}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                  />
                ) : (
                  <TextInputStyled
                    type="text"
                    name="xMax"
                    value={xMax}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                    align="center"
                    padding="0px 4px"
                  />
                )}
              </Col>
              <Col md={4} marginBottom="0px">
                {xRadians && (
                  <RadiansDropdown
                    name="xDistance"
                    value={xDistance}
                    onSelect={(val) =>
                      this.handleChangeRadians('xDistance', val)
                    }
                  />
                )}
                {!xRadians && (
                  <TextInputStyled
                    type="text"
                    defaultValue="1"
                    min={0}
                    name="xDistance"
                    value={xDistance}
                    onChange={this.handleGridChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                  />
                )}
              </Col>
              <Col md={4} marginBottom="0px">
                {xRadians && (
                  <RadiansDropdown
                    name="xTickDistance"
                    value={xTickDistance}
                    onSelect={(val) =>
                      this.handleChangeRadians('xTickDistance', val)
                    }
                  />
                )}
                {!xRadians && (
                  <TextInputStyled
                    type="text"
                    defaultValue="1"
                    min={0}
                    name="xTickDistance"
                    value={xTickDistance}
                    onChange={this.handleGridChange}
                    onBlur={this.handleInputChange}
                    disabled={false}
                    height="35px"
                  />
                )}
              </Col>
            </Col>
            <Col md={13} marginBottom="0px">
              <Row type="flex" justify="space-between">
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="xShowAxis"
                    onChange={() => this.handleCheckbox('xShowAxis', xShowAxis)}
                    checked={xShowAxis}
                    data-cy="xShowAxis"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('xShowAxisLabel', xShowAxisLabel)
                    }
                    checked={xShowAxisLabel}
                    data-cy="xShowAxisLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('xHideTicks', xHideTicks)
                    }
                    checked={xHideTicks}
                    data-cy="xHideTicks"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox('xMinArrow', xMinArrow)}
                    checked={xMinArrow}
                    data-cy="xMinArrow"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox('xMaxArrow', xMaxArrow)}
                    checked={xMaxArrow}
                    data-cy="xMaxArrow"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('xCommaInLabel', xCommaInLabel)
                    }
                    checked={xCommaInLabel}
                    data-cy="xCommaInLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('xDrawLabel', xDrawLabel)
                    }
                    checked={xDrawLabel}
                    data-cy="xDrawLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="xRadians"
                    onChange={() =>
                      this.handleChangeRadians('xRadians', !xRadians)
                    }
                    checked={xRadians}
                    data-cy="xRadians"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row center gutter={4} mb="0">
            <Col md={11} marginBottom="0px">
              <Col md={4} marginBottom="0px">
                <TextInputStyled
                  type="text"
                  defaultValue="X"
                  name="yAxisLabel"
                  value={yAxisLabel}
                  onChange={this.handleGridChange}
                  onBlur={this.handleInputChange}
                  disabled={false}
                  align="center"
                  padding="0px 4px"
                />
              </Col>
              <Col md={6} marginBottom="0px">
                {yRadians ? (
                  <RadianInput
                    name="yMin"
                    value={yMin}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                  />
                ) : (
                  <TextInputStyled
                    type="text"
                    name="yMin"
                    value={yMin}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                    align="center"
                    padding="0px 4px"
                  />
                )}
              </Col>
              <Col md={6} marginBottom="0px">
                {yRadians ? (
                  <RadianInput
                    name="yMax"
                    value={yMax}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                  />
                ) : (
                  <TextInputStyled
                    type="text"
                    name="yMax"
                    value={yMax}
                    onChange={this.handleMinMaxChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                    align="center"
                    padding="0px 4px"
                  />
                )}
              </Col>
              <Col md={4} marginBottom="0px">
                {yRadians && (
                  <RadiansDropdown
                    name="yDistance"
                    value={yDistance}
                    onSelect={(val) =>
                      this.handleChangeRadians('yDistance', val)
                    }
                  />
                )}
                {!yRadians && (
                  <TextInputStyled
                    type="text"
                    defaultValue="1"
                    min={0}
                    name="yDistance"
                    value={yDistance}
                    onChange={this.handleGridChange}
                    onBlur={this.handleCertainOptsBlur}
                    disabled={false}
                    height="35px"
                  />
                )}
              </Col>
              <Col md={4} marginBottom="0px">
                {yRadians && (
                  <RadiansDropdown
                    name="yTickDistance"
                    value={yTickDistance}
                    onSelect={(val) =>
                      this.handleChangeRadians('yTickDistance', val)
                    }
                  />
                )}
                {!yRadians && (
                  <TextInputStyled
                    type="text"
                    defaultValue="1"
                    min={0}
                    name="yTickDistance"
                    value={yTickDistance}
                    onChange={this.handleGridChange}
                    onBlur={this.handleInputChange}
                    disabled={false}
                    height="32px"
                  />
                )}
              </Col>
            </Col>
            <Col md={13} marginBottom="0px">
              <Row type="flex" justify="space-between">
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="yShowAxis"
                    onChange={() => this.handleCheckbox('yShowAxis', yShowAxis)}
                    checked={yShowAxis}
                    data-cy="yShowAxis"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('yShowAxisLabel', yShowAxisLabel)
                    }
                    checked={yShowAxisLabel}
                    data-cy="yShowAxisLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('yHideTicks', yHideTicks)
                    }
                    checked={yHideTicks}
                    data-cy="yHideTicks"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox('yMinArrow', yMinArrow)}
                    checked={yMinArrow}
                    data-cy="yMinArrow"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() => this.handleCheckbox('yMaxArrow', yMaxArrow)}
                    checked={yMaxArrow}
                    data-cy="yMaxArrow"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('yCommaInLabel', yCommaInLabel)
                    }
                    checked={yCommaInLabel}
                    data-cy="yCommaInLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="drawLabelZero"
                    onChange={() =>
                      this.handleCheckbox('yDrawLabel', yDrawLabel)
                    }
                    checked={yDrawLabel}
                    data-cy="yDrawLabel"
                  />
                </Col>
                <Col align="center" md={3} style={{ marginBottom: '0' }}>
                  <CheckboxLabel
                    name="yRadians"
                    onChange={() =>
                      this.handleChangeRadians('yRadians', !yRadians)
                    }
                    checked={yRadians}
                    data-cy="yRadians"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {gridWillCutOff && (
            <Row>
              <Col md={11} marginBottom="0px">
                <GridSettingHelpText>
                  {t('component.graphing.settingsPopup.gridCutoff')}
                </GridSettingHelpText>
              </Col>
            </Row>
          )}
        </Question>

        <Question
          section="advanced"
          label={t('component.graphing.graphControls')}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.graphControls')}`
            )}
          >
            {t('component.graphing.graphControls')}
          </Subtitle>
          <Tools
            toolsAreVisible={false}
            controls={this.allControls}
            selected={controlbar.controls}
            onSelectControl={this.onSelectControl}
          />
        </Question>

        <Question
          section="advanced"
          label="Labels"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <AnnotationSettings
            title={graphData?.title}
            annotation={annotation}
            setAnnotation={setAnnotation}
          />
        </Question>

        <Question
          section="advanced"
          label="Background Image"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        >
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t(
                'component.graphing.background_options.background_image'
              )}`
            )}
          >
            {t('component.graphing.background_options.background_image')}
          </Subtitle>
          <Row gutter={24}>
            <Col md={24}>
              <Label>
                {t('component.graphing.background_options.image_url')}
              </Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="src"
                value={backgroundImage.src}
                onChange={this.handleBgImgInputChange}
                data-cy="imageUrl"
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={8}>
              <Label>OR</Label>
              <UploadButton
                beforeUpload={() => false}
                onChange={this.handleBackgroundImageUpload}
                accept="image/*"
                multiple={false}
                showUploadList={false}
              >
                <CustomStyleBtn>
                  {t('component.graphing.background_options.uploadImage')}
                </CustomStyleBtn>
              </UploadButton>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t('component.graphing.background_options.height')}</Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="height"
                value={backgroundImage.height}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>{t('component.graphing.background_options.width')}</Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="width"
                value={backgroundImage.width}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col md={12}>
              <Label>
                {t(
                  'component.graphing.background_options.x_axis_image_position'
                )}
              </Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="x"
                value={backgroundImage.x}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12}>
              <Label>
                {t(
                  'component.graphing.background_options.y_axis_image_position'
                )}
              </Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="y"
                value={backgroundImage.y}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
          </Row>

          <Row gutter={24} type="flex" align="middle">
            <Col md={12}>
              <Label>
                {t('component.graphing.background_options.opacity')}
              </Label>
              <TextInputStyled
                type="text"
                defaultValue=""
                name="opacity"
                value={backgroundImage.opacity}
                onChange={this.handleBgImgInputChange}
              />
            </Col>
            <Col md={12} marginBottom="0px">
              <CheckboxLabel
                name="showShapePoints"
                onChange={() =>
                  this.handleBgImgCheckbox(
                    'showShapePoints',
                    backgroundImage.showShapePoints
                  )
                }
                checked={backgroundImage.showShapePoints}
              >
                {t(
                  'component.graphing.background_options.show_bg_shape_points'
                )}
              </CheckboxLabel>
            </Col>
          </Row>
        </Question>

        {showConfirmModal && (
          <CustomModalStyled
            centered
            visible={showConfirmModal}
            title="Warning"
            okText="Confirm"
            onOk={this.handleConfirmOptsChanges}
            onCancel={this.handleCancelOptsChanges}
          >
            The graphing objects will no longer fall on the updated grid, and
            you will need to recreate them. Please confirm?
          </CustomModalStyled>
        )}
        <Extras
          fillSections={fillSections}
          cleanSections={cleanSections}
          advancedAreOpen={advancedAreOpen}
        />
      </>
    )
  }
}

QuadrantsMoreOptions.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setOptions: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setBgImg: PropTypes.func.isRequired,
  setControls: PropTypes.func.isRequired,
  setToolbar: PropTypes.func.isRequired,
  setAnnotation: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
}

QuadrantsMoreOptions.defaultProps = {
  advancedAreOpen: false,
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(QuadrantsMoreOptions)
