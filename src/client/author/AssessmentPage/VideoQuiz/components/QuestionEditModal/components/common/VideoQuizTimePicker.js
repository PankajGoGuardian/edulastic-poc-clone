import React, { useMemo } from 'react'
import moment from 'moment'
import { TimePickerStyled, notification } from '@edulastic/common'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../../assessment/utils/timeUtils'
import {
  formateSecondsToMMSS,
  getVideoDuration,
} from '../../../../utils/videoPreviewHelpers'

const VideoQuizTimePicker = ({
  questionDisplayTimestamp = null,
  updateQuestionData,
  updateAnnotationTime,
  questionId,
  videoRef,
}) => {
  const handleTimeChange = (value) => {
    const videoDuration = getVideoDuration(videoRef)
    const updateData = {
      questionDisplayTimestamp: value === 0 ? null : value,
    }

    if (value > videoDuration) {
      notification({
        type: 'warn',
        msg: `Question timestamp should be less than ${formateSecondsToMMSS(
          videoDuration
        )}`,
      })
    } else {
      updateQuestionData(updateData)
      updateAnnotationTime(questionId, value)
    }
  }

  const timestampValue = useMemo(() => {
    if (typeof questionDisplayTimestamp === 'number') {
      return {
        value: moment(
          getFormattedTimeInMinutesAndSeconds(questionDisplayTimestamp * 1000),
          'mm:ss'
        ),
      }
    }
    return { value: moment('00:00', 'mm:ss') }
  }, [questionDisplayTimestamp])

  return (
    <TimePickerStyled
      width="100%"
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
