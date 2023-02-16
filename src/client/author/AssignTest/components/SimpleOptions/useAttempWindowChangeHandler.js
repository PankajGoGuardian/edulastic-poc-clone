import { useState, useEffect, useRef } from 'react'
import { test as testConst } from '@edulastic/constants'
import {
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
  STUDENT_ATTEMPT_TIME_WINDOW,
  hour12inMiliSec,
} from '@edulastic/constants/const/common'
import { isEmpty } from 'lodash'

const { ATTEMPT_WINDOW_TYPE } = testConst

const useAttempWindowChangeHandler = (changeField) => {
  const initialRender = useRef(true)
  const [selectedAttemptWindowType, setSelectedAttemptWindowType] = useState(
    ATTEMPT_WINDOW_TYPE.DEFAULT
  )
  const [todaysDay] = new Date().toString().split(' ')
  const [selectedDays, setSelectedDays] = useState({
    [todaysDay.toUpperCase()]: true,
  })

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
    getMilliSeconds(ATTEMPT_WINDOW_DEFAULT_START_TIME)
  )
  const [assignmentEndTime, setAssignmentEndTime] = useState(
    getMilliSeconds(ATTEMPT_WINDOW_DEFAULT_END_TIME)
  )

  const anyOfTheDaysSelected = Object.keys(selectedDays).some(
    (key) => selectedDays[key]
  )

  useEffect(() => {
    const isStartEndTimeSelected = assignmentStartTime && assignmentEndTime
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
    setAssignmentStartTime(getMilliSeconds(selectedTime))
  }

  const handleEndTimeChange = (_, selectedTime) => {
    setAssignmentEndTime(getMilliSeconds(selectedTime))
  }

  const handleDayChange = (selectedDay) => {
    setSelectedDays((oldState) => ({
      ...oldState,
      [selectedDay]: !oldState[selectedDay],
    }))
  }

  const handleChange = (value) => setSelectedAttemptWindowType(value)
  return {
    handleStartTimeChange,
    handleEndTimeChange,
    handleDayChange,
    handleChange,
    selectedAttemptWindowType,
    selectedDays,
  }
}

export default useAttempWindowChangeHandler
