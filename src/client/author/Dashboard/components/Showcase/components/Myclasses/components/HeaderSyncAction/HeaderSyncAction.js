import React from 'react'
import {
  captureSentryException,
  EduButton,
  notification,
} from '@edulastic/common'
import GoogleLogin from 'react-google-login'
import { canvasApi } from '@edulastic/api'

import { scopes } from '../../../../../../../ManageClass/components/ClassListContainer/ClassCreatePage'
import authorizeCanvas from '../../../../../../../../common/utils/CanavsAuthorizationModule'
import AuthorCompleteSignupButton from '../../../../../../../../common/components/AuthorCompleteSignupButton'

const HeaderSyncAction = ({
  allowGoogleLogin,
  canvasAllowedInstitutions,
  isUserGoogleLoggedIn,
  fetchClassList,
  enableCleverSync,
  setShowCleverSyncModal,
  handleCanvasBulkSync,
  user,
  history,
  isClassLink,
}) => {
  const { cleverId } = user

  const handleLoginSucess = (data) => {
    fetchClassList({ data })
    history.push('/author/manageClass')
  }

  const handleError = (err) => {
    console.log('error', err)
  }

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(
        canvasAllowedInstitutions?.[0]?.institutionId
      )
      if (!result.userAuthenticated) {
        const subscriptionTopic = `canvas:${user.districtId}_${user._id}_${
          user.username || user.email || ''
        }`
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then((res) => {
            handleCanvasBulkSync(res)
          })
          .catch((err) => {
            console.error('Error while authorizing', err)
            captureSentryException(err)
            notification({ messageKey: 'errorOccuredWhileAuthorizing' })
          })
      } else {
        handleCanvasBulkSync()
      }
    } catch (err) {
      captureSentryException(err)
      notification(
        err.status === 403 && err.response.data?.message
          ? {
              msg: err.response.data?.message,
            }
          : { messageKey: 'errorWhileGettingAuthUri' }
      )
    }
  }

  const enableCanvasSync = canvasAllowedInstitutions.length > 0
  const syncCleverSync = () => setShowCleverSyncModal(true)

  return (
    <>
      {allowGoogleLogin !== false && !cleverId && !isClassLink && (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <AuthorCompleteSignupButton
              renderButton={(handleClick) => (
                <EduButton isGhost isBlue onClick={handleClick}>
                  <p>Sync with Google Classroom</p>
                </EduButton>
              )}
              onClick={renderProps.onClick}
              triggerSource="Sync Google Class Button Click"
            />
          )}
          scope={scopes}
          onSuccess={handleLoginSucess}
          onFailure={handleError}
          prompt={isUserGoogleLoggedIn ? '' : 'consent'}
          responseType="code"
        />
      )}
      {enableCleverSync && (
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton isGhost isBlue onClick={handleClick}>
              <p>Sync Class Roster from Clever</p>
            </EduButton>
          )}
          onClick={syncCleverSync}
        />
      )}
      {enableCanvasSync && !cleverId && !isClassLink && (
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton isGhost isBlue onClick={handleClick}>
              <p>Sync with Canvas</p>
            </EduButton>
          )}
          onClick={handleSyncWithCanvas}
        />
      )}
    </>
  )
}
export default HeaderSyncAction
