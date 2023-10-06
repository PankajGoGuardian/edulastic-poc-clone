import React from 'react'
import { Row, Col, Card } from 'antd'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { EduIf, FlexContainer } from '@edulastic/common'
import SelectChartType from './SelectChartType'
import ChartRenderer from './ChartRenderer'
import CoordinatesSelector from './CoordinatesSelector'

const ChartCard = styled(Card)`
  border-radius: 4px;
  border: none;
`

const ChartRow = styled(Row)`
  padding-left: 28px;
  padding-right: 28px;
`

const Empty = styled.div`
  text-align: center;
  margin-top: 185px;
`
// TODO rename component, it's not options, neither it's a builder
const QueryBuilderOptions = ({
  selectedChartType = '',
  selectedDimensions = [],
  selectedFacts = [],
  selectedXCoords,
  selectedYCoords,
  setSelectedChartType,
  setSelectedXCoords,
  setSelectedYCoords,
  widgetData = {},
}) => {
  const { query, layout: { type: chartType } = {} } = widgetData

  const showChartType = selectedChartType || chartType || 'table'

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
                chartType={showChartType}
                updateChartType={setSelectedChartType}
              />
              <EduIf
                condition={['bar', 'line', 'area'].includes(showChartType)}
              >
                <CoordinatesSelector
                  availableOptions={[...selectedFacts, ...selectedDimensions]}
                  selectedXCoords={selectedXCoords}
                  selectedYCoords={selectedYCoords}
                  setSelectedXCoords={setSelectedXCoords}
                  setSelectedYCoords={setSelectedYCoords}
                />
              </EduIf>
            </FlexContainer>
            <ChartCard style={{ minHeight: 420 }}>
              <ChartRenderer
                query={query}
                chartType={showChartType}
                chartHeight={400}
                widget={widgetData}
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

export default QueryBuilderOptions
