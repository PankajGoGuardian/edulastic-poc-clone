import React from 'react'
import { Link } from 'react-router-dom'
import { IconGoogleClassroom } from '@edulastic/icons'
import GoogleLogin from 'react-google-login'
import { EduButton } from '@edulastic/common'
import NoClassNotification from '../NoClassNotification'
import { ClassCreateContainer, ButtonsContainer } from './styled'

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
}) => {
  const { name } = recentInstitute

  const handleLoginSucess = (data) => {
    fetchClassList({ data })
  }

  const handleError = (err) => {
    console.log('error', err)
  }

  const { isUserGoogleLoggedIn, orgData } = user
  const { isCleverDistrict } = orgData
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
              <Link to="/author/manageClass/createClass">
                <EduButton isBlue>CREATE NEW CLASS</EduButton>
              </Link>
              {googleAllowedInstitutions?.length > 0 &&
                !isCleverDistrict &&
                !isClassLink && (
                  <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    render={(renderProps) => (
                      <EduButton isBlue onClick={renderProps.onClick}>
                        <IconGoogleClassroom />
                        <span>SYNC WITH GOOGLE CLASSROOM</span>
                      </EduButton>
                    )}
                    scope={scopes}
                    onSuccess={handleLoginSucess}
                    onFailure={handleError}
                    prompt={isUserGoogleLoggedIn ? '' : 'consent'}
                    responseType="code"
                  />
                )}
            </ButtonsContainer>
          </>
        )}
      </ClassCreateContainer>
    </>
  )
}
export default ClassCreatePage
