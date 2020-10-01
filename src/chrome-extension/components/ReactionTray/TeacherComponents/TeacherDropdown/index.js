import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

// import db, { useFirestoreRealtimeDocuments} from "../../../../firebase";
import { MeetFirebase } from '@edulastic/common'

import { ENGAGEMENT_STATUS, COLORS } from '../../../../constants'
import { updateRoomDataAction } from '../../../../reducers/ducks/messages'
import { setDropdownTabAction } from '../../../../reducers/ducks/edulastic'
import TeacherSettings from '../TeacherSettings'
import NavigationLeft from '../../Icons/ArrowLeft'
import {
  Dropdown,
  SubheaderWrapper,
  SubTabsWrapper,
  TabContainer,
  Count,
  Title,
  ListContainer,
  UserContainer,
  Avatar,
  UserTitle,
  TabName,
  TextAvatar,
} from './styled'

const SubHeader = ({ tabName, callback }) => (
  <SubheaderWrapper>
    <div onClick={callback}>
      <NavigationLeft />
    </div>
    <TabName>{tabName}</TabName>
  </SubheaderWrapper>
)

const TabComponent = ({ active, color, count, name, callback }) => (
  <TabContainer active={active} onClick={() => callback(name)}>
    <Count color={color}>{count}</Count>
    <Title>{name}</Title>
  </TabContainer>
)

const SubTabs = ({ tabs = [], active, callback }) => (
  <SubTabsWrapper>
    {tabs.map((tab = {}, i) => (
      <TabComponent
        key={tab.name}
        callback={callback}
        active={active === tab.name}
        {...tab}
      />
    ))}
  </SubTabsWrapper>
)

const UserItem = ({ avatar, fullname = '' }) => (
  <UserContainer>
    {avatar ? (
      <Avatar avatar={avatar} />
    ) : (
      <TextAvatar>{fullname?.[0]?.toUpperCase() || 'A'}</TextAvatar>
    )}
    <UserTitle>{fullname || 'Anonymous'}</UserTitle>
  </UserContainer>
)

const getData = (
  meetingID,
  attendance = [],
  activities = {},
  classData = []
) => {
  const attendanceData = attendance.filter(({ role }) => role === 'student')
  const _data = {}
  attendanceData.forEach((x) => (_data[x] = x))
  const presentStudentsData = Object.keys(_data)
  const presentStudentIds = presentStudentsData.map(({ userId }) => userId)
  const absentStudentsData = classData
    .filter(
      ({ studentId }) => studentId && !presentStudentIds.includes(studentId)
    )
    .map((data = {}) => ({
      ...data,
      fullname: `${data.firstName || ''} ${data.lastName || ''}`,
    }))

  const activitiesByStudent = activities
    .filter(({ userId }) => presentStudentIds.includes(userId))
    .map(({ userId, activities }) => ({
      ...(presentStudentsData.find((x) => x.userId === userId) || {}),
      ...activities[activities.length - 1],
    }))

  const activeStudentsData = activitiesByStudent.filter(
    ({ status }) => status === ENGAGEMENT_STATUS.ACTIVE
  )
  const notEngagedStudentsData = activitiesByStudent.filter(
    ({ status }) =>
      status === ENGAGEMENT_STATUS.INACTIVE ||
      status === ENGAGEMENT_STATUS.DISCONNECT
  )

  // ----------------------Construct Data By Tabs key----------------------------------

  const attendanceDatabyTabs = {
    present: presentStudentsData,
    absent: absentStudentsData,
  }

  const engagementDatabyTabs = {
    active: activeStudentsData,
    'not engaged': notEngagedStudentsData,
    absent: absentStudentsData,
  }

  const data = {
    attendance: attendanceDatabyTabs,
    engagement: engagementDatabyTabs,
  }

  // --------------------------Construct Tabs Data-------------------------------------

  const presentCount = presentStudentsData.length
  const absentCount = absentStudentsData.length
  const activeStudentsCount = activeStudentsData.length
  const notEngagedStudentsCount = notEngagedStudentsData.length

  const attendanceTabsData = [
    {
      name: 'present',
      count: presentCount,
      color: COLORS.PRESENT,
    },
    {
      name: 'absent',
      count: absentCount,
      color: COLORS.ABSENT,
    },
  ]

  const engagementTabData = [
    {
      name: 'active',
      count: activeStudentsCount,
      color: COLORS.ACTIVE,
    },
    {
      name: 'not engaged',
      count: notEngagedStudentsCount,
      color: COLORS.NOT_ENGAGED,
    },
    {
      name: 'absent',
      count: absentCount,
      color: COLORS.ABSENT,
    },
  ]

  const tabs = {
    attendance: attendanceTabsData,
    engagement: engagementTabData,
  }

  return { tabs, data }
}

const initialState = {
  attendance: 'present',
  engagement: 'active',
}

const CommonDropdown = ({
  meetingID,
  isTeacher,
  dropdownTab = '',
  roomData,
  classData,
  setDropdownTab,
}) => {
  const [activeTab, setActiveTab] = useState(initialState[dropdownTab])
  const [attendance, setAttendance] = useState([])
  const [activities, setEngagement] = useState([])

  useEffect(() => setActiveTab(initialState[dropdownTab]), [dropdownTab])

  useEffect(() => {
    if (isTeacher) {
      MeetFirebase.db
        .collection('MeetingUserAttendance')
        .doc(meetingID)
        .onSnapshot((doc) => setAttendance(doc.data().attendance))

      MeetFirebase.db
        .collection('MeetingUserActivity')
        .where('meetingID', '==', meetingID)
        .onSnapshot((querySnapshot) => {
          const _activities = []
          querySnapshot.forEach((doc) => _activities.push(doc.data()))
          setEngagement(_activities)
        })
    }
  }, [])

  console.log('onSnapshot change', attendance, classData, activities)

  const { tabs = [], data = [] } = getData(
    meetingID,
    attendance,
    activities,
    classData
  )

  const isTeacherSettings = dropdownTab === 'teachersettings'

  return (
    <Dropdown>
      {!isTeacherSettings && (
        <SubHeader tabName={dropdownTab} callback={() => setDropdownTab('')} />
      )}
      {!isTeacherSettings ? (
        <>
          <SubTabs
            callback={setActiveTab}
            active={activeTab}
            tabs={tabs[dropdownTab]}
          />
          <ListContainer>
            {data?.[dropdownTab]?.[activeTab]?.map((item, i) => (
              <UserItem key={item.userId || i} {...item} />
            ))}
          </ListContainer>
        </>
      ) : (
        <TeacherSettings />
      )}
    </Dropdown>
  )
}

export default connect(
  (state) => ({
    meetingID: state.meetingsReducer.userData?.meetingID,
    dropdownTab: state.edulasticReducer.dropdownTab,
    roomData: state.meetingsReducer.roomData,
    classData: state.edulasticReducer.classData?.students,
  }),
  {
    updateRoomData: updateRoomDataAction,
    setDropdownTab: setDropdownTabAction,
  }
)(CommonDropdown)
