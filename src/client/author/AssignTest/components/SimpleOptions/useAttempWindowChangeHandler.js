import { useState, useEffect, useRef } from 'react'
import { test as testConst } from '@edulastic/constants'
import {
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
  STUDENT_ATTEMPT_TIME_WINDOW,
  hour12inMiliSec,
  WEEK_DAYS,
} from '@edulastic/constants/const/common'
import { isEmpty } from 'lodash'

const { ATTEMPT_WINDOW_TYPE } = testConst

const useAttemptWindowChangeHandler = (changeField, payload, savedValue) => {
  const initialRender = useRef(true)
  const [selectedAttemptWindowType, setSelectedAttemptWindowType] = useState(
    payload?.type || ATTEMPT_WINDOW_TYPE.DEFAULT
  )
  const [todaysDay] = new Date().toString().split(' ')
  const [selectedDays, setSelectedDays] = useState(
    payload?.days?.reduce(
      (obj, item) =>
        Object.assign(obj, {
          [item]: true,
        }),
      {}
    ) || {
      [todaysDay.toUpperCase()]: true,
    }
  )

  const getMilliSeconds = (time = undefined) => {
    const [timeStr, amPm] = time?.split(' ')
    const [h = 0, m = 0, s = 0] = timeStr?.split(':')
    let timeInMiliSecFor12HourFormat =
      ((+h % 12) * 60 * 60 + +m * 60 + +s) * 1000
    if (amPm === 'PM') {
      timeInMiliSecFor12HourFormat += hour12inMiliSec
    }
    return timeInMiliSecFor12HourFormat
  }

  const [assignmentStartTime, setAssignmentStartTime] = useState(
    payload?.startTime || getMilliSeconds(ATTEMPT_WINDOW_DEFAULT_START_TIME)
  )
  const [assignmentEndTime, setAssignmentEndTime] = useState(
    payload?.endTime || getMilliSeconds(ATTEMPT_WINDOW_DEFAULT_END_TIME)
  )

  const anyOfTheDaysSelected = Object.keys(selectedDays).some(
    (key) => selectedDays[key]
  )

  useEffect(() => {
    const isStartEndTimeSelected =
      assignmentStartTime >= 0 && assignmentEndTime >= 0
    const selectedAttemptWindowInfo = {
      [ATTEMPT_WINDOW_TYPE.WEEKDAYS]: isStartEndTimeSelected && {
        type: ATTEMPT_WINDOW_TYPE.WEEKDAYS,
        startTime: assignmentStartTime,
        endTime: assignmentEndTime,
      },
      [ATTEMPT_WINDOW_TYPE.CUSTOM]: isStartEndTimeSelected &&
        anyOfTheDaysSelected && {
          type: ATTEMPT_WINDOW_TYPE.CUSTOM,
          startTime: assignmentStartTime,
          endTime: assignmentEndTime,
          days: Object.keys(selectedDays).filter((key) => selectedDays[key]),
        },
      [ATTEMPT_WINDOW_TYPE.DEFAULT]: {
        type: ATTEMPT_WINDOW_TYPE.DEFAULT,
      },
    }[selectedAttemptWindowType]
    if (initialRender.current) {
      initialRender.current = false
    } else if (!isEmpty(selectedAttemptWindowInfo)) {
      changeField(STUDENT_ATTEMPT_TIME_WINDOW, selectedAttemptWindowInfo)
    }
  }, [
    selectedAttemptWindowType,
    assignmentStartTime,
    assignmentEndTime,
    selectedDays,
  ])

  const handleStartTimeChange = (_, selectedTime) => {
    const selectedStartTimeInMilliSec = getMilliSeconds(selectedTime)
    if (selectedStartTimeInMilliSec < assignmentEndTime)
      setAssignmentStartTime(selectedStartTimeInMilliSec)
  }

  const handleEndTimeChange = (_, selectedTime) => {
    const selectedEndTimeInMilliSec = getMilliSeconds(selectedTime)
    if (selectedEndTimeInMilliSec > assignmentStartTime)
      setAssignmentEndTime(selectedEndTimeInMilliSec)
  }

  const handleDayChange = (selectedDay) => {
    setSelectedDays((oldState) => ({
      ...oldState,
      [selectedDay]: !oldState[selectedDay],
    }))
  }

  const handleChange = (value) => {
    setSelectedAttemptWindowType(value)
    if (value === 'CUSTOM' && savedValue?.type !== 'CUSTOM') {
      const today = new Date().toLocaleString('en-us', { weekday: 'long' })
      const selectedDay = WEEK_DAYS[today.toUpperCase()]
      setSelectedDays(() => ({
        [selectedDay]: true,
      }))
    }
  }
  return {
    handleStartTimeChange,
    handleEndTimeChange,
    handleDayChange,
    handleChange,
    selectedAttemptWindowType,
    selectedDays,
    assignmentStartTime,
    assignmentEndTime,
  }
}

export default useAttemptWindowChangeHandler
