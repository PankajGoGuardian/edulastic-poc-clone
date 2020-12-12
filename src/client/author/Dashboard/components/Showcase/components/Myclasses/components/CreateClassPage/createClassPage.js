import React from 'react'
import {
  captureSentryException,
  EduButton,
  notification,
} from '@edulastic/common'
import GoogleLogin from 'react-google-login'
import { canvasApi } from '@edulastic/api'
import {
  IconPlusCircle,
  IconGoogleClassroom,
  IconClever,
} from '@edulastic/icons'
import styled from 'styled-components'

import { CreateCardBox, SyncClassDiv } from './styled'
import { scopes } from '../../../../../../../ManageClass/components/ClassListContainer/ClassCreatePage'
import authorizeCanvas from '../../../../../../../../common/utils/CanavsAuthorizationModule'
import CreateClassButton from '../../../../../../../ManageClass/components/CreateClassButton'

const CreateClassPage = ({
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

  return (
    <CreateCardBox>
      <CreateClassButton
        style={{ width: '207px' }}
        redirectRoute="'/author/manageClass/createClass'"
      />
      {(allowGoogleLogin || enableCleverSync || enableCanvasSync) &&
        !cleverId &&
        !isClassLink && <StyledP>OR</StyledP>}
      {allowGoogleLogin !== false && !cleverId && !isClassLink && (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            <SyncClassDiv onClick={renderProps.onClick}>
              <IconGoogleClassroom />
              <p>Sync With Google Classroom</p>
            </SyncClassDiv>
          )}
          scope={scopes}
          onSuccess={handleLoginSucess}
          onFailure={handleError}
          prompt={isUserGoogleLoggedIn ? '' : 'consent'}
          responseType="code"
        />
      )}
      {enableCleverSync && (
        <SyncClassDiv onClick={() => setShowCleverSyncModal(true)}>
          <IconClever />
          <p>Sync Class Roster from Clever</p>
        </SyncClassDiv>
      )}
      {enableCanvasSync && !cleverId && !isClassLink && (
        <SyncClassDiv onClick={handleSyncWithCanvas}>
          <img
            alt="Canvas"
            src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
            width={18}
            height={18}
          />
          <p>Sync with Canvas</p>
        </SyncClassDiv>
      )}
    </CreateCardBox>
  )
}
export default CreateClassPage

const StyledP = styled.p`
  color: #9196a2;
`
