import React, { useEffect } from 'react'
import { Row, Col, Card } from 'antd'
import { isEmpty } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FlexContainer, TextInputStyled } from '@edulastic/common'
import { themeColor, white } from '@edulastic/colors'
import SelectChartType from './SelectChartType'
import ChartRenderer from './ChartRenderer'
import CoordinatesSelector from './CoordinatesSelector'
import { getChartDataSelector } from '../ducks'

const EditWidgetLayout = ({ value, onChange, chartData }) => {
  const { query, layout } = value
  const chartType = layout.type
  const { facts = [], dimensions = [] } = query
  const showCustomAxesOption = ['bar', 'line', 'area'].includes(chartType)

  useEffect(() => {
    if (!isEmpty(chartData)) {
      onChange({
        ...layout,
        options: {
          ...layout.options,
          coOrds: {
            xCoOrds: query.facts,
            yCoOrds: query.dimensions,
          },
        },
      })
    }
  }, [chartData])

  const handleChange = (_value) => onChange(_value)

  const handleChartTypeChange = (_value) =>
    handleChange({ ...layout, type: _value })

  const handleCoOrdsChange = (key) => {
    return (_value) => {
      handleChange({
        ...layout,
        options: {
          ...layout.options,
          coOrds: {
            ...layout.options.coOrds,
            [key]: _value,
          },
        },
      })
    }
  }

  const handleAxesLabelChange = (key) => {
    return (e) => {
      handleChange({
        ...layout,
        options: {
          ...layout.options,
          axesLabel: {
            ...layout.options.axesLabel,
            [key]: e.target.value,
          },
        },
      })
    }
  }

  return (
    <ChartRow
      type="flex"
      justify="space-around"
      align="top"
      gutter={24}
      key="2"
    >
      <Col span={24}>
        {!isEmpty(query) ? (
          <>
            <FlexContainer
              style={{ marginTop: 15, marginBottom: 25, width: '100%' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <SelectChartType
                chartType={chartType}
                updateChartType={handleChartTypeChange}
              />
              {showCustomAxesOption && (
                <CoordinatesSelector
                  availableOptions={[...facts, ...dimensions]}
                  selectedXCoords={layout.options.coOrds.xCoOrds}
                  selectedYCoords={layout.options.coOrds.yCoOrds}
                  setSelectedXCoords={handleCoOrdsChange('xCoOrds')}
                  setSelectedYCoords={handleCoOrdsChange('yCoOrds')}
                />
              )}
            </FlexContainer>
            <ChartCard style={{ minHeight: 420 }}>
              {showCustomAxesOption && (
                <>
                  <YAxisLabelContainer>
                    <Title>Y-Axis Label</Title>
                    <TextInputStyled
                      data-cy="yAxisLabel"
                      placeholder="Y axis Label"
                      value={layout.options.axesLabel.y}
                      onChange={handleAxesLabelChange('y')}
                    />
                  </YAxisLabelContainer>
                  <XAxisLabelContainer>
                    <Title>X-Axis Label</Title>
                    <TextInputStyled
                      data-cy="xAxisLabel"
                      placeholder="X axis Label"
                      value={layout.options.axesLabel.x}
                      onChange={handleAxesLabelChange('x')}
                    />
                  </XAxisLabelContainer>
                </>
              )}
              <ChartRenderer
                query={query}
                chartType={chartType}
                chartHeight={400}
                widget={value}
                axesLabel={layout.options.axesLabel}
              />
            </ChartCard>
          </>
        ) : (
          <Empty>
            <h2>Build Your Query</h2>
            <p>Choose a measure or dimension to get started</p>
          </Empty>
        )}
      </Col>
    </ChartRow>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      chartData: getChartDataSelector(state),
    }),
    {}
  )
)
export default enhance(EditWidgetLayout)

const Title = styled.p`
  margin-bottom: 10px;
  color: ${themeColor};
  font-weight: 600;
`

const YAxisLabelContainer = styled.div`
  position: absolute;
  top: -10px;
  left: 0%;
  transform: rotate(-90deg) tranlate(-50%, -50%);
  display: flex;
  align-items: center;
`

const XAxisLabelContainer = styled.div`
  position: absolute;
  right: 0px;
  bottom: -20px;
  // transform: translate(-50%, 60%);
  display: flex;
  align-items: center;
`

const ChartCard = styled(Card)`
  border: none;
  border-radius: 15px;
  background-color: ${white};
  width: 95%;
  margin: 30px auto;
  padding: 50px 0px 30px 0px;
  display: relative;
`

const ChartRow = styled(Row)`
  padding-left: 28px;
  padding-right: 28px;
`

const Empty = styled.div`
  text-align: center;
  margin-top: 185px;
`
