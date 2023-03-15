import React, { useMemo } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

// components
import {
  EduButton,
  MainHeader,
  HeaderTabs,
  notification,
  captureSentryException,
  EduIf,
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
import { AUTH_FLOW, GoogleLoginWrapper } from '../../../../../vendors/google'
import { ButtonsWrapper } from './styled'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import authorizeCanvas from '../../../../common/utils/CanavsAuthorizationModule'
import { scopes } from './ClassCreatePage'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'

const Header = ({
  classGroups,
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
  syncClassWithAtlas,
  syncCleverClassList,
  refreshPage,
  isCleverDistrict,
  filterClass,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
}) => {
  const { atlasId, cleverId, isPlayground } = user

  const atlasGroup = classGroups.find(
    (_group) =>
      _group.atlasProviderName &&
      ['schoology', 'classlink', 'clever', 'canvas'].includes(
        _group.atlasProviderName.toLowerCase()
      )
  )
  const atlasProviderName = atlasGroup?.atlasProviderName

  const isCleverGroupPresent = classGroups.find((_group) => !!_group.cleverId)

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

  const handleSyncWithAtlas = () => {
    const groupIds = classGroups
      .filter((_group) => _group.atlasId)
      .map((_group) => _group._id)
    syncClassWithAtlas({ groupIds })
  }
  const handleSyncWithClever = () => {
    const classList = classGroups
      .filter((_group) => _group.cleverId)
      .map((_group) => ({ ..._group, course: _group?.course?.id }))
    syncCleverClassList({ classList, refreshPage })
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

  const createNewClass = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: currentTab })
  }

  // `googleStopSync` is true if all `googleAllowedInstitutions` have `stopSync` enabled
  const googleStopSync = useMemo(
    () => googleAllowedInstitutions.every((s) => !!s.institution.stopSync),
    [googleAllowedInstitutions]
  )
  // `canvasStopSync` is true if all `canvasAllowedInstitution` have `stopSync` enabled
  const canvasStopSync = useMemo(
    () => canvasAllowedInstitution.every((s) => !!s.institution.stopSync),
    [canvasAllowedInstitution]
  )
  const loginGoogle = (googleClient) => googleClient.requestCode()

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
        <EduIf condition={currentTab === 'class'}>
          <EduIf
            condition={[!isPlayground, enableCleverSync].every((val) => !!val)}
          >
            <AuthorCompleteSignupButton
              renderButton={(handleClick) => (
                <EduButton
                  isGhost
                  isBlue
                  onClick={handleClick}
                  data-cy="syncClever"
                >
                  <IconClever width={18} height={18} />
                  <span>SYNC NOW WITH CLEVER</span>
                </EduButton>
              )}
              onClick={() => setShowCleverSyncModal(true)}
            />
          </EduIf>
          <EduIf
            condition={[
              !isPlayground,
              googleAllowedInstitutions?.length > 0,
              // if stopSync is enabled for all institutions, ignore cleverId/atlasId,
              // else, show bulk Sync only if both(atlasId & cleverId) are unavailable
              (!cleverId && !isClassLink && !atlasId) || googleStopSync,
              !enableCleverSync,
            ].every((val) => !!val)}
          >
            <GoogleLoginWrapper
              WrappedComponent={({ googleClient }) => (
                <EduButton
                  isBlue
                  data-cy="syncGoogle"
                  isGhost
                  onClick={() => loginGoogle(googleClient)}
                >
                  <IconGoogleClassroom />
                  <span>SYNC WITH GOOGLE CLASSROOM</span>
                </EduButton>
              )}
              scopes={scopes}
              successCallback={handleLoginSucess}
              errorCallback={handleError}
              prompt={isUserGoogleLoggedIn ? '' : 'consent'}
              flowType={AUTH_FLOW.CODE}
            />
          </EduIf>
          <EduIf
            condition={[
              !isPlayground,
              canvasAllowedInstitution?.length > 0,
              // if stopSync is enabled for all institutions, ignore cleverId/atlasId,
              // else, show bulk Sync only if both(atlasId & cleverId) are unavailable
              (!cleverId && !isClassLink && !atlasId) || canvasStopSync,
              !enableCleverSync,
            ].every((val) => !!val)}
          >
            <EduButton
              isBlue
              data-cy="syncCanvas"
              isGhost
              onClick={handleSyncWithCanvas}
            >
              <img
                alt="Canvas"
                src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                width={18}
                height={18}
              />
              <span>SYNC WITH CANVAS</span>
            </EduButton>
          </EduIf>
          <EduIf
            condition={[
              !isPlayground,
              atlasId,
              atlasProviderName?.length,
              filterClass === 'Active',
            ].every((val) => !!val)}
          >
            <EduButton
              isBlue
              data-cy={
                atlasProviderName?.toLowerCase() === 'schoology'
                  ? 'syncSchoology'
                  : 'syncClassLink'
              }
              isGhost
              onClick={handleSyncWithAtlas}
            >
              <span>RESYNC {atlasProviderName?.toUpperCase()} CLASSES</span>
            </EduButton>
          </EduIf>
          <EduIf
            condition={[
              !isPlayground,
              isCleverDistrict,
              isCleverGroupPresent,
              filterClass === 'Active',
            ].every((val) => !!val)}
          >
            <EduButton
              isBlue
              data-cy="resyncClever"
              isGhost
              onClick={handleSyncWithClever}
            >
              <span>RESYNC CLEVER CLASSES</span>
            </EduButton>
          </EduIf>
        </EduIf>
        <AuthorCompleteSignupButton
          renderButton={(handleClick) => (
            <EduButton data-cy="createClass" isBlue onClick={handleClick}>
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
}

const enhance = compose(withNamespaces('header'))

export default enhance(Header)
