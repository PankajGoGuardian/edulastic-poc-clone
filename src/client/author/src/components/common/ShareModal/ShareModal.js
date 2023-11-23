import {
  backgroundGrey2,
  fadedGrey,
  greenDark,
  themeColor,
  whiteSmoke,
  mobileWidthMax,
  red,
} from '@edulastic/colors'
import {
  EduButton,
  FlexContainer,
  RadioBtn,
  RadioGrp,
  SelectInputStyled,
  notification,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import signUpState from '@edulastic/constants/const/signUpState'
import { IconClose, IconShare } from '@edulastic/icons'
import {
  Col,
  Row,
  Select,
  Spin,
  Typography,
  Modal,
  AutoComplete,
  Checkbox,
  Input,
} from 'antd'
import { debounce, get as _get, isEqual, isUndefined, sortBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import { getFullNameFromAsString } from '../../../../../common/utils/helpers'
import { isFeatureAccessible } from '../../../../../features/components/FeaturesSwitch'
import { getUserFeatures } from '../../../../../student/Login/ducks'
import {
  fetchUsersListAction,
  getFetchingSelector,
  getUsersListSelector,
  updateUsersListAction,
} from '../../../../sharedDucks/userDetails'
import {
  deleteSharedUserAction,
  getUserListSelector,
  sendTestShareAction,
  getContentSharingStateSelector,
  getShouldSendEmailStateSelector,
  getShowMessageBodyStateSelector,
  getEmailNotificationMessageSelector,
  updateEmailNotificationDataAction,
  getTestEntitySelector,
} from '../../../../TestPage/ducks'
import {
  getOrgDataSelector,
  getUserRole,
  getUserSignupStatusSelector,
  getUserNameSelector,
  getUserOrgId,
  canAccessPublicContentSelector,
} from '../../../selectors/user'
import { RadioInputWrapper } from '../RadioInput'

const { Paragraph } = Typography

const permissions = {
  EDIT: `All Actions (edit, duplicate, assign)`,
  VIEW: 'Limited Actions (duplicate, assign)',
  ASSIGN: 'Only View and Assign',
}

// This link sharing permission is to show in the shareModal only.
// There will be one more permission OFF for diabling the link sharing.
const linkSharingPermissions = {
  VIEW: 'Limited access (duplicate, assign)',
  ASSIGN: 'View and assign',
  NOACTION: 'No Actions (View Only)',
}

const permissionKeys = ['EDIT', 'VIEW', 'ASSIGN']

const shareTypes = {
  PUBLIC: 'Everyone',
  DISTRICT: 'District',
  SCHOOL: 'School',
  INDIVIDUAL: 'Individuals',
  LINK: 'Link Sharing',
}

const sharedKeysObj = {
  PUBLIC: 'PUBLIC',
  DISTRICT: 'DISTRICT',
  SCHOOL: 'SCHOOL',
  INDIVIDUAL: 'INDIVIDUAL',
  LINK: 'LINK',
}

const shareLevel = {
  INDIVIDUAL: 0,
  SCHOOL: 1,
  DISTRICT: 2,
  PUBLIC: 3,
  LINK: 4,
}

const shareTypeKeys = ['PUBLIC', 'DISTRICT', 'SCHOOL', 'INDIVIDUAL', 'LINK']
const shareTypeKeyForDa = ['PUBLIC', 'DISTRICT', 'INDIVIDUAL', 'LINK']

const { Option } = AutoComplete

const SharedRow = ({ data, index, getEmail, getUserName, removeHandler }) => {
  return (
    <Row
      key={index}
      style={{
        paddingBottom: 5,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Col span={12}>
        {getUserName()}
        <span>{getEmail()}</span>
      </Col>
      <Col span={11}>
        <span>
          {data.permission === 'EDIT' &&
            'All Actions (edit, duplicate, assign)'}
        </span>
        <span>
          {data.permission === 'VIEW' && 'Limited Actions (duplicate, assign)'}
        </span>
        <span>{data.permission === 'ASSIGN' && 'Only View and Assign'}</span>
        <span>
          {data.permission === 'NOACTION' && 'No Actions (View Only)'}
        </span>
      </Col>
      <Col span={1}>
        <a data-cy="share-button-close" onClick={() => removeHandler()}>
          <CloseIcon />
        </a>
      </Col>
    </Row>
  )
}
class ShareModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sharedType: sharedKeysObj.INDIVIDUAL,
      searchString: '',
      currentUser: {},
      permission: (
        isUndefined(props.hasPlaylistEditAccess)
          ? props.features.editPermissionOnTestSharing
          : props.features.editPermissionOnTestSharing &&
            props.hasPlaylistEditAccess
      )
        ? 'EDIT'
        : 'VIEW',
      _permissionKeys: (
        isUndefined(props.hasPlaylistEditAccess)
          ? props.features.editPermissionOnTestSharing
          : props.features.editPermissionOnTestSharing &&
            props.hasPlaylistEditAccess
      )
        ? props.isPlaylist
          ? permissionKeys.slice(0, 2)
          : permissionKeys
        : permissionKeys.slice(1, props.isPlaylist ? 2 : 3),
      showWarning: false,
    }
    this.handleSearch = this.handleSearch.bind(this)
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { features, gradeSubject, isPlaylist } = nextProps
    const { grades, subjects } = gradeSubject || {}
    const isEditPermissionNotEqual = !isEqual(
      state?.editPermissionOnTestSharing,
      features?.editPermissionOnTestSharing
    )

    const isGradesNotEqual = !isEqual(
      sortBy(state?.gradeSubject?.grades || []),
      sortBy(grades || [])
    )
    const isSubjectsNotEqual = !isEqual(
      sortBy(state?.gradeSubject?.subjects || []),
      sortBy(subjects || [])
    )
    const isGradesAndSubjectsNotEqual = isGradesNotEqual || isSubjectsNotEqual

    if (
      (isEditPermissionNotEqual || isGradesAndSubjectsNotEqual) &&
      features.editPermissionOnTestSharing === false &&
      grades &&
      subjects &&
      isFeatureAccessible({
        features,
        inputFeatures: 'editPermissionOnTestSharing',
        gradeSubject,
      })
    ) {
      return {
        permission: 'EDIT',
        _permissionKeys: isPlaylist
          ? permissionKeys.slice(0, 2)
          : permissionKeys,
        editPermissionOnTestSharing: features?.editPermissionOnTestSharing,
        gradeSubject,
      }
    }
    if (isEditPermissionNotEqual && !features.editPermissionOnTestSharing) {
      return {
        permission: 'VIEW',
        _permissionKeys: permissionKeys.slice(1, isPlaylist ? 2 : 3),
        editPermissionOnTestSharing: features?.editPermissionOnTestSharing,
      }
    }
  }

  componentDidMount() {
    const { userRole, updateEmailNotificationData, isPublished } = this.props

    const isDA = userRole === roleuser.DISTRICT_ADMIN
    if (isDA) {
      this.setState({ permission: 'VIEW' })
    }

    if (!isPublished) {
      updateEmailNotificationData({
        sendEmailNotification: true,
      })
    }
  }

  radioHandler = (e) => {
    this.setState({
      sharedType: e.target.value,
    })
    const { hasPlaylistEditAccess, updateEmailNotificationData } = this.props
    const { _permissionKeys } = this.state
    updateEmailNotificationData({
      sendEmailNotification: false,
      showMessageBody: false,
      notificationMessage: '',
    })
    if ([sharedKeysObj.PUBLIC, sharedKeysObj.LINK].includes(e.target.value)) {
      this.setState({
        permission: 'VIEW',
      })
    } else if (
      e.target.value !== sharedKeysObj.INDIVIDUAL ||
      !hasPlaylistEditAccess
    ) {
      this.setState({
        permission: _permissionKeys[_permissionKeys.length - 1],
      })
    } else {
      this.setState({
        permission: 'EDIT',
      })
    }
  }

  removeHandler = (data) => {
    const { deleteShared, testId, testVersionId, isPlaylist } = this.props
    const { sharedId, _userId: sharedWith, v1Id, v1LinkShareEnabled } = data
    const unSharePayload = {
      contentId: testId,
      sharedId,
      sharedWith,
      contentType: isPlaylist ? 'PLAYLIST' : 'TEST',
    }
    if (v1LinkShareEnabled === 1) {
      unSharePayload.versionId = testVersionId
      unSharePayload.v1Id = v1Id
      unSharePayload.v1LinkShareEnabled = 1
    }
    deleteShared(unSharePayload)
  }

  permissionHandler = (value) => {
    const { currentUser } = this.state
    if (!Object.keys(currentUser).length) {
      this.setState({ permission: value })
    } else {
      this.setState({
        permission: value,
        currentUser: { ...currentUser, permission: value },
      })
    }
  }

  searchUser = debounce((value) => {
    const { sharedType } = this.state
    const { getUsers } = this.props
    const searchBody = {
      limit: 10,
      page: 1,
      type: sharedType,
      search: {
        role: ['teacher', 'school-admin', 'district-admin'],
        searchString: value,
        status: 1,
      },
    }
    getUsers(searchBody)
  }, 500)

  handleSearch(value) {
    const { updateShareList } = this.props
    this.setState({ searchString: value, currentUser: {} })
    if (value.length > 1) {
      this.setState({ showWarning: false })
      this.searchUser(value)
    } else {
      updateShareList({ data: [] })
    }
  }

  handleChange = (value) => {
    const { permission } = this.state
    const [userName, email, role, _userId] = value.split('||')
    const selectedInputTitle = `${userName.trim()},(${email}),${role}`
    const newState = {
      userName,
      email,
      _userId,
      permission,
    }
    this.setState({
      currentUser: newState,
      searchString: selectedInputTitle,
    })
  }

  handleShare = () => {
    const { currentUser, sharedType, permission, searchString } = this.state
    const {
      shareTest,
      testId,
      sharedUsersList,
      isPlaylist,
      testVersionId,
      authorName,
      sendEmailNotification,
      showMessageBody,
      notificationMessage,
    } = this.props
    const isExisting = sharedUsersList.some(
      (item) => item._userId === currentUser._userId
    )
    if (
      !(searchString.length > 1) &&
      !Object.keys(currentUser).length &&
      sharedType === sharedKeysObj.INDIVIDUAL
    )
      return
    let person = {}
    let emails = []
    if (sharedType === sharedKeysObj.INDIVIDUAL) {
      if (Object.keys(currentUser).length === 0) {
        if (!searchString.length)
          return notification({ messageKey: 'pleaseSelectAnyUser' })
        emails = searchString.split(',')
      } else if (isExisting) {
        notification({ messageKey: 'userHasPermission' })
        return
      } else {
        const { _userId, userName, email } = currentUser
        person = { sharedWith: [{ _id: _userId, name: userName, email }] }
      }
    } else {
      const isTypeExisting = sharedUsersList.some(
        (item) => item.userName === shareTypes[sharedType]
      )
      if (isTypeExisting) {
        notification({
          msg: `You have shared with ${shareTypes[sharedType]} try other option`,
        })
        return
      }
    }
    const data = {
      ...person,
      emails,
      sharedType,
      permission,
      contentType: isPlaylist ? 'PLAYLIST' : 'TEST',
    }
    if (sharedType === sharedKeysObj.INDIVIDUAL && sendEmailNotification) {
      data.sendEmailNotification = sendEmailNotification
      data.authorName = authorName
      if (testVersionId) {
        data.testVersionId = testVersionId
      }
      if (showMessageBody) {
        if (!notificationMessage)
          return notification({
            type: 'warn',
            msg: 'Please enter the message that you want to send the users',
          })
        data.notificationMessage = notificationMessage
      }
    }
    shareTest({ data, contentId: testId })
    // do it in a slight delay so that at the moment of blur it should not show warning
    setTimeout(() => {
      this.setState({
        currentUser: {},
        searchString: '',
      })
    }, 0)
  }

  getUserName(data) {
    const {
      userOrgData: { districts = [{}] },
      districtId,
    } = this.props
    // share modal is not for student so we can get
    const { districtName = '' } = districts.find(
      (d) => d.districtId === districtId
    )
    if (data.sharedType === 'PUBLIC') {
      return 'EVERYONE'
    }
    if (data.sharedType === 'DISTRICT') {
      return data.shareWithName ? data.shareWithName : districtName
    }
    return `${data.userName && data.userName !== 'null' ? data.userName : ''}`
  }

  getEmail = (data) => {
    if (data.sharedType === 'PUBLIC') {
      return ''
    }
    if (data.sharedType === 'DISTRICT') {
      return ''
    }
    return `${data.email && data.email !== 'null' ? ` (${data.email})` : ''}`
  }

  toggleSendNotification = (e) => {
    const { updateEmailNotificationData } = this.props
    updateEmailNotificationData({
      sendEmailNotification: e.target.checked,
      showMessageBody: false,
      notificationMessage: '',
    })
  }

  toggleMessageBody = () => {
    const { showMessageBody, updateEmailNotificationData } = this.props
    updateEmailNotificationData({
      showMessageBody: !showMessageBody,
      notificationMessage: '',
    })
  }

  handleMessageChange = ({ target: { value } }) => {
    const { updateEmailNotificationData } = this.props
    updateEmailNotificationData({ notificationMessage: value })
  }

  handleCopyBlock = () => {
    const { isPlaylist } = this.props
    return notification({
      type: 'warn',
      msg: `Kindly enable ${
        isPlaylist ? 'playlist' : 'test'
      } share to copy the URL`,
    })
  }

  render() {
    const {
      sharedType,
      permission,
      _permissionKeys,
      searchString,
      showWarning,
    } = this.state
    const {
      shareLabel,
      isVisible,
      onClose,
      userList = [],
      fetching,
      sharedUsersList,
      currentUserId,
      isPublished,
      testId,
      hasPremiumQuestion,
      isPlaylist,
      userOrgData,
      districtId,
      features,
      userRole,
      hasPlaylistEditAccess = true,
      testVersionId,
      userSignupStatus,
      sendEmailNotification,
      showMessageBody,
      notificationMessage,
      loadingSharedUsers,
      canAccessPublicContent,
      maxSharingLevelAllowed = shareLevel[sharedKeysObj.PUBLIC],
    } = this.props
    const filteredUserList = userList.filter(
      (user) =>
        sharedUsersList.every((people) => user._id !== people._userId) &&
        user._id !== currentUserId
    )
    let sharableURL = ''
    if (
      [sharedKeysObj.PUBLIC, sharedKeysObj.LINK].includes(sharedType) &&
      !isPlaylist
    ) {
      sharableURL = `${window.location.origin}/public/view-test/${testId}`
    } else if (isPlaylist) {
      sharableURL = `${window.location.origin}/author/playlists/${testId}`
    } else {
      sharableURL = `${window.location.origin}/author/tests/verid/${testVersionId}`
    }

    const { districts = [{}], schools } = userOrgData
    // share modal is not for student so we can get
    const { districtName = '' } = districts.find(
      (d) => d.districtId === districtId
    )
    const isDA = userRole === roleuser.DISTRICT_ADMIN
    let sharedTypeMessage = 'The entire Edulastic Community'
    if (sharedType === 'DISTRICT')
      sharedTypeMessage = `Anyone in ${districtName}`
    else if (sharedType === 'SCHOOL')
      sharedTypeMessage = `Anyone in ${schools.map((s) => s.name).join(', ')}`
    else if (sharedType === 'LINK')
      sharedTypeMessage = `Anyone with this link can access the test`

    const shareTypeKeysToDisplay = (isDA
      ? shareTypeKeyForDa
      : shareTypeKeys
    ).filter(
      (shareType) =>
        (isPlaylist &&
          ![sharedKeysObj.LINK, sharedKeysObj.PUBLIC].includes(shareType)) ||
        !isPlaylist
    )

    const individuals = sharedUsersList.filter(
      (item) => item.sharedType === sharedKeysObj.INDIVIDUAL
    )

    return (
      <SharingModal
        width="700px"
        footer={null}
        visible={isVisible}
        onCancel={onClose}
        centered
      >
        <ModalContainer>
          <h2 style={{ fontWeight: 'bold', fontSize: 20 }}>
            {isPublished
              ? 'Share with others'
              : 'Collaborate with other Co-Authors'}
          </h2>
          {!!(isPublished || (!isPublished && individuals.length)) && (
            <ShareBlock>
              {isPublished && (
                <>
                  <ShareLabel>{shareLabel || 'TEST URL'}</ShareLabel>
                  <FlexContainer>
                    {sharedUsersList.length === 0 && (
                      <CopyBlockLayer onClick={this.handleCopyBlock} />
                    )}
                    <TitleCopy copyable={{ text: sharableURL }}>
                      <ShareUrlDiv title={sharableURL}>
                        {sharableURL}
                      </ShareUrlDiv>
                    </TitleCopy>
                  </FlexContainer>
                </>
              )}
              {loadingSharedUsers && !sharedUsersList.length && <Spin />}
              {isPublished && sharedUsersList.length !== 0 && (
                <>
                  <ShareListTitle>WHO HAS ACCESS</ShareListTitle>
                  <ShareList data-cy="shareList">
                    {sharedUsersList.map((data, index) => (
                      <SharedRow
                        data={data}
                        key={index}
                        index={index}
                        getEmail={() => this.getEmail(data)}
                        getUserName={() => this.getUserName(data)}
                        removeHandler={() => this.removeHandler(data)}
                      />
                    ))}
                  </ShareList>
                </>
              )}
              {!isPublished && !!individuals.length && (
                <>
                  <ShareListTitle>CO-AUTHORS FOR THIS TEST</ShareListTitle>
                  <ShareList>
                    {individuals.map((data, index) => (
                      <SharedRow
                        data={data}
                        index={index}
                        getEmail={() => this.getEmail(data)}
                        getUserName={() => this.getUserName(data)}
                        removeHandler={() => this.removeHandler(data)}
                      />
                    ))}
                  </ShareList>
                </>
              )}
            </ShareBlock>
          )}
          <PeopleBlock>
            <PeopleLabel>
              {isPublished ? 'GIVE ACCESS TO' : 'Invite Co-Authors'}
            </PeopleLabel>
            {isPublished && (
              <RadioBtnWrapper>
                <RadioGrp
                  value={sharedType}
                  onChange={(e) => this.radioHandler(e)}
                >
                  {shareTypeKeysToDisplay
                    .filter((i) => {
                      return (
                        (i === sharedKeysObj.PUBLIC &&
                          canAccessPublicContent) ||
                        i !== sharedKeysObj.PUBLIC
                      )
                    })
                    .map((item) => (
                      <RadioBtn
                        value={item}
                        key={item}
                        disabled={
                          (!isPlaylist &&
                            item !== sharedKeysObj.LINK &&
                            shareLevel[item] > maxSharingLevelAllowed) ||
                          (!isPublished && item !== sharedKeysObj.INDIVIDUAL) ||
                          (hasPremiumQuestion &&
                            item === sharedKeysObj.PUBLIC) ||
                          features.isCurator ||
                          features.isPublisherAuthor ||
                          !hasPlaylistEditAccess ||
                          (userSignupStatus ===
                            signUpState.ACCESS_WITHOUT_SCHOOL &&
                            item !== sharedKeysObj.INDIVIDUAL)
                        }
                      >
                        {shareTypes[item]}
                      </RadioBtn>
                    ))}
                </RadioGrp>
              </RadioBtnWrapper>
            )}
            <FlexContainer
              style={{ marginTop: 5, position: 'relative' }}
              justifyContent="flex-start"
            >
              {sharedType === sharedKeysObj.INDIVIDUAL ? (
                <>
                  <AutoCompleteStyled
                    style={{ width: '100%' }}
                    onSearch={this.handleSearch}
                    onSelect={this.handleChange}
                    onBlur={() => {
                      if (searchString.length < 2) {
                        this.setState({ showWarning: true })
                      }
                    }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    placeholder="Enter names or email addresses"
                    data-cy="name-button-pop"
                    disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    value={searchString}
                    warning={showWarning}
                  >
                    {filteredUserList.map((item) => (
                      <Option
                        value={`${getFullNameFromAsString(
                          item._source
                        )}${'||'}${item._source.email}${'||['}${
                          roleuser.ROLE_LABEL[item._source.role]
                        }${']||'}${item._id}`}
                        key={item._id}
                      >
                        <span>
                          {`${item._source.firstName} ${item._source.lastName}`}
                          {`(${item._source.email})`}{' '}
                          <b>{`[${roleuser.ROLE_LABEL[item._source.role]}]`}</b>
                        </span>
                      </Option>
                    ))}
                  </AutoCompleteStyled>
                  <p
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 40,
                      color: '#f5222d',
                    }}
                  >
                    {showWarning && 'Please provide valid Username or Email id'}
                  </p>
                </>
              ) : (
                <ShareMessageWrapper data-cy="shareMessageWrapper">
                  {sharedTypeMessage}
                </ShareMessageWrapper>
              )}
              <IndividualSelectInputStyled
                style={
                  [
                    sharedKeysObj.INDIVIDUAL,
                    sharedKeysObj.SCHOOL,
                    sharedKeysObj.DISTRICT,
                    sharedKeysObj.LINK,
                  ].includes(sharedType)
                    ? { marginLeft: '0px' }
                    : { display: 'none' }
                }
                onChange={this.permissionHandler}
                data-cy="permission-button-pop"
                disabled={[sharedKeysObj.PUBLIC].includes(sharedType)}
                value={permission}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {sharedKeysObj.LINK !== sharedType
                  ? _permissionKeys.map((item) =>
                      (!isPublished && item === 'ASSIGN') ||
                      (item === 'EDIT' &&
                        [sharedKeysObj.SCHOOL, sharedKeysObj.DISTRICT].includes(
                          sharedType
                        )) ? null : (
                        <Select.Option value={item} key={permissions[item]}>
                          {permissions[item]}
                        </Select.Option>
                      )
                    )
                  : Object.keys(linkSharingPermissions).map((item) => (
                      <Select.Option
                        value={item}
                        key={linkSharingPermissions[item]}
                      >
                        {linkSharingPermissions[item]}
                      </Select.Option>
                    ))}
              </IndividualSelectInputStyled>
            </FlexContainer>
          </PeopleBlock>

          {sharedType === sharedKeysObj.INDIVIDUAL && (
            <NotificationBlock color={showMessageBody ? red : themeColor}>
              <div>
                <Checkbox
                  onChange={this.toggleSendNotification}
                  checked={sendEmailNotification}
                >
                  Send Email Notification
                </Checkbox>
                {sendEmailNotification && (
                  <span onClick={this.toggleMessageBody}>
                    {showMessageBody ? '-Discard Message' : '-Add Message'}
                  </span>
                )}
              </div>
              {showMessageBody && (
                <Input.TextArea
                  placeholder="Enter Message"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  value={notificationMessage}
                  onChange={this.handleMessageChange}
                />
              )}
            </NotificationBlock>
          )}

          <DoneButtonContainer>
            <EduButton
              height="32px"
              width={!isPublished ? '175px' : null}
              onClick={onClose}
              style={{ display: 'inline-flex' }}
            >
              Cancel
            </EduButton>
            <EduButton
              height="32px"
              width={!isPublished ? '175px' : null}
              data-cy="share-button-pop"
              onClick={this.handleShare}
              style={{ display: 'inline-flex' }}
            >
              <IconShare />
              {isPublished ? 'SHARE' : 'Invite Co-Authors'}
            </EduButton>
          </DoneButtonContainer>
        </ModalContainer>
      </SharingModal>
    )
  }
}

ShareModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  hasPremiumQuestion: PropTypes.bool,
  isPublished: PropTypes.bool,
}

ShareModal.defaultProps = {
  isPlaylist: false,
  hasPremiumQuestion: false,
  isPublished: false,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userList: getUsersListSelector(state),
      fetching: getFetchingSelector(state),
      sharedUsersList: getUserListSelector(state),
      currentUserId: _get(state, 'user.user._id', ''),
      features: getUserFeatures(state),
      userOrgData: getOrgDataSelector(state),
      districtId: getUserOrgId(state),
      userRole: getUserRole(state),
      userSignupStatus: getUserSignupStatusSelector(state),
      sharingState: getContentSharingStateSelector(state),
      authorName: getUserNameSelector(state),
      sendEmailNotification: getShouldSendEmailStateSelector(state),
      showMessageBody: getShowMessageBodyStateSelector(state),
      notificationMessage: getEmailNotificationMessageSelector(state),
      test: getTestEntitySelector(state),
      loadingSharedUsers: _get(state, 'tests.loadingSharedUsers', false),
      canAccessPublicContent: canAccessPublicContentSelector(state),
      maxSharingLevelAllowed: _get(
        state,
        'tests.maxSharingLevelAllowed',
        shareLevel[sharedKeysObj.LINK]
      ),
    }),
    {
      getUsers: fetchUsersListAction,
      updateShareList: updateUsersListAction,
      shareTest: sendTestShareAction,
      deleteShared: deleteSharedUserAction,
      updateEmailNotificationData: updateEmailNotificationDataAction,
    }
  )
)

export default enhance(ShareModal)

const SharingModal = styled(Modal)`
  .ant-modal-content {
    margin: 15px 0px;
  }
  .ant-modal-body {
    padding: 30px;
  }
`

const ModalContainer = styled.div`
  .anticon-down {
    svg {
      fill: ${themeColor};
    }
  }
`

const ShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${fadedGrey};
`

const ShareLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
`

const ShareMessageWrapper = styled.div`
  text-transform: uppercase;
  height: 35px;
  line-height: 35px;
  width: 100%;
`

const ShareList = styled.div`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  max-height: 110px;
  overflow: auto;
  width: 90%;
  margin-top: 10px;
  background: ${backgroundGrey2};

  span {
    text-transform: none;
    font-weight: normal;
  }
`

const ShareListTitle = styled.div`
  margin-top: 10px;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: ${(props) => props.theme.semiBold};
`

const PeopleBlock = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;

  .ant-radio {
    margin-right: 5px;
  }
`
const NotificationBlock = styled.div`
  margin-top: 15px;
  .ant-checkbox-wrapper {
    font-weight: 600;
    & + span {
      display: inline-block;
      color: ${({ color }) => color};
      cursor: pointer;
    }
  }
  > textarea {
    margin-top: 10px;
  }
`

const DoneButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`

const IndividualSelectInputStyled = styled(SelectInputStyled)`
  &.ant-select {
    &:nth-child(1) {
      margin-right: 10px;
    }
    @media (max-width: ${mobileWidthMax}) {
      width: 100%;
      margin-top: 5px;
      margin-right: 0px !important;
    }
  }
`

const AutoCompleteStyled = styled(AutoComplete)`
  &.ant-select {
    &:nth-child(1) {
      margin-right: 10px;
    }
    @media (max-width: ${mobileWidthMax}) {
      width: 100%;
      margin-top: 5px;
      margin-right: 0px !important;
    }
  }
  &.ant-select-auto-complete.ant-select .ant-input {
    height: 40px;
    border: 1px solid #b9b9b9;
    color: rgb(106, 115, 127);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.38;
    ${(props) => {
      if (props.warning) {
        return 'border: 1px solid #f5222d'
      }
    }}
  }
`

const RadioBtnWrapper = styled(RadioInputWrapper)`
  font-weight: 600;
  margin: 10px 0px;
`
const PeopleLabel = styled.span`
  font-size: 13;
  font-weight: 600;
`
const CloseIcon = styled(IconClose)`
  width: 11px;
  height: 16px;
  margin-top: 4px;
  fill: ${greenDark};
`

export const ShareUrlDiv = styled.div`
  display: flex;
  color: ${themeColor};
  font-weight: 600;
  align-items: center;
`

export const TitleCopy = styled(Paragraph)`
  div:first-child {
    background-color: ${whiteSmoke};
    display: block;
    width: 90%;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid ${fadedGrey};
    color: #5d616f;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.ant-typography {
    color: ${themeColor};
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  button {
    margin-right: 10px;
  }
  .anticon {
    margin-top: 10px;
  }
  i.anticon.anticon-copy {
    display: flex;
    align-items: center;
    &:after {
      content: 'COPY';
      font-size: 12px;
      color: ${themeColor};
      margin-left: 3px;
    }
  }
  svg {
    width: 20px;
    height: 20px;
    color: ${themeColor};
  }
`
export const CopyBlockLayer = styled.div`
  position: absolute;
  width: 92%;
  height: 45px;
`
