import React from 'react'
import { Modal, Input } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'
import {
  addReportDefinitionAction,
  updateReportDefinitionAction,
} from '../ducks'
import { formatQueryData } from '../util'

const TitleModal = ({
  history,
  widgetData,
  titleModalVisible,
  setTitleModalVisible,
  setAddingToReport,
  query,
  finalTitle,
  setTitle,
  finalReportTitle,
  setReportTitle,
  finalReportDescription,
  setReportDescription,
  addReportDefinition,
  updateReport,
  selectedChartType,
  isEditWidgetFlow,
  isAddWidgetToReportFlow,
  isCreateReportWithWidgetFlow,
  report,
}) => {
  return (
    <Modal
      key="modal"
      title="Save Report"
      visible={titleModalVisible}
      onOk={async () => {
        setTitleModalVisible(false)
        setAddingToReport(true)
        if (isEditWidgetFlow) {
          updateReport({
            updateDoc: {
              $set: {
                ...report,
                widgets: [
                  ...report.widgets.filter((o) => o._id !== widgetData._id),
                  {
                    ...widgetData,
                    layout: {
                      type: selectedChartType,
                      options: widgetData.layout.options,
                    },
                    query: { ...formatQueryData(query) },
                    name: finalTitle,
                  },
                ],
                name: finalReportTitle,
                description: finalReportDescription,
              },
            },
          })
        } else if (isAddWidgetToReportFlow) {
          updateReport({
            updateDoc: {
              $set: {
                ...report,
                widgets: [
                  report.widgets,
                  {
                    layout: {
                      type: selectedChartType,
                      options: {
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 8,
                      },
                    },
                    query: { ...formatQueryData(query) },
                    name: finalTitle,
                  },
                ],
                name: finalReportTitle,
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
                  },
                },
                query: { ...formatQueryData(query) },
                name: finalTitle,
              },
            ],
            name: finalReportTitle,
            description: finalReportDescription,
          })
        }
        setAddingToReport(false)
      }}
      onCancel={() => setTitleModalVisible(false)}
    >
      <StyledDiv>Widget Name</StyledDiv>
      <Input
        placeholder="Widget Name"
        value={finalTitle}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledDiv>Report Name</StyledDiv>
      <Input
        placeholder="Report Name"
        value={finalReportTitle}
        onChange={(e) => setReportTitle(e.target.value)}
      />
      <StyledDiv>Report Description</StyledDiv>
      <Input
        placeholder="Report Description"
        value={finalReportDescription}
        onChange={(e) => setReportDescription(e.target.value)}
      />
    </Modal>
  )
}

const enhance = compose(
  connect(() => ({}), {
    addReportDefinition: addReportDefinitionAction,
    updateReport: updateReportDefinitionAction,
  })
)

export default enhance(TitleModal)

const StyledDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 3px;
  font-weight: 700;
  color: ${themeColor};
`
