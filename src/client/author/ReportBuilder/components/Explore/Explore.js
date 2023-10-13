import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import produce from 'immer'
import { Button, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import TitleModal from '../TitleModal'
import PageHeader from '../PageHeader'
import ExploreTitle from '../ExploreTitle'
import EditWidgetLayout from '../EditWidgetLayout'
import {
  getIsMetaDataLoadingSelector,
  getMetaDataAction,
  getMetaDataSelector,
  getIsWidgetDataLoadingSelector,
  getChartDataAction,
  getActiveReportSelector,
  getReportDataAction,
  addReportDefinitionAction,
  updateReportDefinitionAction,
  setChartDataAction,
} from '../../ducks'
import { WidgetQueryBuilder } from '../WidgetQueryBuilder'
import { DEFAULT_WIDGET_LAYOUT } from '../../const'

const isValidQuery = (query) => {
  return query?.dimensions?.length || query?.facts?.length
}

// TODO create custom hooks inside `./hooks` to reduce component size
const Explore = (props) => {
  const {
    history,
    getReportData,
    isLoading,
    getMetaData,
    isItemDataLoading,
    report,
    dataSources,
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
  const [editQuery, setEditQuery] = useState({})
  const [editWidgetLayout, setEditWidgetLayout] = useState(
    DEFAULT_WIDGET_LAYOUT
  )
  const [title, setTitle] = useState('New Widget')
  const [reportTitle, setReportTitle] = useState('New Report Title')
  const [reportDescription, setReportDescription] = useState(
    'New Report Description'
  )

  useEffect(() => {
    if (definitionId) {
      getReportData(definitionId)
    }
  }, [definitionId])

  // TODO better create an `editWidget` or `editReport` with same approach as `editQuery`
  useEffect(() => {
    if (isEmpty(report)) return
    setReportTitle(report.title)
    setReportDescription(report.description)
    const widget = report.widgets.find((w) => w._id === widgetId)
    if (!widget) return
    setEditQuery(widget.query)
    setEditWidgetLayout({
      ...editWidgetLayout,
      ...widget.layout,
      options: { ...editWidgetLayout.options, ...widget.layout.options },
    })
    setTitle(widget.title)
  }, [report, widgetId])

  // TODO following state can either be grouped(editReport, editWidget, editLayout, etc) or sent to child to manage or converted to useMemo.
  const [titleModalVisible, setTitleModalVisible] = useState(false)

  useEffect(() => {
    getMetaData()
  }, [])

  useEffect(() => {
    setChartData({ widgetId: 'draft', data: {} })
  }, [editQuery])

  // TODO : combine editQuery & editWidgetLayout
  const widgetData =
    isEditWidgetFlow && !isEmpty(report)
      ? produce(
          report.widgets.find((w) => w._id === widgetId),
          (draft) => {
            draft.query = editQuery
            draft.layout = editWidgetLayout
          }
        )
      : {
          ...(widgetId ? { _id: widgetId } : {}),
          query: editQuery,
          layout: editWidgetLayout,
        }

  if (isLoading || isItemDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = isValidQuery(editQuery)

  const handleSaveOrUpdateOfReport = async () => {
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
                layout: editWidgetLayout,
                query: editQuery,
                title,
              }
            }),
            title: reportTitle,
            description: reportDescription,
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
                layout: editWidgetLayout,
                query: editQuery,
                title,
              },
            ],
            title: reportTitle,
            description: reportDescription,
          },
        },
      })
    } else if (isCreateReportWithWidgetFlow) {
      addReportDefinition({
        widgets: [
          {
            layout: editWidgetLayout,
            query: editQuery,
            title,
          },
        ],
        title: reportTitle,
        description: reportDescription,
      })
    }
    setAddingToReport(false)
  }

  const handleApply = () => {
    getChartData({ query: { ...editQuery, limit: 100, offset: 0 } })
  }

  return (
    <div>
      <TitleModal
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        title={title}
        setTitle={setTitle}
        reportTitle={reportTitle}
        setReportTitle={setReportTitle}
        reportDescription={reportDescription}
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
              onClick={() => history.push('/author/reports/report-builder')}
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
      <EditWidgetLayout value={widgetData} onChange={setEditWidgetLayout} />
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

export default enhance(Explore)
