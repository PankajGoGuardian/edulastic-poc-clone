import styled from 'styled-components'
import React from 'react'
import { blue, themeColor, white } from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import { setShowClassCreationModalAction } from '../../../../../ducks'
import {
  fetchClassListAction,
  setCreateClassTypeDetailsAction,
  setShowCanvasSyncModalAction,
  setShowCleverSyncModalAction,
} from '../../../../../../ManageClass/ducks'
import HeaderSyncAction from './HeaderSyncAction/HeaderSyncAction'
import AppConfig from '../../../../../../../../app-config'
import {
  getCanvasAllowedInstitutionPoliciesSelector,
  getCleverLibraryUserSelector,
  getGoogleAllowedInstitionPoliciesSelector,
  getUserSelector,
} from '../../../../../../src/selectors/user'
import AuthorCompleteSignupButton from '../../../../../../../common/components/AuthorCompleteSignupButton'

const ClassBanner = ({
  fetchClassList,
  history,
  isUserGoogleLoggedIn,
  googleAllowedInstitutions,
  canvasAllowedInstitutions,
  isCleverUser,
  setShowCleverSyncModal,
  setShowCanvasSyncModal,
  user,
  teacherData,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
}) => {
  const { user: userInfo } = user

  const isClassLink =
    teacherData && teacherData.filter((id) => id?.atlasId).length > 0

  return (
    <ClassBannerWrapper data-cy="createClassBanner">
      <ClassInfo>
        <OverlayText fontSize="12px" width="63%" textAlign="left">
          <ClassName>Classes</ClassName>
          <SpanInfo>
            Create a virtual clasroom so you can connect, teach and engage with
            your students.
          </SpanInfo>
        </OverlayText>
      </ClassInfo>
      <ClassInfo>
        <OverlayText margin="45px 25px 0px 0px">
          <StyledDiv>
            <HeaderSyncAction
              fetchClassList={fetchClassList}
              history={history}
              isUserGoogleLoggedIn={isUserGoogleLoggedIn}
              allowGoogleLogin={googleAllowedInstitutions.length > 0}
              canvasAllowedInstitutions={canvasAllowedInstitutions}
              enableCleverSync={isCleverUser}
              setShowCleverSyncModal={setShowCleverSyncModal}
              handleCanvasBulkSync={() => setShowCanvasSyncModal(true)}
              user={userInfo}
              isClassLink={isClassLink}
            />
          </StyledDiv>
          <AuthorCompleteSignupButton
            renderButton={(handleClick) => (
              <EduButton data-cy="createNewClass" onClick={handleClick}>
                CREATE a CLASS
              </EduButton>
            )}
            onClick={() => {
              setShowClassCreationModal(true)
              setCreateClassTypeDetails({ type: 'class' })
            }}
            triggerSource="Create Class"
          />
        </OverlayText>
      </ClassInfo>
    </ClassBannerWrapper>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      user: getUserSelector(state),
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn'),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(
        state
      ),
      canvasAllowedInstitutions: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      isCleverUser: getCleverLibraryUserSelector(state),
      teacherData: get(state, 'dashboardTeacher.data', []),
    }),
    {
      fetchClassList: fetchClassListAction,
      setShowCleverSyncModal: setShowCleverSyncModalAction,
      setShowCanvasSyncModal: setShowCanvasSyncModalAction,
      setShowClassCreationModal: setShowClassCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
    }
  )
)

export default enhance(ClassBanner)

const ClassBannerWrapper = styled.div`
  height: 200px;
  width: 600px;
  background-image: url(${AppConfig.cdnURI}/ClassBanner.png);
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
  border-radius: 10px;
  margin: 0px 0px 15px 0px;
  transform: scale(1);
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 3px 2px ${themeColor};
    transform: scale(1.015);
    border: none;
    overflow: hidden;
  }
`
const ClassInfo = styled.div`
  display: flex;
  justify-content: end;
`

const OverlayText = styled.div`
  display: flex;
  align-items: end;
  margin: ${(props) => props.margin || '30px'};
  text-align: ${(props) => props.textAlign || 'center'};
  color: ${white};
  font-size: ${(props) => props.fontSize || '14px'};
  z-index: 30;
  width: ${(props) => props.width || 'auto'};
`

const ClassName = styled.h1`
  padding-right: 20px;
  margin: auto;
  font-weight: 800;
  font-size: 24px;
  line-height: 33px;
  color: #84cfb9;
`

const SpanInfo = styled.span`
  padding-left: 15px;
  border-left: 0.5px solid white;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #ffffffb0;
`

const StyledDiv = styled.div`
  margin: 0px 15px;
  button {
    background-color: transparent !important;
    color: white !important;
    border: none;
    box-shadow: none;
    &:hover {
      color: ${blue} !important;
    }
    &:focus {
      color: white !important;
      border: none;
      box-shadow: none;
    }
  }
`
