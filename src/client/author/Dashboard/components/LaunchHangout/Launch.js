import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { notification } from '@edulastic/common'
import AppConfig from '../../../../../app-config'
import { getLaunchHangoutStatus, launchHangoutClose } from '../../ducks'
import HangoutsModal from '../../../../student/Assignments/components/HangoutsModal'
import { getClasses } from '../../../../student/Login/ducks'
import {
  getSavedGroupHangoutEvent,
  openHangoutMeeting,
  saveHangoutEventRequestAction,
  setHangoutOpenMeetingAction,
  updateHangoutEventRequestAction,
} from '../../../Classes/ducks'

const CALENDAR = 'calendar'

const Launch = ({
  closeLaunchHangout,
  isOpenLaunch,
  classList = [],
  saveHangoutEvent,
  updateHangoutEvent,
  savedGroupHangoutInfo,
  openMeeting,
  setOpenMeeting,
}) => {
  const [groupId, setGroupId] = useState('')
  const [launching, setLaunching] = useState(false)
  const [postMeeting, setPostMeeting] = useState(true)
  const [eventType, setEventType] = useState('create')
  const selectedGroup = classList.find((group) => group._id === groupId)
  const isHangoutLinkExpired = !!(
    selectedGroup &&
    selectedGroup.eventStartDate &&
    new Date(selectedGroup.eventStartDate).getTime() + 60 * 60 * 1000 <
      new Date().getTime()
  )
  const closePopUp = () => {
    setLaunching(false)
    closeLaunchHangout()
  }

  useEffect(() => {
    if (openMeeting) {
      if (savedGroupHangoutInfo && savedGroupHangoutInfo.hangoutLink) {
        window.open(`${savedGroupHangoutInfo.hangoutLink}`, '_blank')
      }
      setOpenMeeting({ status: false })
      closePopUp()
    }
  }, [openMeeting])

  useEffect(() => {
    if (groupId && isHangoutLinkExpired && selectedGroup.eventId) {
      setEventType('update')
    }
  }, [groupId])

  const hangoutLink = isHangoutLinkExpired
    ? undefined
    : selectedGroup && selectedGroup.hangoutLink
    ? selectedGroup.hangoutLink
    : savedGroupHangoutInfo &&
      savedGroupHangoutInfo.hangoutLink &&
      savedGroupHangoutInfo._id === groupId
    ? savedGroupHangoutInfo.hangoutLink
    : undefined
  const saveHangoutLink = (_hangoutLink, event) => {
    if (_hangoutLink) {
      const calendarEventData = JSON.stringify(event)
      const { googleId } = selectedGroup
      const data = {
        groupId,
        hangoutLink: _hangoutLink,
        calendarEventData,
        postMeeting: postMeeting && !!googleId,
      }
      eventType === 'update' ? updateHangoutEvent(data) : saveHangoutEvent(data)
    } else {
      setLaunching(false)
      console.log(`Something went wrong, please try again after some time.`)
    }
  }

  const createOrUpdateCalendarEvent = () => {
    const { name, _id, eventId, hangoutLink } = selectedGroup
    const requestId = _id
    const currentDate = new Date()
    const startDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    )
    const endDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours() + 1,
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
      )
    )
    const event = {
      summary: name,
      start: {
        dateTime: startDate,
      },
      end: {
        dateTime: endDate,
      },
      conferenceData: {
        createRequest: {
          requestId,
        },
      },
    }
    const calendarEvent = {
      resource: event,
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendNotifications: true,
      sendUpdates: 'all',
      supportsAttachments: false,
    }
    if (eventType === 'update') {
      Object.assign(event, { hangoutLink })
      Object.assign(calendarEvent, { resource: event, eventId })
      window.gapi.client.calendar.events
        .update(calendarEvent)
        .execute((_event) => {
          saveHangoutLink(_event.hangoutLink, _event)
        })
    } else {
      Object.assign(calendarEvent, { resource: event })
      window.gapi.client.calendar.events
        .insert(calendarEvent)
        .execute((_event) => {
          saveHangoutLink(_event.hangoutLink, _event)
        })
    }
  }

  const handleError = (err) => {
    if (err?.err !== 'popup_closed_by_user')
      notification({ messageKey: 'failedToLaunchGoogleMeet' })
    console.log('error', err)
  }

  const launchHangout = () => {
    setLaunching(true)
    if (hangoutLink) {
      closePopUp()
      window.open(`${hangoutLink}`, '_blank')
      return
    }

    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
    if (CLIENT_ID && API_KEY && window.gapi.client) {
      window.gapi.client.load(
        CALENDAR,
        AppConfig.googleCalendarApiVersion,
        createOrUpdateCalendarEvent
      )
    } else {
      notification({ messageKey: 'googleApiIsNotConfiguration' })
      console.log(`Google API configuration not found`)
    }
  }

  return (
    <HangoutsModal
      visible={isOpenLaunch}
      onCancel={closePopUp}
      onOk={launchHangout}
      onError={handleError}
      hangoutLink={hangoutLink}
      loading={launching}
      title="Launch Google Meet"
      onSelect={setGroupId}
      selected={selectedGroup}
      checked={postMeeting}
      onCheckUncheck={() => {
        setPostMeeting(!postMeeting)
      }}
      classList={classList.filter((c) => c.active)}
      description="Select the class that you want to invite for the Google Meet session."
    />
  )
}

Launch.propTypes = {
  closeLaunchHangout: PropTypes.func.isRequired,
  isOpenLaunch: PropTypes.bool,
  classList: PropTypes.array,
  saveHangoutEvent: PropTypes.func.isRequired,
  updateHangoutEvent: PropTypes.func.isRequired,
  savedGroupHangoutInfo: PropTypes.object,
}

export default connect(
  (state) => ({
    isOpenLaunch: getLaunchHangoutStatus(state),
    savedGroupHangoutInfo: getSavedGroupHangoutEvent(state),
    classList: getClasses(state),
    openMeeting: openHangoutMeeting(state),
  }),
  {
    closeLaunchHangout: launchHangoutClose,
    saveHangoutEvent: saveHangoutEventRequestAction,
    setOpenMeeting: setHangoutOpenMeetingAction,
    updateHangoutEvent: updateHangoutEventRequestAction,
  }
)(Launch)
