import React from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { withNamespaces } from 'react-i18next'
import { GoogleLogin } from 'react-google-login'

// components
import {
  EduButton,
  MainHeader,
  HeaderTabs,
  notification,
  captureSentryException,
} from '@edulastic/common'
import { canvasApi } from '@edulastic/api'
import {
  IconGoogleClassroom,
  IconManage,
  IconPlusCircle,
  IconClass,
  IconGroup,
  IconClever,
} from '@edulastic/icons'
import { StyledTabs } from '@edulastic/common/src/components/HeaderTabs'
import { ButtonsWrapper } from './styled'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import authorizeCanvas from '../../../../common/utils/CanavsAuthorizationModule'
import { scopes } from './ClassCreatePage'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const Header = ({
  fetchGoogleClassList,
  googleAllowedInstitutions,
  isUserGoogleLoggedIn,
  setShowCleverSyncModal,
  t,
  currentTab,
  onClickHandler,
  enableCleverSync,
  canvasAllowedInstitution,
  user,
  handleCanvasBulkSync,
  isClassLink,
  history,
}) => {
  const { cleverId } = user

  const handleLoginSucess = (data) => {
    fetchGoogleClassList({ data })
  }

  const handleError = (err) => {
    console.log('error', err)
  }

  const handleSyncWithCanvas = async () => {
    try {
      const result = await canvasApi.getCanvasAuthURI(
        canvasAllowedInstitution?.[0]?.institutionId
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

  const pageNavButtons = [
    {
      icon: <IconClass width="15px" height="15px" />,
      value: 'class',
      text: 'Classes',
    },
    {
      icon: <IconGroup width="20px" height="15px" />,
      value: 'group',
      text: 'Groups',
    },
  ]

  const createNewClass = () =>
    history.push({
      pathname: '/author/manageClass/createClass',
      state: { type: currentTab },
    })

  return (
    <MainHeader Icon={IconManage} headingText={t('common.manageClassTitle')}>
      <FeaturesSwitch
        inputFeatures="studentGroups"
        actionOnInaccessible="hidden"
      >
        <StyledTabs>
          {pageNavButtons.map(({ value, text, icon }) => (
            <HeaderTabs
              style={
                currentTab === value
                  ? { cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              }
              dataCy={value}
              isActive={currentTab === value}
              linkLabel={text}
              key={value}
              icon={icon}
              onClickHandler={() => onClickHandler(value)}
            />
          ))}
        </StyledTabs>
      </FeaturesSwitch>
      <ButtonsWrapper>
        <>
          {enableCleverSync && (
            <EduButton
              isBlue
              isGhost
              onClick={() => setShowCleverSyncModal(true)}
            >
              <IconClever width={18} height={18} />
              <span>SYNC NOW WITH CLEVER</span>
            </EduButton>
          )}
          {googleAllowedInstitutions?.length > 0 &&
            !cleverId &&
            !enableCleverSync &&
            !isClassLink && (
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Sync with Google Classroom"
                render={(renderProps) => (
                  <EduButton isBlue isGhost onClick={renderProps.onClick}>
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
          {canvasAllowedInstitution?.length > 0 &&
            !cleverId &&
            !enableCleverSync &&
            !isClassLink && (
              <EduButton isBlue isGhost onClick={handleSyncWithCanvas}>
                <img
                  alt="Canvas"
                  src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                  width={18}
                  height={18}
                />
                <span>SYNC WITH CANVAS</span>
              </EduButton>
            )}
        </>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton isBlue onClick={handleClick}>
              <IconPlusCircle />
              <span>Create {currentTab}</span>
            </EduButton>
          )}
          onClick={createNewClass}
        />
      </ButtonsWrapper>
    </MainHeader>
  )
}

Header.propTypes = {
  fetchGoogleClassList: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const enhance = compose(withNamespaces('header'), withRouter)

export default enhance(Header)
