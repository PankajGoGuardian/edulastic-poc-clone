import React from 'react'
import { Row, Col, Card, Divider } from 'antd'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { EduIf, FlexContainer } from '@edulastic/common'
import MemberGroup from './MemberGroup'
import FilterGroup from './FilterGroup'
import SelectChartType from './SelectChartType'
import ChartRenderer from './ChartRenderer'
import TimeGroup from './TimeGroup'
import CoordinatesSelector from './CoordinatesSelector'

const ControlsRow = styled(Row)`
  background: #ffffff;
  margin-bottom: 12px;
  padding: 18px 28px 10px 28px;
`

const StyledDivider = styled(Divider)`
  margin: 0 12px;
  height: 4.5em;
  top: 0.5em;
  background: #f4f5f6;
`

const HorizontalDivider = styled(Divider)`
  padding: 0;
  margin: 0;
  background: #f4f5f6;
`

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

const QueryBuilderOptions = ({
  selectedFacts = [],
  selectedDimensions = [],
  selectedSegments = [],
  selectedTimeDimensions = [],
  selectedFilters = [],
  selectedDataSources = [],
  selectedChartType = '',
  setSelectedFacts,
  setSelectedDimensions,
  setSelectedSegments,
  setselectedTimeDimensions,
  setSelectedFilters,
  setSelectedDataSources,
  setSelectedChartType,
  availableFacts = [],
  availableDimensions = [],
  availableSegments = [],
  availableTimeDimensions = [],
  availableDataSources = [],
  widgetData = {},
  selectedXCoords,
  selectedYCoords,
  setSelectedXCoords,
  setSelectedYCoords,
}) => {
  const shouldFilterBeVisible =
    selectedFacts.length || selectedDimensions.length

  const { query, layout: { type: chartType } = {} } = widgetData

  const showChartType = selectedChartType || chartType || 'table'

  return (
    <>
      <ControlsRow type="flex" justify="space-around" align="top" key="1">
        <Col span={24}>
          <Row type="flex" align="top" style={{ paddingBottom: 23 }}>
            <MemberGroup
              title="Data Source"
              members={selectedDataSources}
              availableMembers={availableDataSources}
              addMemberName="Data source"
              updateMethods={setSelectedDataSources}
            />
            <StyledDivider type="vertical" />
            <MemberGroup
              title="Measures"
              members={selectedFacts}
              availableMembers={availableFacts}
              addMemberName="Measure"
              updateMethods={setSelectedFacts}
            />
            <StyledDivider type="vertical" />
            <MemberGroup
              title="Dimensions"
              members={selectedDimensions}
              availableMembers={availableDimensions}
              addMemberName="Dimension"
              updateMethods={setSelectedDimensions}
            />
            <StyledDivider type="vertical" />
            <MemberGroup
              title="Segments"
              members={selectedSegments}
              availableMembers={availableSegments}
              addMemberName="Segment"
              updateMethods={setSelectedSegments}
            />
            <StyledDivider type="vertical" />
            <TimeGroup
              title="Time"
              members={selectedTimeDimensions}
              availableMembers={availableTimeDimensions}
              addMemberName="Time"
              updateMethods={setselectedTimeDimensions}
            />
          </Row>
          {!!shouldFilterBeVisible && [
            <HorizontalDivider />,
            <Row
              type="flex"
              justify="space-around"
              align="top"
              gutter={24}
              style={{ marginTop: 10 }}
            >
              <Col span={24}>
                <FilterGroup
                  members={selectedFilters}
                  availableMembers={availableDimensions.concat(availableFacts)}
                  addMemberName="Filter"
                  updateMethods={setSelectedFilters}
                />
              </Col>
            </Row>,
          ]}
        </Col>
      </ControlsRow>
      <ChartRow
        type="flex"
        justify="space-around"
        align="top"
        gutter={24}
        key="2"
      >
        <Col span={24}>
          {!isEmpty(query) ? (
            [
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
              </FlexContainer>,
              <ChartCard style={{ minHeight: 420 }}>
                <ChartRenderer
                  query={query}
                  chartType={showChartType}
                  chartHeight={400}
                  widget={widgetData}
                />
              </ChartCard>,
            ]
          ) : (
            <Empty>
              <h2>Build Your Query</h2>
              <p>Choose a measure or dimension to get started</p>
            </Empty>
          )}
        </Col>
      </ChartRow>
    </>
  )
}

export default QueryBuilderOptions
