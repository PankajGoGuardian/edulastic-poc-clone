import React, { useMemo } from 'react'
import { Select } from 'antd'
import { getFormattedAttrId, SelectInputStyled } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { graph as graphConstants } from '@edulastic/constants'
import Question from '../../../../Question'
import { Subtitle } from '../../../../../styled/Subtitle'
import { Col } from '../../../../../styled/WidgetOptions/Col'
import { Row } from '../../../../../styled/WidgetOptions/Row'

import CartesianGridOptions from './CartesianGridOptions'
import PolarGridOptions from './PolarGridOptions'

const { GRID_TYPES, RECT_GRID, POLAR_GRID } = graphConstants

const GridOptions = ({
  t,
  setOptions,
  setCanvas,
  graphData,
  cleanSections,
  fillSections,
  advancedAreOpen,
  gridType = RECT_GRID,
}) => {
  const optionsComp = useMemo(() => {
    switch (gridType) {
      case RECT_GRID:
        return (
          <CartesianGridOptions
            graphData={graphData}
            setOptions={setOptions}
            setCanvas={setCanvas}
          />
        )
      case POLAR_GRID:
        return (
          <PolarGridOptions
            graphData={graphData}
            setOptions={setOptions}
            setCanvas={setCanvas}
          />
        )
      default:
        break
    }
  }, [gridType, graphData])

  const handleChangeGridType = (value) => {
    const { uiStyle } = graphData
    setOptions({ ...uiStyle, gridType: value })
  }

  return (
    <Question
      section="advanced"
      label="Grid"
      cleanSections={cleanSections}
      fillSections={fillSections}
      advancedAreOpen={advancedAreOpen}
    >
      <Row justify="space-between" align="middle" type="flex">
        <Col md={12} marginBottom="0px">
          <Subtitle
            id={getFormattedAttrId(
              `${graphData?.title}-${t('component.graphing.grid_options.grid')}`
            )}
          >
            {t('component.graphing.grid_options.grid')}
          </Subtitle>
        </Col>
        <Col md={6} marginBottom="0px">
          <SelectInputStyled
            size="large"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={handleChangeGridType}
            value={gridType}
            data-cy="gridType"
            style={{ width: '100%' }}
          >
            {GRID_TYPES.map((option) => (
              <Select.Option data-cy={option} key={option}>
                {t(`component.graphing.grid_options.${option}`)}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>
      {optionsComp}
    </Question>
  )
}

export default withNamespaces('assessment')(GridOptions)
