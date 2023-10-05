import React, { useState, useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Button, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import TitleModal from './TitleModal'
import PageHeader from './PageHeader'
import ExploreTitle from './ExploreTitle'
import QueryBuilderOptions from './QueryBuilderOptions'
import {
  getIsMetaDataLoadingSelector,
  getMetaDataAction,
  getMetaDataSelector,
  getIsWidgetDataLoadingSelector,
  getDataSourceSelector,
  getDataSourceAction,
  getChartDataSelector,
  getChartDataAction,
  getActiveReportSelector,
  getReportDataAction,
} from '../ducks'

const ExplorePage = (props) => {
  const {
    history,
    getReportData,
    isLoading,
    getMetaData,
    metaData,
    isItemDataLoading,
    report,
    getDataSource,
    dataSources,
    chartData,
    getChartData,
    match,
  } = props
  const [addingToReport, setAddingToReport] = useState(false)
  const [selectedDataSources, setSelectedDataSources] = useState([])
  const [selectedFacts, setSelectedFacts] = useState([])
  const [selectedDimensions, setSelectedDimensions] = useState([])
  const [selectedSegments, setSelectedSegments] = useState([])
  const [selectedTimeDimensions, setselectedTimeDimensions] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedChartType, setSelectedChartType] = useState('table')
  const [titleModalVisible, setTitleModalVisible] = useState(false)
  const [title, setTitle] = useState(null)
  const [reportTitle, setReportTitle] = useState(null)
  const [reportDescription, setReportDescription] = useState(null)
  const [selectedXCoords, setSelectedXCoords] = useState([])
  const [selectedYCoords, setSelectedYCoords] = useState([])

  const { definitionId, widgetId } = match.params

  useEffect(() => {
    getDataSource()
    getMetaData()
  }, [])

  const {
    availableFacts,
    availableDimensions,
    availableSegments,
    availableTimeDimensions,
    sourceId,
  } = useMemo(() => {
    const _availableFacts = []
    const _availableDimensions = []
    const _availableSegments = []
    let selectedMetaData = {}
    if (!isEmpty(metaData) && !isEmpty(selectedDataSources)) {
      selectedMetaData = metaData.find(
        (_metadata) => _metadata?._id === selectedDataSources[0]._id
      )
      ;[selectedMetaData].forEach(
        ({ sourceSchema: { facts: f, dimensions: d, segments: s } }) => {
          _availableFacts.push(...f)
          _availableDimensions.push(...d)
          _availableSegments.push(...s)
        }
      )
    }
    return {
      availableFacts: _availableFacts,
      availableDimensions: _availableDimensions,
      availableSegments: _availableSegments,
      availableTimeDimensions: [
        ..._availableFacts.filter((o) => o.type === 'time'),
        ..._availableDimensions.filter((o) => o.type === 'time'),
      ],
      sourceId: selectedMetaData._id,
    }
  }, [metaData, selectedDataSources])

  useEffect(() => {
    if (definitionId) {
      getReportData(definitionId)
    }
  }, [definitionId])

  const query = useMemo(() => {
    if (selectedFacts.length || selectedDimensions.length) {
      return {
        source: sourceId,
        facts: selectedFacts,
        dimensions: selectedDimensions,
        segments: selectedSegments,
        timeDimensions: selectedTimeDimensions,
        filters: selectedFilters,
      }
    }
    return {}
  }, [
    selectedFacts,
    selectedDimensions,
    selectedSegments,
    selectedTimeDimensions,
    selectedFilters,
  ])

  const isEditWidgetFlow = definitionId && widgetId
  const isAddWidgetToReportFlow = definitionId && !widgetId
  const isCreateReportWithWidgetFlow = !definitionId && !widgetId
  const widgetData =
    isEditWidgetFlow && !isEmpty(report)
      ? report.widgets.find((w) => w._id === widgetId)
      : !isEmpty(query)
      ? { query }
      : {}

  useEffect(() => {
    if (report?._id && !isEmpty(widgetData)) {
      const {
        query: { facts = [], segments = [], dimensions = [] },
      } = widgetData
      if (isEmpty(selectedDataSources))
        setSelectedDataSources(
          dataSources.filter((o) => o._id === widgetData.query.source)
        )

      if (
        (availableDimensions.length || availableFacts.length) &&
        !(selectedDimensions.length || selectedFacts.length)
      ) {
        setSelectedFacts(availableFacts.filter((am) => facts.includes(am.name)))
        setSelectedDimensions(
          availableDimensions.filter((am) => dimensions.includes(am.name))
        )
        setSelectedSegments(
          availableSegments.filter((am) => segments.includes(am.name))
        )
      }
    }
  }, [report, availableFacts, availableDimensions])

  // TODO : Don't use `||`, cannot set empty ('') value to description
  const finalTitle =
    title || (widgetId && widgetData && widgetData.name) || 'New Widget'
  const finalReportTitle =
    reportTitle || (report && report.title) || 'New Report'
  const finalReportDescription =
    reportDescription ||
    (report && report.description) ||
    'New Report Description'

  if (isLoading || isItemDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = !isEmpty(widgetData) && !isEmpty(chartData)

  return (
    <div>
      <TitleModal
        history={history}
        widgetData={widgetData}
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setAddingToReport={setAddingToReport}
        query={query}
        setTitle={setTitle}
        finalTitle={finalTitle}
        finalReportTitle={finalReportTitle}
        finalReportDescription={finalReportDescription}
        setReportTitle={setReportTitle}
        setReportDescription={setReportDescription}
        selectedChartType={selectedChartType}
        isEditWidgetFlow={isEditWidgetFlow}
        isAddWidgetToReportFlow={isAddWidgetToReportFlow}
        isCreateReportWithWidgetFlow={isCreateReportWithWidgetFlow}
        report={report}
      />
      <PageHeader
        title={<ExploreTitle widgetId={widgetId} />}
        button={
          <>
            <Button
              key="apply-button"
              type="primary"
              onClick={() => getChartData({ query })}
            >
              Apply
            </Button>
            <Button
              key="goto-report-button"
              type="primary"
              style={{ marginLeft: '15px' }}
              onClick={() => history.push('/author/reportBuilder')}
            >
              Go to Reports List
            </Button>
            <Button
              key="update-button"
              type="primary"
              style={{ marginLeft: '15px' }}
              loading={addingToReport}
              disabled={!canAddOrUpdateChart}
              onClick={() => setTitleModalVisible(true)}
            >
              {widgetId ? 'Update' : 'Add to Report'}
            </Button>
          </>
        }
      />
      <QueryBuilderOptions
        selectedFacts={selectedFacts}
        selectedDimensions={selectedDimensions}
        selectedSegments={selectedSegments}
        selectedTimeDimensions={selectedTimeDimensions}
        selectedFilters={selectedFilters}
        selectedDataSources={selectedDataSources}
        selectedChartType={selectedChartType}
        setSelectedFacts={setSelectedFacts}
        setSelectedDimensions={setSelectedDimensions}
        setSelectedSegments={setSelectedSegments}
        setselectedTimeDimensions={setselectedTimeDimensions}
        setSelectedFilters={setSelectedFilters}
        setSelectedDataSources={setSelectedDataSources}
        setSelectedChartType={setSelectedChartType}
        availableFacts={availableFacts}
        availableDimensions={availableDimensions}
        availableSegments={availableSegments}
        availableTimeDimensions={availableTimeDimensions}
        availableDataSources={dataSources}
        widgetData={widgetData}
        selectedXCoords={selectedXCoords}
        selectedYCoords={selectedYCoords}
        setSelectedXCoords={setSelectedXCoords}
        setSelectedYCoords={setSelectedYCoords}
      />
    </div>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isLoading: getIsMetaDataLoadingSelector(state),
      metaData: getMetaDataSelector(state),
      isItemDataLoading: getIsWidgetDataLoadingSelector(state),
      report: getActiveReportSelector(state),
      dataSources: getDataSourceSelector(state),
      chartData: getChartDataSelector(state),
    }),
    {
      getMetaData: getMetaDataAction,
      getReportData: getReportDataAction,
      getDataSource: getDataSourceAction,
      getChartData: getChartDataAction,
    }
  )
)

export default enhance(ExplorePage)
