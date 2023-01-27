import React from 'react'
import {
  captureSentryException,
  EduButton,
  notification,
} from '@edulastic/common'
import { canvasApi } from '@edulastic/api'
import {
  AUTH_FLOW,
  GoogleLoginWrapper,
} from '../../../../../../../../../vendors/google'

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

  const loginGoogle = (googleClient) => googleClient.requestCode()

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
        <GoogleLoginWrapper
          WrappedComponent={({ googleClient }) => (
            <AuthorCompleteSignupButton
              renderButton={(handleClick) => (
                <EduButton
                  isGhost
                  isBlue
                  onClick={handleClick}
                  data-cy="syncGoogle"
                >
                  <p>Sync with Google Classroom</p>
                </EduButton>
              )}
              onClick={() => loginGoogle(googleClient)}
              triggerSource="Sync Google Class Button Click"
            />
          )}
          successCallback={handleLoginSucess}
          errorCallback={handleError}
          scopes={scopes}
          prompt={isUserGoogleLoggedIn ? '' : 'consent'}
          flowType={AUTH_FLOW.CODE}
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
            <EduButton
              isGhost
              isBlue
              onClick={handleClick}
              data-cy="syncCanvas"
            >
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
