import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'

import { Row } from '../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../styled/WidgetOptions/Col'
import { Label } from '../../../../styled/WidgetOptions/Label'
import { TextInputStyled } from '../../../../styled/InputStyles'
import { CheckboxLabel } from '../../../../styled/CheckboxWithLabel'
import FontSizeSelect from '../../../FontSizeSelect'

const DisplayOptions = ({
  t,
  uiStyle,
  canvas,
  numberlineAxis,
  setOptions,
  setNumberline,
  setCanvas,
}) => {
  const handleInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    if (!value) {
      setOptions({ ...uiStyle, [name]: 0 })
    } else {
      setOptions({ ...uiStyle, [name]: parseInt(value, 10) })
    }
  }

  const handleCanvasInputChange = (event) => {
    const {
      target: { name, value },
    } = event
    if (!value) {
      setCanvas({ ...canvas, [name]: 0 })
    } else {
      setCanvas({ ...canvas, [name]: value })
    }
  }

  const handleChangeFontSize = (fontSize) => {
    setOptions({ ...uiStyle, fontSize })
  }

  const handleNumberlineCheckboxChange = (name) => () => {
    setNumberline({ ...numberlineAxis, [name]: !numberlineAxis[name] })
  }

  const handleUiStyle = (name) => () => {
    setOptions({ ...uiStyle, [name]: !uiStyle[name] })
  }

  return (
    <>
      <Row gutter={24}>
        <Col md={12}>
          <Label>{t('component.graphing.layoutoptions.minWidth')}</Label>
          <TextInputStyled
            type="number"
            name="layoutWidth"
            onChange={handleInputChange}
            value={uiStyle.layoutWidth}
          />
        </Col>
        <Col md={12}>
          <Label>{t('component.graphing.layoutoptions.height')}</Label>
          <TextInputStyled
            type="number"
            name="layoutHeight"
            onChange={handleInputChange}
            value={uiStyle.layoutHeight}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={12}>
          <Label>{t('component.graphing.layoutoptions.linemargin')}</Label>
          <TextInputStyled
            type="number"
            name="margin"
            placeholder="0"
            value={canvas.margin === 0 ? null : canvas.margin}
            onChange={handleCanvasInputChange}
          />
        </Col>
        <Col md={12}>
          <FontSizeSelect
            data-cy="fontSize"
            value={uiStyle.fontSize}
            onChange={(val) => handleChangeFontSize(val)}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col md={12}>
          <CheckboxLabel
            onChange={handleUiStyle('showGrid')}
            name="showGrid"
            checked={uiStyle.showGrid}
          >
            {t('component.graphing.layoutoptions.showGrid')}
          </CheckboxLabel>
        </Col>
        <Col md={12}>
          <CheckboxLabel
            onChange={handleUiStyle('drawLabelZero')}
            name="drawLabelZero"
            checked={uiStyle.drawLabelZero}
          >
            {t('component.graphing.layoutoptions.drawLabelZero')}
          </CheckboxLabel>
        </Col>
        <Col md={12}>
          <CheckboxLabel
            onChange={handleUiStyle('displayPositionOnHover')}
            name="displayPositionOnHover"
            checked={uiStyle.displayPositionOnHover}
          >
            {t('component.graphing.layoutoptions.displayposition')}
          </CheckboxLabel>
        </Col>
        <Col md={12}>
          <CheckboxLabel
            onChange={handleNumberlineCheckboxChange('snapToGrid')}
            name="snapToGrid"
            checked={numberlineAxis.snapToGrid}
          >
            {t('component.graphing.layoutoptions.snapToGrid')}
          </CheckboxLabel>
        </Col>
      </Row>
    </>
  )
}

DisplayOptions.propTypes = {
  t: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  canvas: PropTypes.object.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  setCanvas: PropTypes.func.isRequired,
  setOptions: PropTypes.func.isRequired,
  setNumberline: PropTypes.func.isRequired,
}

export default withNamespaces('assessment')(DisplayOptions)
