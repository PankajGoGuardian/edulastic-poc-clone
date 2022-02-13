import React, { useEffect, useState } from 'react'
import { Collapse, Icon, Spin, Tabs, Badge, Tooltip } from 'antd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { groupBy } from 'lodash'
import { withRouter } from 'react-router-dom'

import { MainHeader, MainContentWrapper } from '@edulastic/common'
import { redDark, themeColor } from '@edulastic/colors'
import {
  notificationStatus,
  topicMeta,
  updateUserNotifications,
} from '../helpers'

import {
  receiveNotificationsRequestAction,
  getError,
  getLoader,
  getNotificationsList,
} from '../ducks'

const { Panel } = Collapse
const { TabPane } = Tabs

const Notification = ({ loading, notifications, history }) => {
  const [todayNotifications, setTodayNotifications] = useState([])
  const [pastNotifications, setPastNotifications] = useState([])

  useEffect(() => {
    const notificationsWithTopicsMeta = notifications.map((notification) => ({
      ...notification,
      ...topicMeta[notification.topicType],
    }))
    // console.log('Active notifications', notificationsWithTopicsMeta)
    const _todayNotifications = []
    const _pastNotifications = []
    const todayDateStr = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    for (const notification of notificationsWithTopicsMeta) {
      const activeAtDateStr = new Date(notification.activeAt).toLocaleString(
        'en-GB',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      )
      if (todayDateStr === activeAtDateStr) {
        _todayNotifications.push(notification)
      } else {
        _pastNotifications.push(notification)
      }
    }
    setTodayNotifications(_todayNotifications)
    setPastNotifications(_pastNotifications)
  }, [notifications])

  const handleClickAction = (url) => {
    if (url) {
      history.push(url)
    }
  }

  const renderNotificationCollapseContainer = (notificationsData) => {
    const notificationGroupsData = groupBy(notificationsData, 'labelGroup')
    return Object.keys(notificationGroupsData).length > 0 ? (
      <StyledCollapse style={{ padding: '0px' }} accordion>
        {Object.keys(notificationGroupsData).map((groupName) => (
          <Panel header={groupName}>
            <ListContainer>
              {notificationGroupsData[groupName].map((notification) => (
                <ListItemContainer status={notification.status}>
                  <ListItemInfo
                    style={{
                      cursor: `${notification.URL ? 'pointer' : 'auto'}`,
                    }}
                    onClick={() => handleClickAction(notification.URL || '')}
                  >
                    <p>{notification.message}</p>
                  </ListItemInfo>
                  <ListItemAction>
                    <Tooltip
                      title={`Expires: ${new Date(
                        notification.expiresAt
                      ).toString()}`}
                    >
                      <Icon
                        type="history"
                        style={{ color: themeColor, margin: '0 5px 0 15px' }}
                      />
                      {new Date(notification.expiresAt).toLocaleString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }
                      )}
                    </Tooltip>
                    <Tooltip title="Mark as Read">
                      <Icon
                        type="check-circle"
                        style={{ color: themeColor, margin: '0 5px 0 15px' }}
                        theme={
                          notification.status == notificationStatus.SEEN
                            ? 'outlined'
                            : 'filled'
                        }
                        onClick={() =>
                          notification.status == notificationStatus.ARCHIVED
                            ? {}
                            : notification.status == notificationStatus.SEEN
                            ? updateUserNotifications([notification], {
                                status: notificationStatus.READ,
                              })
                            : updateUserNotifications([notification], {
                                status: notificationStatus.SEEN,
                              })
                        }
                      />
                      Read
                    </Tooltip>
                    <Tooltip title="Mark as Archived">
                      <Icon
                        type="delete"
                        style={{ color: redDark, margin: '0 5px 0 10px' }}
                        theme={
                          notification.status == notificationStatus.ARCHIVED
                            ? 'filled'
                            : 'outlined'
                        }
                        onClick={() =>
                          notification.status == notificationStatus.ARCHIVED
                            ? updateUserNotifications([notification], {
                                status: notificationStatus.READ,
                              })
                            : updateUserNotifications([notification], {
                                status: notificationStatus.ARCHIVED,
                              })
                        }
                      />
                      Archived
                    </Tooltip>
                  </ListItemAction>
                </ListItemContainer>
              ))}
            </ListContainer>
          </Panel>
        ))}
      </StyledCollapse>
    ) : (
      <StyledEmptyContainer>
        <Icon type="bell" theme="filled" />
        <h4>No Notifications</h4>
      </StyledEmptyContainer>
    )
  }

  return (
    <>
      <MainHeader
        headerLeftClassName="headerLeftWrapper"
        headingText="Notifications"
        Icon={() => <Icon type="message" theme="filled" />}
      />
      <MainContentWrapper>
        {loading ? (
          <Spin />
        ) : (
          <Tabs>
            <TabPane
              tab={
                <>
                  <span>Today&apos;s Notifications</span>
                  <StyledBadge
                    count={
                      todayNotifications.filter(
                        (n) => n.status == notificationStatus.SEEN
                      ).length
                    }
                  />
                </>
              }
              key="today"
            >
              {renderNotificationCollapseContainer(todayNotifications)}
            </TabPane>
            <TabPane
              tab={
                <>
                  <span>Past Notifications</span>
                  <StyledBadge
                    count={
                      pastNotifications.filter(
                        (n) => n.status == notificationStatus.SEEN
                      ).length
                    }
                  />
                </>
              }
              key="past"
            >
              {renderNotificationCollapseContainer(pastNotifications)}
            </TabPane>
          </Tabs>
        )}
      </MainContentWrapper>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      loading: getLoader(state),
      error: getError(state),
      notifications: getNotificationsList(state),
    }),
    {
      getNotifications: receiveNotificationsRequestAction,
    }
  )
)

export default enhance(Notification)

const StyledCollapse = styled(Collapse)`
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0px;
  }
`

const ListContainer = styled.div`
  padding: 0px 0px;
`
const ListItemInfo = styled.div`
  width: 100%;
`

const ListItemAction = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`

const ListItemContainer = styled.div`
  display: flex;
  justify-items: flex-end;
  padding: 5px;
  margin: 5px;
  border: ${({ status }) =>
    status === notificationStatus.SEEN
      ? '1px solid #dfdfdf'
      : '1px dashed #dfdfdf'};
  border-radius: 4px;
  background: ${({ status }) =>
    status === notificationStatus.READ
      ? '#eeffff'
      : status === notificationStatus.ARCHIVED
      ? ' #ffeeff'
      : '#ffffff'};
`

const StyledEmptyContainer = styled.div`
  text-align: center;
  background: #dfdfdf;
  height: 100px;
  line-height: 100px;

  h4 {
    margin-left: 10px;
    display: inline;
  }
`

const StyledBadge = styled(Badge)`
  margin-left: 10px;
`
