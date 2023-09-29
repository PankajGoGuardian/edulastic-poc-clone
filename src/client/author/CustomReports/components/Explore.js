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
  getIsItemDataLoadingSelector,
  getItemDataSelector,
  getDataSourceSelector,
  getItemDataAction,
  getDataSourceAction,
  getChartDataSelector,
  getChartDataAction,
} from '../ducks'

const ExplorePage = ({
  history,
  location,
  itemData,
  isLoading,
  getMetaData,
  metaData,
  isItemDataLoading,
  getItemData,
  getDataSource,
  dataSources,
  chartData,
  getChartData,
}) => {
  const [addingToDashboard, setAddingToDashboard] = useState(false)
  const [selectedDataSources, setSelectedDataSources] = useState([])
  const [selectedFacts, setSelectedFacts] = useState([])
  const [selectedDimensions, setSelectedDimensions] = useState([])
  const [selectedSegments, setSelectedSegments] = useState([])
  const [selectedTimeDimensions, setselectedTimeDimensions] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedChartType, setSelectedChartType] = useState('table')
  const [titleModalVisible, setTitleModalVisible] = useState(false)
  const [title, setTitle] = useState(null)

  useEffect(() => {
    getDataSource()
    getMetaData()
  }, [])
  console.log({ metaData })
  const {
    availableFacts,
    availableDimensions,
    availableSegments,
    availableTimeDimensions,
    schemaId,
  } = useMemo(() => {
    const _availableFacts = []
    const _availableDimensions = []
    const _availableSegments = []
    let selectedMetaData = {}
    if (!isEmpty(metaData) && !isEmpty(selectedDataSources)) {
      selectedMetaData = metaData.find(
        (_metadata) => _metadata?.source?.name === selectedDataSources[0].name
      )
      ;[selectedMetaData].forEach(
        ({ facts: m, dimensions: d, segments: s }) => {
          _availableFacts.push(...m)
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
      schemaId: selectedMetaData._id,
    }
  }, [metaData, selectedDataSources])

  const params = new URLSearchParams(location.search)
  const itemId = params.get('itemId')

  useEffect(() => {
    if (itemId) {
      getItemData(itemId)
    }
  }, [itemId])

  const query = useMemo(() => {
    if (selectedFacts.length || selectedDimensions.length) {
      return {
        schema: schemaId,
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

  const widgetData = !isEmpty(itemData)
    ? itemData
    : !isEmpty(query)
    ? { query }
    : {}

  useEffect(() => {
    if (
      itemData?._id &&
      (availableFacts.length ||
        availableDimensions.length ||
        availableSegments.length)
    ) {
      const {
        query: { facts = [], segments = [], dimensions = [] },
      } = itemData
      setSelectedDataSources(
        dataSources.filter((o) => o._id === itemData.query._id)
      )
      setSelectedFacts(availableFacts.filter((am) => facts.includes(am.name)))
      setSelectedDimensions(
        availableDimensions.filter((am) => dimensions.includes(am.name))
      )
      setSelectedSegments(
        availableSegments.filter((am) => segments.includes(am.name))
      )
    }
  }, [itemData, availableFacts, availableDimensions, availableSegments])

  const finalTitle =
    title != null ? title : (itemId && itemData && itemData.name) || 'New Chart'

  if (isLoading || isItemDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = !isEmpty(widgetData) && !isEmpty(chartData)

  return (
    <div>
      <TitleModal
        history={history}
        itemId={itemId}
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setAddingToDashboard={setAddingToDashboard}
        query={query}
        setTitle={setTitle}
        finalTitle={finalTitle}
        selectedChartType={selectedChartType}
      />
      <PageHeader
        title={<ExploreTitle itemId={itemId} />}
        button={
          <>
            <Button
              key="dashboard-button"
              type="primary"
              onClick={() => getChartData({ query })}
            >
              Apply
            </Button>
            <Button
              key="dashboard-button"
              type="primary"
              style={{ marginLeft: '15px' }}
              onClick={() => history.push('/author/customReports')}
            >
              Go to Dashboard
            </Button>
            <Button
              key="update-button"
              type="primary"
              style={{ marginLeft: '15px' }}
              loading={addingToDashboard}
              disabled={!canAddOrUpdateChart}
              onClick={() => setTitleModalVisible(true)}
            >
              {itemId ? 'Update' : 'Add to Dashboard'}
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
      isItemDataLoading: getIsItemDataLoadingSelector(state),
      itemData: getItemDataSelector(state),
      dataSources: getDataSourceSelector(state),
      chartData: getChartDataSelector(state),
    }),
    {
      getMetaData: getMetaDataAction,
      getItemData: getItemDataAction,
      getDataSource: getDataSourceAction,
      getChartData: getChartDataAction,
    }
  )
)

export default enhance(ExplorePage)
