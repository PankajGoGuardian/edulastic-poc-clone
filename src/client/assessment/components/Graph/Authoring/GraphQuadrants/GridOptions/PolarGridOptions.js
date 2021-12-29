import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  TextInputStyled,
  SelectInputStyled,
  MathFormulaDisplay,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { CheckboxLabel } from '../../../../../styled/CheckboxWithLabel'
import { ColumnLabel } from '../../../../../styled/Grid'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Label } from '../../../../../styled/WidgetOptions/Label'

const THETA_VALUES = [15, 30, 45]

const THETA_IN_RADIANS = {
  15: '<span class="input__math" data-latex="\\frac{\\pi}{12}"></span>',
  30: '<span class="input__math" data-latex="\\frac{\\pi}{6}"></span>',
  45: '<span class="input__math" data-latex="\\frac{\\pi}{4}"></span>',
}

const { Option } = SelectInputStyled

const numReg = new RegExp('^[-.0-9]+$')

const PolarGridOptions = ({ graphData, setOptions, t }) => {
  const [gridParams, setGridPrams] = useState({})

  const handleChangeInput = (evt) => {
    const { value, name } = evt.target
    if (numReg.test(value)) {
      setGridPrams({
        ...gridParams,
        [name]: parseFloat(value),
      })
    }
  }

  const handleBlurInput = () => {
    setOptions({ ...graphData.uiStyle, ...gridParams })
  }

  const handleSelectTheta = (theta) => {
    setOptions({ ...graphData.uiStyle, tDist: parseInt(theta, 10) })
  }

  const handleCheckbox = (evt) => {
    const { name, checked } = evt.target
    setOptions({ ...graphData.uiStyle, [name]: checked })
  }

  useEffect(() => {
    const {
      tMin,
      tMax,
      tDist,
      rMin,
      rMax,
      rDist,
      rShowAxis = true,
      tShowAxis = true,
      rDrawLabel = true,
      tDrawLabel = true,
      tRadians,
    } = graphData.uiStyle || {}

    setGridPrams({
      tMin: tMin || 0,
      tMax: tMax || 360,
      tDist: tDist || 30,
      rMin: rMin || 0,
      rMax: rMax || 10,
      rDist: rDist || 1,
      rShowAxis,
      tShowAxis,
      rDrawLabel,
      tDrawLabel,
      tRadians,
    })
  }, [graphData])

  return (
    <>
      <Row type="flex" align="middle">
        <Col md={12} marginBottom="0px">
          <Row gutter={4} type="flex" align="middle">
            <Col md={4} marginBottom="6px">
              <ColumnLabel align="left">
                {t('component.graphing.grid_options.axes')}
              </ColumnLabel>
            </Col>
            <Col md={5} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.min')}
              </ColumnLabel>
            </Col>
            <Col md={5} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.max')}
              </ColumnLabel>
            </Col>
            <Col md={5} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.distance')}
              </ColumnLabel>
            </Col>
            <Col md={5} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.tick_distance')}
              </ColumnLabel>
            </Col>
          </Row>
        </Col>
        <Col md={12} marginBottom="0px">
          <Row type="flex" align="middle">
            <Col md={4} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.show_axis')}
              </ColumnLabel>
            </Col>
            <Col md={4} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.draw_label')}
              </ColumnLabel>
            </Col>
            <Col md={4} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.comma_in_label')}
              </ColumnLabel>
            </Col>
            <Col md={4} marginBottom="6px">
              <ColumnLabel>
                {t('component.graphing.grid_options.use_radians')}
              </ColumnLabel>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row type="flex" align="middle">
        <Col md={12} marginBottom="0px">
          <Row gutter={4} type="flex" align="middle">
            <Col md={4} marginBottom="0px">
              <Label marginBottom="0px">Radius</Label>
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                type="text"
                name="rMin"
                value={gridParams.rMin}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                disabled={false}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                type="text"
                name="rMax"
                value={gridParams.rMax}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                disabled={false}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                type="text"
                name="rDist"
                value={gridParams.rDist}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                disabled={false}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                disabled
                type="text"
                name="rLabelDist"
                value={gridParams.rLabelDist}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
          </Row>
        </Col>
        <Col md={12} marginBottom="0px">
          <Row type="flex" align="middle">
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="rShowAxis"
                checked={gridParams.rShowAxis}
                onChange={handleCheckbox}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="rDrawLabel"
                onChange={handleCheckbox}
                checked={gridParams.rDrawLabel}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={handleCheckbox}
                checked={gridParams.xCommaInLabel}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }} />
          </Row>
        </Col>
      </Row>
      <Row gutter={4} type="flex" align="middle">
        <Col md={12} marginBottom="0px">
          <Row gutter={4} type="flex" align="middle">
            <Col md={4} marginBottom="0px">
              <Label marginBottom="0px">Theta</Label>
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                type="text"
                name="tMin"
                value={gridParams.tMin}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                disabled={false}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                type="text"
                name="tMax"
                value={gridParams.tMax}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                disabled={false}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
            <Col md={5} marginBottom="6px">
              <ThetaSelect
                size="large"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                onChange={handleSelectTheta}
                value={gridParams.tDist}
                defaultValue={15}
                data-cy="theta-select"
                style={{ width: '100%' }}
              >
                {THETA_VALUES.map((theta) => (
                  <Option key={theta} value={theta}>
                    {!gridParams.tRadians ? (
                      theta
                    ) : (
                      <MathFormulaDisplay
                        align="center"
                        fontSize="11px"
                        dangerouslySetInnerHTML={{
                          __html: THETA_IN_RADIANS[theta],
                        }}
                      />
                    )}
                  </Option>
                ))}
              </ThetaSelect>
            </Col>
            <Col md={5} marginBottom="6px">
              <TextInputStyled
                disabled
                type="text"
                name="tLabelDist"
                value={gridParams.tLabelDist}
                onChange={handleChangeInput}
                onBlur={handleBlurInput}
                height="35px"
                align="center"
                padding="0px 4px"
              />
            </Col>
          </Row>
        </Col>
        <Col md={12} marginBottom="0px">
          <Row type="flex" align="middle">
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="tShowAxis"
                onChange={handleCheckbox}
                checked={gridParams.tShowAxis}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="tDrawLabel"
                onChange={handleCheckbox}
                checked={gridParams.tDrawLabel}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="drawLabelZero"
                onChange={handleCheckbox}
                checked={gridParams.yCommaInLabel}
              />
            </Col>
            <Col align="center" md={4} style={{ marginBottom: '0' }}>
              <CheckboxLabel
                name="tRadians"
                onChange={handleCheckbox}
                checked={gridParams.tRadians}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default withNamespaces('assessment')(PolarGridOptions)

const ThetaSelect = styled(SelectInputStyled)`
  &.ant-select {
    .ant-select-selection {
      &.ant-select-selection--single {
        .ant-select-selection__rendered {
          .ant-select-selection-selected-value {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
`
