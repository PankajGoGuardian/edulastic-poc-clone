import React from 'react'
import { Card, Menu, Icon, Dropdown, Modal } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { updateReportDefinitionAction } from '../ducks'

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 4px rgba(141, 149, 166, 0.1);
  border-radius: 4px;

  .ant-card-head {
    border: none;
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
          to={`/author/reportBuilder/explore/definition/${report?._id}/widget/${widgetId}`}
        >
          Edit
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
