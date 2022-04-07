import {
  getFormattedAttrId,
  TextInputStyled,
  SelectInputStyled,
  beforeUpload,
  notification,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { aws, evaluationType } from '@edulastic/constants'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { isNaN, isEqual } from 'lodash'
import { AnnotationSettings, ScoreSettings } from '..'
import Extras from '../../../../containers/Extras'
import { CheckboxLabel } from '../../../../styled/CheckboxWithLabel'
import { CustomStyleBtn } from '../../../../styled/ButtonStyles'
import { Subtitle } from '../../../../styled/Subtitle'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'
import { Row } from '../../../../styled/WidgetOptions/Row'
import Question from '../../../Question'
import Tools from '../../common/Tools'
import GraphToolsParams from '../../components/GraphToolsParams'
import { uploadToS3 } from '../../../../../author/src/utils/upload'
import { UploadButton } from '../../common/styled_components'
import { fontSizeList } from '../constants/options'
import { ALL_CONTROLS } from '../../Builder/config'
import GridOptions from './GridOptions'

const types = [evaluationType.exactMatch, evaluationType.partialMatch]

class QuadrantsMoreOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.graphData.canvas,
      ...props.graphData.uiStyle,
    }
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

    this.setState({
      ...canvas,
      ...uiStyle,
    })
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
      controls: [...ALL_CONTROLS.filter((item) => newControls.includes(item))],
    })
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
      setOptions,
      setCanvas,
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
      layoutWidth,
      layoutHeight,
      layoutMargin,
      layoutSnapto,
      showGrid = true,
      gridType,
    } = uiStyle

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
              <Label>{t('component.graphing.layoutoptions.fontSize')}</Label>
              <SelectInputStyled
                size="large"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={(val) => this.handleSelect('fontSize', val)}
                value={fontSize}
                data-cy="fontSize"
                style={{ width: '100%' }}
              >
                {fontSizeList.map((option) => (
                  <Select.Option data-cy={option.id} key={option.value}>
                    {t(`component.options.${option.label}`)}
                  </Select.Option>
                ))}
              </SelectInputStyled>
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

        <GridOptions
          gridType={gridType}
          graphData={graphData}
          setOptions={setOptions}
          setCanvas={setCanvas}
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen={advancedAreOpen}
        />

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
            controls={ALL_CONTROLS}
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

export default withNamespaces('assessment')(QuadrantsMoreOptions)
