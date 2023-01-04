import React, { useEffect } from 'react'
import { IconGoogleClassroom } from '@edulastic/icons'
import GoogleLogin from 'react-google-login'
import { EduButton } from '@edulastic/common'
import { segmentApi } from '@edulastic/api'
import NoClassNotification from '../NoClassNotification'
import { ClassCreateContainer, ButtonsContainer } from './styled'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

export const scopes = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.profile.emails',
  'https://www.googleapis.com/auth/classroom.profile.photos',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/classroom.announcements',
].join(' ')

const classesType = {
  ARCHIVED: 'Archived Classes',
  ACTIVE: 'Active classes',
}

const ClassCreatePage = ({
  filterClass,
  recentInstitute = {},
  user,
  fetchClassList,
  googleAllowedInstitutions,
  isClassLink,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
}) => {
  const { name } = recentInstitute

  const handleLoginSucess = (data) => {
    fetchClassList({ data })
  }

  const handleError = (err) => {
    console.log('error', err)
  }

  useEffect(() => {
    console.log('************************', google)
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: (data) => handleLoginSucess(data),
    })

    google.accounts.id.renderButton(document.getElementById('signInDi'), {
      theme: 'outline',
      size: 'large',
    })
  }, [])

  const { isUserGoogleLoggedIn, cleverId, isPlayground } = user

  const createNewClass = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: 'class' })
  }

  return (
    <>
      <ClassCreateContainer>
        {filterClass === classesType.ARCHIVED ? (
          <NoClassNotification
            heading="No archived classes"
            description="You have no archived classes available"
          />
        ) : (
          <>
            <NoClassNotification
              heading="No active classes"
              description="No active classes yet.You are currently a teacher in"
              data={name}
            />
            <ButtonsContainer>
              <AuthorCompleteSignupButton
                renderButton={(handleClick) => (
                  <EduButton isBlue onClick={handleClick}>
                    CREATE NEW CLASS
                  </EduButton>
                )}
                onClick={createNewClass}
                triggerSource="Create Class"
              />
              {/* {!isPlayground &&
                googleAllowedInstitutions?.length > 0 &&
                !cleverId &&
                !isClassLink && (
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    render={(renderProps) => (
                      <AuthorCompleteSignupButton
                        renderButton={(handleClick) => (
                          <EduButton isBlue onClick={handleClick}>
                            <IconGoogleClassroom />
                            <span>SYNC WITH GOOGLE CLASSROOM</span>
                          </EduButton>
                        )}
                        onClick={(e) => {
                          segmentApi.genericEventTrack('syncButtonClicked', {
                            syncType: 'google',
                          })
                          renderProps.onClick(e)
                        }}
                        triggerSource="Sync Google Class Button Click"
                      />
                    )}
                    scope={scopes}
                    onSuccess={handleLoginSucess}
                    onFailure={handleError}
                    prompt={isUserGoogleLoggedIn ? '' : 'consent'}
                    responseType="code"
                  />
                )} */}
              <div id="signInDi" />
            </ButtonsContainer>
          </>
        )}
      </ClassCreateContainer>
    </>
  )
}

export default ClassCreatePage
