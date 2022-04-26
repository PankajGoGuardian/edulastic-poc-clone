import React, { useMemo, useState, useEffect } from 'react'
import { isNaN, isEmpty } from 'lodash'
import { CustomModalStyled, TextInputStyled } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ColumnLabel } from '../../../../../styled/Grid'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Row } from '../../../../../styled/WidgetOptions/Row'
import RadianInput from '../../../components/RadianInput'
import { CheckboxLabel } from '../../../../../styled/CheckboxWithLabel'
import RadiansDropdown from '../../../components/RadiansDropdown'
import { GridSettingHelpText } from '../../../common/styled_components'
import { calcDistance, isValidMinMax } from '../../../common/utils'

const numReg = new RegExp('^[-.0-9]+$')

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

const CartesianGridOptions = ({ t, graphData, setOptions, setCanvas }) => {
  const [options, updateOptions] = useState({})

  const {
    xMin,
    xMax,
    yMin,
    yMax,
    xShowAxis = true,
    xAxisLabel,
    xRadians,
    xDistance,
    xTickDistance,
    xShowAxisLabel,
    xHideTicks,
    xMinArrow,
    xMaxArrow,
    xCommaInLabel,
    xDrawLabel,
    yAxisLabel,
    yRadians,
    yDistance,
    yTickDistance,
    yShowAxis = true,
    yShowAxisLabel,
    yHideTicks,
    yMinArrow,
    yMaxArrow,
    yCommaInLabel,
    yDrawLabel,
    changedCertainOpts,
    showConfirmModal,
  } = options

  const gridWillCutOff = useMemo(() => {
    const { layoutWidth, layoutHeight } = options

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
  }, [options])

  const updateOtpsFromProps = () => {
    // uiStyle doesn't have xRadians and yRadians at first time
    // need to distract them
    updateOptions({
      ...graphData.canvas,
      ...graphData.uiStyle,
      xRadians: graphData.uiStyle.xRadians,
      yRadians: graphData.uiStyle.yRadians,
      changedCertainOpts: false,
      showConfirmModal: false,
    })
  }

  useEffect(updateOtpsFromProps, [graphData])

  const checkElements = () => {
    const { background_shapes, validation } = graphData

    const hasElements =
      !isEmpty(background_shapes) ||
      !isEmpty(validation.validResponse.value) ||
      validation.altResponses.some((alt) => !isEmpty(alt.value))

    return hasElements
  }

  const handleGridChange = (event) => {
    const { name, value } = event.target
    if (
      name !== 'xAxisLabel' &&
      name !== 'yAxisLabel' &&
      (value === '' || numReg.test(value))
    ) {
      updateOptions({ ...options, [name]: value, changedCertainOpts: true })
    } else if (name === 'xAxisLabel' || name === 'yAxisLabel') {
      updateOptions({ ...options, [name]: value })
    }
  }

  const handleInputChange = (event) => {
    const {
      target: { name, value },
    } = event

    if (
      event.target.name === 'xDistance' ||
      event.target.name === 'xTickDistance' ||
      event.target.name === 'yDistance' ||
      event.target.name === 'yTickDistance'
    ) {
      const _value = parseFloat(value)
      if (!isNaN(_value)) {
        setOptions({ ...graphData.uiStyle, [name]: Math.abs(_value) })
        updateOptions({ [name]: Math.abs(_value) })
      } else {
        updateOptions({ [name]: options[name] })
      }
    } else {
      setOptions({ ...options, [name]: value })
    }
  }

  const handleCheckbox = (name, checked) => {
    setOptions({ ...graphData.uiStyle, [name]: !checked })
  }

  const handleMinMaxChange = (event) => {
    const { value, name } = event.target
    if (!numReg.test(value) && value !== '') {
      return
    }

    let { xDistance: _xDistance, yDistance: _yDistance } = options
    if (name === 'xMin' && !xRadians) {
      _xDistance = calcDistance(value, xMax)
    }
    if (name === 'xMax' && !xRadians) {
      _xDistance = calcDistance(xMin, value)
    }
    if (name === 'yMin' && !yRadians) {
      _yDistance = calcDistance(value, yMax)
    }
    if (name === 'yMax' && !yRadians) {
      _yDistance = calcDistance(yMin, value)
    }

    if (isNaN(_xDistance)) {
      _xDistance = 1
    }
    if (isNaN(_yDistance)) {
      _yDistance = 1
    }

    updateOptions({
      ...options,
      [name]: value,
      xDistance: _xDistance,
      yDistance: _yDistance,
      xTickDistance: _xDistance,
      yTickDistance: _yDistance,
      changedCertainOpts: true,
    })
  }

  const handleConfirmOptsChanges = () => {
    updateOptions({
      ...options,
      changedCertainOpts: false,
      showConfirmModal: false,
    })
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
        ...graphData.canvas,
        xMin,
        xMax,
        yMin,
        yMax,
      }
      const newUiStyle = {
        ...graphData.uiStyle,
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

  const handleCertainOptsBlur = (evt) => {
    const { name, value } = evt.target

    if (
      (name === 'xMin' && !isValidMinMax(value, xMax)) ||
      (name === 'xMax' && !isValidMinMax(xMin, value)) ||
      (name === 'yMin' && !isValidMinMax(value, yMax)) ||
      (name === 'yMax' && !isValidMinMax(yMin, value))
    ) {
      return updateOtpsFromProps()
    }
    if (gridOpts.includes(evt.target.name) && changedCertainOpts) {
      if (checkElements() && changedCertainOpts) {
        updateOptions({ ...options, showConfirmModal: true })
      } else {
        handleConfirmOptsChanges()
      }
    }
  }

  const handleChangeRadians = (name, value) => {
    const { uiStyle } = graphData

    const hasElements = checkElements()
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
      updateOptions({ ...options, ...newState, showConfirmModal: true })
    } else {
      setOptions({ ...uiStyle, ...newState })
    }
  }

  return (
    <>
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
              onChange={handleGridChange}
              onBlur={handleInputChange}
              disabled={false}
            />
          </Col>
          <Col md={6} marginBottom="0px">
            {xRadians ? (
              <RadianInput
                name="xMin"
                value={xMin}
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
              />
            ) : (
              <TextInputStyled
                type="text"
                name="xMin"
                value={xMin}
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
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
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
              />
            ) : (
              <TextInputStyled
                type="text"
                name="xMax"
                value={xMax}
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
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
                onSelect={(val) => handleChangeRadians('xDistance', val)}
              />
            )}
            {!xRadians && (
              <TextInputStyled
                type="text"
                defaultValue="1"
                min={0}
                name="xDistance"
                value={xDistance}
                onChange={handleGridChange}
                onBlur={handleCertainOptsBlur}
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
                onSelect={(val) => handleChangeRadians('xTickDistance', val)}
              />
            )}
            {!xRadians && (
              <TextInputStyled
                type="text"
                defaultValue="1"
                min={0}
                name="xTickDistance"
                value={xTickDistance}
                onChange={handleGridChange}
                onBlur={handleCertainOptsBlur}
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
                checked={xShowAxis}
                onChange={() => handleCheckbox('xShowAxis', xShowAxis)}
                data-cy="xShowAxis"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                checked={xShowAxisLabel}
                onChange={() =>
                  handleCheckbox('xShowAxisLabel', xShowAxisLabel)
                }
                data-cy="xShowAxisLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('xHideTicks', xHideTicks)}
                checked={xHideTicks}
                data-cy="xHideTicks"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('xMinArrow', xMinArrow)}
                checked={xMinArrow}
                data-cy="xMinArrow"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('xMaxArrow', xMaxArrow)}
                checked={xMaxArrow}
                data-cy="xMaxArrow"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('xCommaInLabel', xCommaInLabel)}
                checked={xCommaInLabel}
                data-cy="xCommaInLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('xDrawLabel', xDrawLabel)}
                checked={xDrawLabel}
                data-cy="xDrawLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="xRadians"
                onChange={() => handleChangeRadians('xRadians', !xRadians)}
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
              onChange={handleGridChange}
              onBlur={handleInputChange}
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
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
              />
            ) : (
              <TextInputStyled
                type="text"
                name="yMin"
                value={yMin}
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
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
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
              />
            ) : (
              <TextInputStyled
                type="text"
                name="yMax"
                value={yMax}
                onChange={handleMinMaxChange}
                onBlur={handleCertainOptsBlur}
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
                onSelect={(val) => handleChangeRadians('yDistance', val)}
              />
            )}
            {!yRadians && (
              <TextInputStyled
                type="text"
                defaultValue="1"
                min={0}
                name="yDistance"
                value={yDistance}
                onChange={handleGridChange}
                onBlur={handleCertainOptsBlur}
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
                onSelect={(val) => handleChangeRadians('yTickDistance', val)}
              />
            )}
            {!yRadians && (
              <TextInputStyled
                type="text"
                defaultValue="1"
                min={0}
                name="yTickDistance"
                value={yTickDistance}
                onChange={handleGridChange}
                onBlur={handleCertainOptsBlur}
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
                onChange={() => handleCheckbox('yShowAxis', yShowAxis)}
                checked={yShowAxis}
                data-cy="yShowAxis"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() =>
                  handleCheckbox('yShowAxisLabel', yShowAxisLabel)
                }
                checked={yShowAxisLabel}
                data-cy="yShowAxisLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('yHideTicks', yHideTicks)}
                checked={yHideTicks}
                data-cy="yHideTicks"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('yMinArrow', yMinArrow)}
                checked={yMinArrow}
                data-cy="yMinArrow"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('yMaxArrow', yMaxArrow)}
                checked={yMaxArrow}
                data-cy="yMaxArrow"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('yCommaInLabel', yCommaInLabel)}
                checked={yCommaInLabel}
                data-cy="yCommaInLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={() => handleCheckbox('yDrawLabel', yDrawLabel)}
                checked={yDrawLabel}
                data-cy="yDrawLabel"
              />
            </Col>
            <Col align="center" md={3} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="yRadians"
                onChange={() => handleCheckbox('yRadians', !yRadians)}
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
      {showConfirmModal && (
        <CustomModalStyled
          centered
          visible={showConfirmModal}
          title="Warning"
          okText="Confirm"
          onCancel={updateOtpsFromProps}
          onOk={handleConfirmOptsChanges}
        >
          The graphing objects will no longer fall on the updated grid, and you
          will need to recreate them. Please confirm?
        </CustomModalStyled>
      )}
    </>
  )
}

export default withNamespaces('assessment')(CartesianGridOptions)
