import React, { useEffect, useState } from 'react'
import { Collapse, Icon, Spin, Tabs, Badge } from 'antd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { groupBy } from 'lodash'
import { withRouter } from 'react-router-dom'

import { MainHeader, MainContentWrapper, EduButton } from '@edulastic/common'
import { notificationStatus, topicMeta } from '../helpers'

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
    const notificationsWithTopicsMeta = notifications.map((n) => ({
      ...n,
      ...topicMeta[n.topicType],
    }))
    console.log('Active notifications', notificationsWithTopicsMeta)
    const _todayNotifications = []
    const _pastNotifications = []
    for (const notification of notificationsWithTopicsMeta) {
      const daysDiff =
        (Date.now() - notification.activeAt) / (24 * 60 * 60 * 1000)
      if (daysDiff > 1) {
        _pastNotifications.push(notification)
      } else {
        _todayNotifications.push(notification)
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
                <ListItemContainer
                  isMarkedAsRead={
                    notification.status == notificationStatus.READ
                  }
                >
                  <ListItemInfo
                    style={{
                      cursor: `${notification.URL ? 'pointer' : 'auto'}`,
                    }}
                    onClick={() => handleClickAction(notification.URL || '')}
                  >
                    <p>{notification.message}</p>
                  </ListItemInfo>
                  <ListItemAction>
                    {!notification.markAsRead && (
                      <EduButton isGhost>
                        Mark As Read
                        <Icon type="check-square" theme="filled" />
                      </EduButton>
                    )}
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
      <MainHeader headingText="Notifications" />
      <MainContentWrapper>
        {loading ? (
          <Spin />
        ) : (
          <Tabs>
            <TabPane
              tab={
                <>
                  <span>Today&apos;s Notifications</span>
                  <StyledBadge count={todayNotifications.length || 0} />
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
                  <StyledBadge count={pastNotifications.length || 0} />
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
`

const ListItemContainer = styled.div`
  display: flex;
  justify-items: flex-end;
  padding: 0px 10px;
  margin: 10px 0px;
  background: ${({ isMarkedAsRead }) =>
    isMarkedAsRead ? '#dfdfdf' : '#ffffff'};
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
