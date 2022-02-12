import React, { useEffect, useState } from 'react'
import { Collapse, Icon, Spin, Tabs } from 'antd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { groupBy } from 'lodash'
import { MainHeader, MainContentWrapper, EduButton } from '@edulastic/common'

import {
  receiveNotificationsRequestAction,
  getError,
  getLoader,
  getNotificationsList,
} from '../ducks'

const { Panel } = Collapse
const { TabPane } = Tabs

const Notification = ({ loading, error, notifications, getNotifications }) => {
  const [notificationGroups, setNotificationGroups] = useState([])
  useEffect(() => {
    getNotifications()
  }, [])

  useEffect(() => {
    setNotificationGroups(groupBy(notifications, 'topicType'))
  }, [notifications])
  // @todo filter notification based on today and past.
  // @todo add an empty container for no notifications case.

  const renderNotificationCollapseContainer = (notificationGroupsData) => (
    <StyledCollapse style={{ padding: '0px' }} accordion>
      {Object.keys(notificationGroupsData).map((groupName) => (
        <Panel header={groupName}>
          <ListContainer>
            {notificationGroupsData[groupName].map((notification) => (
              <ListItemContainer isMarkedAsRead={notification.markAsRead}>
                <ListItemInfo>
                  <h4>{notification.title}</h4>
                  <p>{notification.description}</p>
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
  )

  return (
    <>
      <MainHeader headingText="Notifications" />
      <MainContentWrapper>
        {loading ? (
          <Spin />
        ) : (
          <Tabs>
            <TabPane tab="Today's Notifications" key="today">
              {renderNotificationCollapseContainer(notificationGroups)}
            </TabPane>
            <TabPane tab="Past Notifications" key="past">
              {renderNotificationCollapseContainer(notificationGroups)}
            </TabPane>
          </Tabs>
        )}
      </MainContentWrapper>
    </>
  )
}

const enhance = compose(
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
