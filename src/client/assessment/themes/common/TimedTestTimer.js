import React, { useEffect, useState, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { firestore } from 'firebase'
import { Icon, notification } from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment'
import { isEqual, omit } from 'lodash'
import { white, red } from '@edulastic/colors'
import useInterval from '@use-it/interval'
import { db } from '@edulastic/common/src/Firebase'
import AssignmentTimeEndedAlert from './AssignmentTimeEndedAlert'
import { utaStartTimeUpdateRequired } from '../../../student/sharedDucks/AssignmentModule/ducks'

export const TIME_UPDATE_TYPE = {
  START: 'start',
  RESUME: 'resume',
}

const UTA_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
}

const TIMER_INTERVAL = 1000
const SYNC_INTERVAL = 30000
const CAUTION_TIME = 120000

const getFormattedTime = (currentAssignmentTime) => {
  const duration = moment.duration(currentAssignmentTime)
  const h = duration.hours()
  const m = duration.minutes()
  const s = duration.seconds()
  const time = `${h > 9 ? h : `0${h}`} : ${m > 9 ? m : `0${m}`} : ${
    s > 9 ? s : `0${s}`
  }`
  return time
}

const firestoreCollectionName = 'timedAssignmentUTAs'

function handlePaused(history) {
  // TODO: replace with proper text as required
  notification.open({
    message: 'The assignment is paused',
    description: `The assignment can't be attempted now , since its in paused state`,
  })
  history.push('/home/assignments')
}

const TimedTestTimer = ({
  utaId,
  history,
  groupId,
  fgColor,
  bgColor = 'transparent',
  updateUtaTimeType = null,
  resetUpdateUtaType,
  isPasswordValidated,
}) => {
  const [uta, setUtaDoc] = useState()
  const [upstreamUta, setUpstreamUta] = useState()
  const [autoSubmitPopUp, setAutoSubmitpopUp] = useState(false)
  const [currentAssignmentTime, setCurrentAssignmentTime] = useState(null)
  const docRef = useRef(db.collection(firestoreCollectionName).doc(utaId))

  useEffect(() => {
    let unsubscribe = () => {}
    unsubscribe = db
      .collection(firestoreCollectionName)
      .doc(utaId)
      .onSnapshot((_doc) => setUpstreamUta(_doc.data()))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const isModified = !isEqual(
      omit(uta, ['lastResumed', 'timeSpent']),
      omit(upstreamUta, ['lastResumed', 'timeSpent'])
    )

    if (isModified) {
      setUtaDoc(upstreamUta)
      const pausedByStudent =
        upstreamUta &&
        upstreamUta.status === UTA_STATUS.PAUSED &&
        !upstreamUta?.byTeacher
      const initialUtaUpdate =
        upstreamUta &&
        upstreamUta.status === UTA_STATUS.ACTIVE &&
        updateUtaTimeType === TIME_UPDATE_TYPE.START
      const isPasswordProtected =
        isPasswordValidated && updateUtaTimeType === TIME_UPDATE_TYPE.RESUME
      const timeStamp = firestore.FieldValue.serverTimestamp()
      if (pausedByStudent || initialUtaUpdate || isPasswordProtected) {
        let data = { startTime: timeStamp }
        if (updateUtaTimeType === TIME_UPDATE_TYPE.RESUME) {
          const timeStampType =
            !uta || uta?.startTime
              ? { lastResumed: timeStamp }
              : { startTime: timeStamp }
          data = {
            ...timeStampType,
            status: UTA_STATUS.ACTIVE,
          }
        }
        resetUpdateUtaType(null)
        docRef.current.update(data)
      } else if (upstreamUta?.status === UTA_STATUS.PAUSED) {
        // this shouldn't happen.
        console.warn("This shouldn't happen. the assignment is already paused")
        handlePaused(history)
      }

      if (currentAssignmentTime === null) {
        setCurrentAssignmentTime(
          upstreamUta?.allowedTime - (upstreamUta?.timeSpent || 0) || 0
        )
      } else if (
        upstreamUta.allowedTime &&
        uta.allowedTime &&
        upstreamUta.allowedTime !== uta.allowedTime
      ) {
        // If teacher updated time in LCB : sync the timeSpent and reflect changes in UI
        setCurrentAssignmentTime((_currentTime) => {
          docRef.current.get().then((snapshot) => {
            const { timeSpent = 0 } = snapshot.data()
            const _syncOffset = uta.allowedTime - currentAssignmentTime || 0
            docRef.current.update({
              lastResumed: firestore.FieldValue.serverTimestamp(),
              timeSpent: Math.max(timeSpent, _syncOffset),
            })
          })
          return (
            upstreamUta?.allowedTime - (uta?.allowedTime - _currentTime) || 0
          )
        })
      }
    }
  }, [upstreamUta, uta, updateUtaTimeType])

  const timerPaused = uta?.status === UTA_STATUS.PAUSED

  useEffect(() => {
    if (timerPaused && uta?.byTeacher) {
      handlePaused(history)
    }
  }, [timerPaused])

  useInterval(() => {
    if (!timerPaused && currentAssignmentTime !== null) {
      if (currentAssignmentTime < 0) {
        setAutoSubmitpopUp(true)
      } else {
        setCurrentAssignmentTime((oldTime) => oldTime - TIMER_INTERVAL)
      }
    }
  }, TIMER_INTERVAL)

  useInterval(() => {
    if (docRef && utaId && currentAssignmentTime && currentAssignmentTime > 0) {
      if (docRef.current) {
        docRef.current.get().then((snapshot) => {
          const { timeSpent = 0 } = snapshot.data()
          const _syncOffset = uta.allowedTime - currentAssignmentTime || 0
          docRef.current.update({
            lastResumed: firestore.FieldValue.serverTimestamp(),
            timeSpent: Math.max(timeSpent, _syncOffset),
          })
        })
      } else {
        Sentry.captureException(
          new Error(
            `[Timed Assignment] Missing Doc Ref at time ${currentAssignmentTime}ms on uta ${utaId} and group ${groupId}`
          )
        )
      }
    } else if (currentAssignmentTime > 0) {
      Sentry.captureException(
        new Error(
          `[Timed Assignment] Unable to Sync time ${currentAssignmentTime} on uta ${utaId} and group ${groupId}`
        )
      )
    }
  }, SYNC_INTERVAL)

  return (
    <>
      {uta && currentAssignmentTime !== 0 && (
        <TimerWrapper
          isDanger={currentAssignmentTime <= CAUTION_TIME}
          fgColor={fgColor}
          bgColor={bgColor}
        >
          <Icon type="clock-circle" />
          <Label
            isDanger={currentAssignmentTime <= CAUTION_TIME}
            fgColor={fgColor}
          >
            {getFormattedTime(
              currentAssignmentTime < 0 ? 0 : currentAssignmentTime
            )}
          </Label>
        </TimerWrapper>
      )}
      {autoSubmitPopUp && uta && (
        <AssignmentTimeEndedAlert
          isVisible={autoSubmitPopUp}
          groupId={groupId}
          utaId={utaId}
        />
      )}
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      updateUtaTimeType: state.studentAssignment.updateUtaTimeType,
      isPasswordValidated: state.test.isPasswordValidated,
    }),
    {
      resetUpdateUtaType: utaStartTimeUpdateRequired,
    }
  )
)

export default enhance(TimedTestTimer)

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  min-height: 40px;
  margin-left: 16px;
  border-radius: 5px;
  padding: ${({ bgColor }) => bgColor && '2px 10px'};
  background: ${({ bgColor }) => bgColor};

  i {
    color: ${({ fgColor, isDanger }) => (isDanger ? red : fgColor || white)};
    transform: scale(1.5);
  }
`

const Label = styled.label`
  font-weight: 600;
  color: ${({ fgColor, isDanger }) => (isDanger ? red : fgColor || white)};
  margin-left: 10px;
`
