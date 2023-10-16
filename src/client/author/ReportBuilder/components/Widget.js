import React from 'react'
import { Card, Menu, Icon, Dropdown, Modal } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { themeColorLighter1, white } from '@edulastic/colors'

import { updateReportDefinitionAction } from '../ducks'

const StyledCard = styled(Card)`
  border-radius: 15px;
  background-color: ${white};
  box-shadow: 0px 3px 8px #00000029;
  .ant-card-head {
    border: none;
    padding-left: 0px;
    .ant-card-head-wrapper {
      justify-content: space-between;
      width: 100%;
      .ant-card-head-title {
        font-size: 15px;
        font-weight: bold;
        max-width: fit-content;
        padding-inline: 30px;
        align-self: stretch;
        display: flex;
        place-items: center;
        background-color: ${themeColorLighter1};
        border-radius: 15px 0px;
      }
    }
  }
  .ant-card-body {
    padding-top: 12px;
  }
`

const WidgetDropdown = ({ updateReport, widgetId, report }) => {
  const WidgetDropdownMenu = (
    <Menu>
      <Menu.Item>
        <Link
          to={`/author/reports/report-builder/explore/definition/${report._id}/widget/${widgetId}`}
        >
          Edit
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: `/author/reports/report-builder/explore/definition/${report._id}/`,
            state: { widget: report.widgets.find((w) => w._id === widgetId) },
          }}
        >
          Create New
        </Link>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            okText: 'Yes',
            cancelText: 'No',

            onOk() {
              updateReport({
                definitionId: report._id,
                updateDoc: {
                  $set: {
                    widgets: report.widgets.filter((o) => o._id !== widgetId),
                  },
                },
                isReportDefinitionPage: true,
              })
            },
          })
        }
      >
        Delete
      </Menu.Item>
    </Menu>
  )
  return (
    <Dropdown
      overlay={WidgetDropdownMenu}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Icon type="menu" />
    </Dropdown>
  )
}

const Widget = ({ updateReport, widgetId, children, title, report }) => (
  <StyledCard
    title={title}
    bordered={false}
    style={{
      height: '100%',
      width: '100%',
    }}
    bodyStyle={{
      height: 'calc(100% - 53px)', // TODO `53px` is the height of the card header. Find alternative.
    }}
    extra={
      <WidgetDropdown
        updateReport={updateReport}
        widgetId={widgetId}
        report={report}
      />
    }
  >
    {children}
  </StyledCard>
)

const enhance = compose(
  connect(() => ({}), {
    updateReport: updateReportDefinitionAction,
  })
)

export default enhance(Widget)
