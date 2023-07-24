import React from 'react'
import moment from 'moment'
import { TimePickerStyled } from '@edulastic/common'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../../assessment/utils/timeUtils'

const VideoQuizTimePicker = ({
  questionDisplayTimestamp = null,
  updateQuestionData,
  updateAnnotationTime,
  questionId,
}) => {
  const handleTimeChange = (value) => {
    const updateData = {
      questionDisplayTimestamp: value === 0 ? null : value,
    }
    updateQuestionData(updateData)
    updateAnnotationTime(questionId, value)
  }

  const timestampValue =
    typeof questionDisplayTimestamp === 'number'
      ? {
          value: moment(
            getFormattedTimeInMinutesAndSeconds(
              questionDisplayTimestamp * 1000
            ),
            'mm:ss'
          ),
        }
      : { value: null }

  return (
    <TimePickerStyled
      width="35%"
      format="mm:ss"
      {...timestampValue}
      onChange={(value) =>
        handleTimeChange((value?.minutes() || 0) * 60 + (value?.seconds() || 0))
      }
      placeholder="Enter time (mm:ss)"
    />
  )
}

export default VideoQuizTimePicker
