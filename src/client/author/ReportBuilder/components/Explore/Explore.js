import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import produce from 'immer'
import { Button, Spin } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { TitleModal } from '../TitleModal'
import { PageHeader } from '../PageHeader'
import { ExploreTitle } from '../ExploreTitle'
import { EditWidgetLayout } from '../EditWidgetLayout'
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
  setReportDataAction,
} from '../../ducks'
import { WidgetQueryBuilder } from '../WidgetQueryBuilder'
import {
  DEFAULT_PAGESIZE,
  DEFAULT_WIDGET_LAYOUT,
  DEFAULT_REPORT_STATE,
  isValidQuery,
} from '../../const'

/**
 * @param {string} name
 */
const nextName = (name) => {
  let appended = false
  const appendedName = name.replace(/ - copy (\d+)$/, (match, number) => {
    appended = true
    return ` - copy ${parseInt(number, 10) + 1}`
  })
  return appended ? appendedName : `${name} - copy 1`
}

// TODO create custom hooks inside `./hooks` to reduce component size
const Explore = (props) => {
  const {
    history,
    getReportData,
    isLoading,
    getMetaData,
    isWidgetDataLoading,
    report,
    dataSources,
    getChartData,
    match,
    addReportDefinition,
    updateReportDefinition,
    setChartData,
    setReportData,
  } = props
  const { widget: sourceWidget } = history.location.state || {}
  const { definitionId, widgetId } = match.params
  const isEditWidgetFlow = definitionId && widgetId
  const isAddWidgetToReportFlow = definitionId && !widgetId
  const isCreateReportWithWidgetFlow = !definitionId && !widgetId

  const [addingToReport, setAddingToReport] = useState(false)
  // TODO combine editQuery & editWidgetLayout & title into editWidget.
  const [editQuery, setEditQuery] = useState(
    sourceWidget ? sourceWidget.query : {}
  )
  const [editWidgetLayout, setEditWidgetLayout] = useState(
    sourceWidget ? sourceWidget.layout : DEFAULT_WIDGET_LAYOUT
  )
  const [title, setTitle] = useState(
    sourceWidget ? nextName(sourceWidget.title) : 'New Widget'
  )
  const [editReport, setEditReport] = useState({
    ...DEFAULT_REPORT_STATE,
    ...report,
  })

  useEffect(() => {
    if (definitionId) {
      getReportData(definitionId)
    }
  }, [definitionId])

  useEffect(() => {
    if (isEmpty(report)) return
    setEditReport(report)
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

  const [titleModalVisible, setTitleModalVisible] = useState(false)

  useEffect(() => {
    getMetaData()
    return () => {
      setReportData({})
    }
  }, [])

  useEffect(() => {
    if (!isValidQuery(editQuery)) {
      setChartData({ widgetId: 'draft', data: {} })
    }
  }, [editQuery])

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

  if (isLoading || isWidgetDataLoading) {
    return <Spin />
  }

  const canAddOrUpdateChart = isValidQuery(editQuery)

  const handleSaveOrUpdateOfReport = async () => {
    setTitleModalVisible(false)
    setAddingToReport(true)
    if (isEditWidgetFlow) {
      updateReportDefinition({
        definitionId: editReport._id,
        updateDoc: {
          $set: {
            ...editReport,
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
          },
        },
      })
    } else if (isAddWidgetToReportFlow) {
      updateReportDefinition({
        definitionId: editReport._id,
        updateDoc: {
          $set: {
            ...editReport,
            widgets: [
              ...report.widgets,
              {
                layout: editWidgetLayout,
                query: editQuery,
                title,
              },
            ],
          },
        },
      })
    } else if (isCreateReportWithWidgetFlow) {
      addReportDefinition({
        ...editReport,
        widgets: [
          {
            layout: editWidgetLayout,
            query: editQuery,
            title,
          },
        ],
      })
    }
    setAddingToReport(false)
  }

  // TODO: Have pagination prop inside editQuery
  const handleApply = () => {
    getChartData({
      query: { ...editQuery, limit: DEFAULT_PAGESIZE, offset: 0, total: true },
    })
  }

  return (
    <div>
      <TitleModal
        titleModalVisible={titleModalVisible}
        setTitleModalVisible={setTitleModalVisible}
        title={title}
        setTitle={setTitle}
        editReport={editReport}
        setEditReport={setEditReport}
        handleSaveOrUpdateOfReport={handleSaveOrUpdateOfReport}
      />
      <PageHeader
        title={<ExploreTitle widgetTitle={title} />}
        button={
          <>
            <Button key="apply-button" type="primary" onClick={handleApply}>
              Apply
            </Button>
            <Link to="/author/reports/report-builder">
              <Button
                key="goto-report-button"
                type="primary"
                style={{ marginLeft: '15px' }}
              >
                Go to Reports List
              </Button>
            </Link>
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
      isWidgetDataLoading: getIsWidgetDataLoadingSelector(state),
      report: getActiveReportSelector(state),
    }),
    {
      getMetaData: getMetaDataAction,
      getReportData: getReportDataAction,
      getChartData: getChartDataAction,
      addReportDefinition: addReportDefinitionAction,
      updateReportDefinition: updateReportDefinitionAction,
      setChartData: setChartDataAction,
      setReportData: setReportDataAction,
    }
  )
)

export default enhance(Explore)
