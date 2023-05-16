import moment from 'moment'

export const getFormattedTimeInMinutesAndSeconds = (t) => {
  const duration = moment.duration(t)
  const m = duration.minutes() || 0
  const s = duration.seconds() || 0
  const time = `${m > 9 ? m : `0${m}`} : ${s > 9 ? s : `0${s}`}`
  return time
}
