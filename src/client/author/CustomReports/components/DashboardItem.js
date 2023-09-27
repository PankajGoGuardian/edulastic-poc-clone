import React from 'react'
import { Card, Menu, Icon, Dropdown, Modal } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { deleteDashboardItemAction } from '../ducks'

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

const DashboardItemDropdown = ({ deleteDashboardItem, itemId }) => {
  const dashboardItemDropdownMenu = (
    <Menu>
      <Menu.Item>
        <Link to={`/author/customReports/explore?itemId=${itemId}`}>Edit</Link>
      </Menu.Item>
      <Menu.Item
        onClick={() =>
          Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            okText: 'Yes',
            cancelText: 'No',

            onOk() {
              deleteDashboardItem({
                id: itemId,
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
      overlay={dashboardItemDropdownMenu}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Icon type="menu" />
    </Dropdown>
  )
}

const DashboardItem = ({ deleteDashboardItem, itemId, children, title }) => (
  <StyledCard
    title={title}
    bordered={false}
    style={{
      height: '100%',
      width: '100%',
    }}
    extra={
      <DashboardItemDropdown
        deleteDashboardItem={deleteDashboardItem}
        itemId={itemId}
      />
    }
  >
    {children}
  </StyledCard>
)

const enhance = compose(
  connect(() => ({}), {
    deleteDashboardItem: deleteDashboardItemAction,
  })
)

export default enhance(DashboardItem)
