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
  getIsQueryDataLoadingSelector,
  getQueryDataSelector,
  getDataSourceSelector,
  getQueryDataAction,
  getItemDataAction,
  setQueryDataAction,
  getDataSourceAction,
  getChartDataSelector,
} from '../ducks'

const ExplorePage = ({
  history,
  location,
  itemData,
  isLoading,
  getMetaData,
  metaData,
  isQueryDataLoading,
  queryData,
  getQueryData,
  getItemData,
  setQueryData,
  getDataSource,
  dataSources,
  chartData,
}) => {
  const [addingToDashboard, setAddingToDashboard] = useState(false)
  const [selectedDataSources, setSelectedDataSources] = useState([])
  const [selectedMeasures, setSelectedMeasures] = useState([])
  const [selectedDimensions, setSelectedDimensions] = useState([])
  const [selectedSegments, setSelectedSegments] = useState([])
  const [selectedTimeDimensions, setselectedTimeDimensions] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])

  useEffect(() => {
    getDataSource()
    getMetaData()
  }, [])

  useEffect(() => {
    setQueryData({})
    if (selectedMeasures.length || selectedDimensions.length) {
      getQueryData({
        measures: selectedMeasures,
        dimensions: selectedDimensions,
        segments: selectedSegments,
        timedDimensions: selectedTimeDimensions,
        filters: selectedFilters,
      })
    }
  }, [
    selectedMeasures,
    selectedDimensions,
    selectedSegments,
    selectedTimeDimensions,
    selectedFilters,
  ])

  const {
    availableMeasures,
    availableDimensions,
    availableSegments,
    availableTimeDimensions,
  } = useMemo(() => {
    const _availableMeasures = []
    const _availableDimensions = []
    const _availableSegments = []
    if (!isEmpty(metaData) && !isEmpty(selectedDataSources)) {
      metaData
        .filter(
          (_metadata) =>
            _metadata.dataSource.name === selectedDataSources[0].name
        )
        .forEach(({ measures: m, dimensions: d, segments: s }) => {
          _availableMeasures.push(...m)
          _availableDimensions.push(...d)
          _availableSegments.push(...s)
        })
    }
    return {
      availableMeasures: _availableMeasures,
      availableDimensions: _availableDimensions,
      availableSegments: _availableSegments,
      availableTimeDimensions: [
        ..._availableMeasures.filter((o) => o.type === 'time'),
        ..._availableDimensions.filter((o) => o.type === 'time'),
      ],
    }
  }, [metaData, selectedDataSources])

  const params = new URLSearchParams(location.search)
  const itemId = params.get('itemId')

  useEffect(() => {
    if (itemId) {
      getItemData(itemId)
    }
  }, [itemId])

  const finalVizState =
    (!isEmpty(queryData) && JSON.parse(queryData.vizState)) || {}

  useEffect(() => {
    if (
      queryData?._id &&
      (availableMeasures.length ||
        availableDimensions.length ||
        availableSegments.length)
    ) {
      const {
        query: { measures = [], segments = [], dimensions = [] },
      } = finalVizState
      setSelectedMeasures(
        availableMeasures.filter((am) => measures.includes(am.name))
      )
      setSelectedDimensions(
        availableDimensions.filter((am) => dimensions.includes(am.name))
      )
      setSelectedSegments(
        availableSegments.filter((am) => segments.includes(am.name))
      )
    }
  }, [
    queryData.vizState,
    availableMeasures,
    availableDimensions,
    availableSegments,
  ])

  const [titleModalVisible, setTitleModalVisible] = useState(false)
  const [title, setTitle] = useState(null)
  const finalTitle =
    title != null ? title : (itemId && itemData && itemData.name) || 'New Chart'

  if (isLoading || isQueryDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = !isEmpty(finalVizState) && !isEmpty(chartData)

  return (
    <div>
      <TitleModal
        history={history}
        itemId={itemId}
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setAddingToDashboard={setAddingToDashboard}
        finalVizState={finalVizState}
        setTitle={setTitle}
        finalTitle={finalTitle}
      />
      <PageHeader
        title={<ExploreTitle itemId={itemId} />}
        button={
          <>
            <Button
              key="dashboard-button"
              type="primary"
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
        selectedMeasures={selectedMeasures}
        selectedDimensions={selectedDimensions}
        selectedSegments={selectedSegments}
        selectedTimeDimensions={selectedTimeDimensions}
        selectedFilters={selectedFilters}
        selectedDataSources={selectedDataSources}
        setSelectedMeasures={setSelectedMeasures}
        setSelectedDimensions={setSelectedDimensions}
        setSelectedSegments={setSelectedSegments}
        setselectedTimeDimensions={setselectedTimeDimensions}
        setSelectedFilters={setSelectedFilters}
        setSelectedDataSources={setSelectedDataSources}
        availableMeasures={availableMeasures}
        availableDimensions={availableDimensions}
        availableSegments={availableSegments}
        availableTimeDimensions={availableTimeDimensions}
        availableDataSources={dataSources}
        finalVizState={finalVizState}
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
      isQueryDataLoading: getIsQueryDataLoadingSelector(state),
      queryData: getQueryDataSelector(state),
      dataSources: getDataSourceSelector(state),
      chartData: getChartDataSelector(state),
    }),
    {
      getMetaData: getMetaDataAction,
      getQueryData: getQueryDataAction,
      getItemData: getItemDataAction,
      setQueryData: setQueryDataAction,
      getDataSource: getDataSourceAction,
    }
  )
)

export default enhance(ExplorePage)
