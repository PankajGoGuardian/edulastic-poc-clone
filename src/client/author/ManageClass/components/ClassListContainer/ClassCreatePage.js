import React from 'react'
import { IconGoogleClassroom } from '@edulastic/icons'
import { EduButton, EduIf } from '@edulastic/common'
import { segmentApi } from '@edulastic/api'
import { AUTH_FLOW, GoogleLoginWrapper } from '../../../../../vendors/google'
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

  const loginGoogle = (googleClient) => googleClient.requestCode()

  const { isUserGoogleLoggedIn, cleverId, isPlayground } = user

  const createNewClass = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: 'class' })
  }

  return (
    <>
      <ClassCreateContainer>
        <EduIf condition={filterClass === classesType.ARCHIVED}>
          <NoClassNotification
            heading="No archived classes"
            description="You have no archived classes available"
          />
        </EduIf>
        <EduIf condition={filterClass !== classesType.ARCHIVED}>
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
            <EduIf
              condition={[
                !isPlayground,
                googleAllowedInstitutions?.length > 0,
                !cleverId,
                !isClassLink,
              ].every((val) => !!val)}
            >
              <GoogleLoginWrapper
                WrappedComponent={({ googleClient }) => (
                  <AuthorCompleteSignupButton
                    renderButton={(handleClick) => (
                      <EduButton isBlue onClick={handleClick}>
                        <IconGoogleClassroom />
                        <span>SYNC WITH GOOGLE CLASSROOM</span>
                      </EduButton>
                    )}
                    onClick={() => {
                      segmentApi.genericEventTrack('syncButtonClicked', {
                        syncType: 'google',
                      })
                      loginGoogle(googleClient)
                    }}
                    triggerSource="Sync Google Class Button Click"
                  />
                )}
                scopes={scopes}
                successCallback={handleLoginSucess}
                errorCallback={handleError}
                prompt={isUserGoogleLoggedIn ? '' : 'consent'}
                flowType={AUTH_FLOW.CODE}
              />
            </EduIf>
          </ButtonsContainer>
        </EduIf>
      </ClassCreateContainer>
    </>
  )
}

export default ClassCreatePage
