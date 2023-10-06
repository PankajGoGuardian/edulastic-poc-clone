import React, { useState, useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'
import produce from 'immer'
import { Button, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import TitleModal from '../TitleModal'
import PageHeader from '../PageHeader'
import ExploreTitle from '../ExploreTitle'
import QueryBuilderOptions from '../QueryBuilderOptions'
import {
  getIsMetaDataLoadingSelector,
  getMetaDataAction,
  getMetaDataSelector,
  getIsWidgetDataLoadingSelector,
  getChartDataSelector,
  getChartDataAction,
  getActiveReportSelector,
  getReportDataAction,
  addReportDefinitionAction,
  updateReportDefinitionAction,
  setChartDataAction,
} from '../../ducks'
import WidgetQueryBuilder from '../WidgetQueryBuilder'

const isValidQuery = (query) => {
  return query?.dimensions?.length || query?.facts?.length
}

// TODO create custom hooks inside `./hooks` to reduce component size
const ExplorePage = (props) => {
  const {
    history,
    getReportData,
    isLoading,
    getMetaData,
    isItemDataLoading,
    report,
    dataSources,
    chartData,
    getChartData,
    match,
    addReportDefinition,
    updateReportDefinition,
    setChartData,
  } = props
  const { definitionId, widgetId } = match.params
  const isEditWidgetFlow = definitionId && widgetId
  const isAddWidgetToReportFlow = definitionId && !widgetId
  const isCreateReportWithWidgetFlow = !definitionId && !widgetId

  const [addingToReport, setAddingToReport] = useState(false)

  useEffect(() => {
    if (definitionId) {
      getReportData(definitionId)
    }
  }, [definitionId])

  // TODO better create an `editWidget` or `editReport` with same approach as `editQuery`
  const [editQuery, setEditQuery] = useState({})
  useEffect(() => {
    if (isEmpty(report)) return
    const widget = report.widgets.find((w) => w._id === widgetId)
    if (!widget) return
    setEditQuery(widget.query)
  }, [report, widgetId])

  const { availableFacts, availableDimensions } = useMemo(() => {
    if (isEmpty(dataSources)) return []
    const selectedDataSource = dataSources.find(
      (ds) => ds._id === editQuery.source
    )
    return {
      selectedDataSources: selectedDataSource ? [selectedDataSource] : [],
      availableFacts: selectedDataSource?.sourceSchema.facts ?? [],
      availableDimensions: selectedDataSource?.sourceSchema.dimensions ?? [],
    }
  })

  // TODO following state can either be grouped(editReport, editWidget, editLayout, etc) or sent to child to manage or converted to useMemo.
  const [selectedFacts, setSelectedFacts] = useState([])
  const [selectedDimensions, setSelectedDimensions] = useState([])
  const [selectedChartType, setSelectedChartType] = useState('table')
  const [titleModalVisible, setTitleModalVisible] = useState(false)
  const [title, setTitle] = useState('New Widget')
  const [reportTitle, setReportTitle] = useState('New Report Title')
  const [reportDescription, setReportDescription] = useState(
    'New Report Description'
  )
  const [selectedXCoords, setSelectedXCoords] = useState([])
  const [selectedYCoords, setSelectedYCoords] = useState([])

  useEffect(() => {
    getMetaData()
  }, [])

  useEffect(() => {
    if (!isEmpty(chartData)) {
      setSelectedXCoords(editQuery.facts)
      setSelectedYCoords(editQuery.dimensions)
    }
  }, [chartData])

  useEffect(() => {
    setChartData({ widgetId: 'draft', data: {} })
  }, [editQuery])

  const widgetData =
    isEditWidgetFlow && !isEmpty(report)
      ? produce(
          report.widgets.find((w) => w._id === widgetId),
          (draft) => {
            draft.query = editQuery
            draft.layout.options.type = selectedChartType
            draft.layout.options.coOrds.xCoOrds = selectedXCoords
            draft.layout.options.coOrds.yCoOrds = selectedYCoords
          }
        )
      : !isEmpty(editQuery)
      ? {
          ...(widgetId ? { _id: widgetId } : {}),
          query: editQuery,
          layout: {
            options: {
              type: selectedChartType,
              coOrds: { xCoOrds: selectedXCoords, yCoOrds: selectedYCoords },
            },
          },
        }
      : {}

  useEffect(() => {
    // TODO cleanup required
    if (report?._id && !isEmpty(widgetData)) {
      const { title: _reportTitle, description: _reportDescription } = report
      const {
        query: { facts = [], dimensions = [] },
        layout: { type, options },
        title: _title,
      } = widgetData
      if (
        (availableDimensions.length || availableFacts.length) &&
        !(selectedDimensions.length || selectedFacts.length)
      ) {
        const _facts = availableFacts.filter((am) => facts.includes(am.name))
        const _dimensions = availableDimensions.filter((am) =>
          dimensions.includes(am.name)
        )
        setSelectedFacts(_facts)
        setSelectedDimensions(_dimensions)
        setSelectedXCoords(_facts.map((o) => o.name))
        setSelectedYCoords(_dimensions.map((o) => o.name))
        setSelectedChartType(type)
        setTitle(_title)
        setReportTitle(_reportTitle)
        setReportDescription(_reportDescription)
      }
      if (
        (options.coOrds?.xCoOrds?.length || options.coOrds?.xCoOrds?.length) &&
        isEmpty(selectedXCoords) &&
        isEmpty(selectedYCoords)
      ) {
        setSelectedXCoords(options.coOrds.xCoOrds)
        setSelectedYCoords(options.coOrds.YCoOrds)
      }
    }
  }, [report, availableFacts, availableDimensions])

  // TODO : Don't use `||`, cannot set empty ('') value to description
  const finalTitle = title || widgetData?.title || 'New Widget'
  const finalReportTitle =
    reportTitle || (report && report.title) || 'New Report'
  const finalReportDescription =
    reportDescription ||
    (report && report.description) ||
    'New Report Description'

  if (isLoading || isItemDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = isValidQuery(editQuery)

  const handleSaveOrUpdateOfReport = async () => {
    // TODO cleanup required
    const coOrds = {
      xCoOrds: selectedXCoords,
      yCoOrds: selectedYCoords,
    }
    setTitleModalVisible(false)
    setAddingToReport(true)
    if (isEditWidgetFlow) {
      updateReportDefinition({
        definitionId: report._id,
        updateDoc: {
          $set: {
            ...report,
            widgets: report.widgets.map((widget) => {
              if (widget._id !== widgetData._id) return widget
              return {
                ...widget,
                ...widgetData,
                layout: {
                  type: selectedChartType,
                  options: {
                    ...widgetData.layout.options,
                    coOrds,
                  },
                },
                query: editQuery,
                title: finalTitle,
              }
            }),
            title: finalReportTitle,
            description: finalReportDescription,
          },
        },
      })
    } else if (isAddWidgetToReportFlow) {
      updateReportDefinition({
        definitionId: report._id,
        updateDoc: {
          $set: {
            ...report,
            widgets: [
              ...report.widgets,
              {
                layout: {
                  type: selectedChartType,
                  options: {
                    x: 0,
                    y: 0,
                    w: 8,
                    h: 8,
                    coOrds,
                  },
                },
                query: editQuery,
                title: finalTitle,
              },
            ],
            title: finalReportTitle,
            description: finalReportDescription,
          },
        },
      })
    } else if (isCreateReportWithWidgetFlow) {
      addReportDefinition({
        widgets: [
          {
            layout: {
              type: selectedChartType,
              options: {
                x: 0,
                y: 0,
                w: 8,
                h: 8,
                coOrds,
              },
            },
            query: editQuery,
            title: finalTitle,
          },
        ],
        title: finalReportTitle,
        description: finalReportDescription,
      })
    }
    setAddingToReport(false)
  }

  const handleApply = () => {
    getChartData({ query: editQuery })
  }

  return (
    <div>
      <TitleModal
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        setTitle={setTitle}
        title={title}
        reportTitle={reportTitle}
        reportDescription={reportDescription}
        setReportTitle={setReportTitle}
        setReportDescription={setReportDescription}
        handleSaveOrUpdateOfReport={handleSaveOrUpdateOfReport}
      />
      <PageHeader
        title={<ExploreTitle widgetId={widgetId} />}
        button={
          <>
            <Button key="apply-button" type="primary" onClick={handleApply}>
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
      <WidgetQueryBuilder
        value={editQuery}
        onChange={setEditQuery}
        dataSources={dataSources}
      />
      <QueryBuilderOptions
        selectedChartType={selectedChartType}
        selectedDimensions={selectedDimensions}
        selectedFacts={selectedFacts}
        selectedXCoords={selectedXCoords}
        selectedYCoords={selectedYCoords}
        setSelectedChartType={setSelectedChartType}
        setSelectedXCoords={setSelectedXCoords}
        setSelectedYCoords={setSelectedYCoords}
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
      dataSources: getMetaDataSelector(state),
      isItemDataLoading: getIsWidgetDataLoadingSelector(state),
      report: getActiveReportSelector(state),
      chartData: getChartDataSelector(state),
    }),
    {
      getMetaData: getMetaDataAction,
      getReportData: getReportDataAction,
      getChartData: getChartDataAction,
      addReportDefinition: addReportDefinitionAction,
      updateReportDefinition: updateReportDefinitionAction,
      setChartData: setChartDataAction,
    }
  )
)

export default enhance(ExplorePage)
