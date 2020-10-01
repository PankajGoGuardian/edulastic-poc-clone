import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase/app'

import { MeetFirebase } from '@edulastic/common'
import { evaluateItem } from '../../../client/author/src/utils/evalution'
import TrayActionButton from './TrayActionButton'
import {
  setDropdownTabAction,
  setQuestionItemsAction,
} from '../../reducers/ducks/edulastic'
import { setBroadcastModalAction } from '../../reducers/ducks/settings'
import { keyBy } from '../../utils'

import BroadcastModal from '../BroadcastModal'
import CommonDropdown from './TeacherComponents/TeacherDropdown'
import EduLogo from './Icons/Logo'
import AttendanceIcon from './Icons/Attendance'
import EngagementIcon from './Icons/Engagement'
import BroadcastIcon from './Icons/Broadcast'
import IconChat from './Icons/Chat'
import Settings from './Icons/Settings'
import { ReactionsButton, HandUpButton, SettingsButton } from '../ActionButtons'
import { MainTray, WrapperContainer, LoginBtn } from './styled'

const TeacherTray = ({ dropdownTab, setDropdownTab }) => (
  <div style={{ display: 'flex', background: 'white' }}>
    <TrayActionButton
      active={dropdownTab === 'attendance'}
      icon={<AttendanceIcon />}
      callback={() => setDropdownTab('attendance')}
    />
    <TrayActionButton
      active={dropdownTab === 'engagement'}
      text="Engagement"
      icon={<EngagementIcon />}
      callback={() => setDropdownTab('engagement')}
    />
    <TrayActionButton
      active={dropdownTab === 'checklist'}
      text="CheckList"
      icon={<BroadcastIcon />}
      callback={() => {
        setDropdownTab('')
        window.open(`${process.env.BROADCAST_URL}`, '_blank')
      }}
    />
    <TrayActionButton
      active={dropdownTab === 'teachersettings'}
      text="TeacherSettings"
      icon={<Settings />}
      callback={() => setDropdownTab('teachersettings')}
    />
  </div>
)

const StudentTray = ({
  authToken,
  isUserLoaded,
  activeToneId = 0,
  dropdownTab,
  isReactionsVisible,
  setDropdownTab,
  setReactionsDropdown,
}) => (
  <div style={{ display: 'flex', background: 'white' }}>
    {authToken ? (
      (isUserLoaded && (
        <>
          <ReactionsButton
            activeToneId={activeToneId}
            visible={isReactionsVisible}
            callback={() => setReactionsDropdown((x) => !x)}
          />
          <HandUpButton activeToneId={activeToneId} />
          <TrayActionButton
            active={dropdownTab === 'ask'}
            icon={<IconChat />}
            callback={() => setDropdownTab('ask')}
          />
          <TrayActionButton
            active={dropdownTab === 'studentsettings'}
            text="StudentSettings"
            icon={<Settings />}
            callback={() => setDropdownTab('studentsettings')}
          />
        </>
      )) ||
      null
    ) : (
      <LoginBtn
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <a href="http://edulastic-poc.snapwiz.net/login#login" target="_blank">
          Log In
        </a>
      </LoginBtn>
    )}
  </div>
)

const getCurrentEvaluation = async (userAnswer, item) => {
  const questions = keyBy(item.data.questions, 'id')
  const evaluation = await evaluateItem(
    userAnswer,
    questions,
    item.itemLevelScoring,
    item.maxScore
  )
  return evaluation
}

const ReactionTray = ({
  isUserLoaded,
  authToken,
  userRole,
  meetingID,
  userId,
  dropdownTab,
  setDropdownTab,
  isBroadcastModalVisible = false,
  setBroadcastModal,
  questionItems = [],
  setQuestionItems,
  userAnswer = {},
}) => {
  console.log('questionItems', questionItems)
  const [isReactionsVisible, setReactionsDropdown] = useState(false)
  const [isSettingsVisible, setSettingsDropdown] = useState(false)

  // rnt-jbbt-mri
  // 5e4a6c9b1838d70007432954
  // rnt-jbbt-mri-5e4a6c9b1838d70007432954

  useEffect(() => {
    if (meetingID && userId) {
      MeetFirebase.db
        ?.collection('MeetingUserQuestions')
        .doc(`${meetingID}-${userId}`)
        .onSnapshot((doc) => {
          const { questions = [], evaluations = [] } = doc.data() || {}
          const attemptedItemIds = evaluations.map(({ itemId }) => itemId)
          const pendingItems = questions.filter(
            ({ _id }) => !attemptedItemIds.includes(_id)
          )
          console.log('pendingItems', pendingItems)
          setQuestionItems(pendingItems)
          if (!pendingItems.length) setBroadcastModal(false)
          else setBroadcastModal(true)
        })
    }
  }, [meetingID, userId])

  const handler = async (item, skipped) => {
    if (meetingID && userId) {
      const evaluation = skipped
        ? {}
        : await getCurrentEvaluation(userAnswer, item)

      const _evaluation = {
        itemId: item._id || null,
        userAnswer: skipped ? [] : userAnswer,
        skipped,
        evaluation,
      }

      const docRef = await MeetFirebase.db
        .collection('MeetingUserQuestions')
        .doc(`${meetingID}-${userId}`)

      docRef.get().then((doc) => {
        if (doc.exists) {
          docRef.update({
            evaluations: firebase.firestore.FieldValue.arrayUnion(_evaluation),
          })
        } else {
          console.log(`Document Doesn't Exist !`)
        }
      })
    } else {
      console.log('MeetingID && userId are required : ', { meetingID, userId })
    }
  }

  const activeToneId = parseInt(localStorage.getItem('edu-skinTone')) || 0

  const isTeacher = ['teacher', 'admin'].includes(userRole)

  const userProps = {
    isReactionsVisible,
    activeToneId,
    isSettingsVisible,
    setReactionsDropdown,
    setSettingsDropdown,
    dropdownTab,
    setDropdownTab,
  }

  return (
    <WrapperContainer>
      <MainTray>
        <EduLogo />
        {userRole && isTeacher ? (
          <TeacherTray {...userProps} />
        ) : (
          <StudentTray
            authToken={authToken}
            isUserLoaded={isUserLoaded}
            {...userProps}
          />
        )}
      </MainTray>
      {dropdownTab && <CommonDropdown isTeacher={isTeacher} />}
      {userRole && !isTeacher && isBroadcastModalVisible && (
        <BroadcastModal
          visible={isBroadcastModalVisible}
          handleSkip={() => handler(questionItems[0], true)}
          handleSubmit={() => handler(questionItems[0], false)}
          item={questionItems[0]}
        />
      )}
    </WrapperContainer>
  )
}

export default connect(
  (state) => ({
    authToken: state.edulasticReducer.authToken,
    userRole: state.edulasticReducer.user?.role,
    meetingID: state.meetingsReducer?.userData?.meetingID,
    userId: state.edulasticReducer.user?._id,
    isUserLoaded: Object.keys(state.edulasticReducer.user).length,
    dropdownTab: state.edulasticReducer.dropdownTab,
    isBroadcastModalVisible: state.settingsReducer.isBroadcastModalVisible,
    questionItems: state.edulasticReducer.questionItems,
    evaluation: state.edulasticReducer.evaluation,
    userAnswer: state.edulasticReducer.userAnswer,
  }),
  {
    setDropdownTab: setDropdownTabAction,
    setBroadcastModal: setBroadcastModalAction,
    setQuestionItems: setQuestionItemsAction,
  }
)(ReactionTray)
