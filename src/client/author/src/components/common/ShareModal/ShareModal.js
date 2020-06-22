import { backgroundGrey2, fadedGrey, greenDark, themeColor, whiteSmoke, mobileWidthMax } from "@edulastic/colors";
import { EduButton, FlexContainer, RadioBtn, RadioGrp, SelectInputStyled, notification } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { IconClose, IconShare } from "@edulastic/icons";
import { Col, Row, Select, Spin, Typography, Modal } from "antd";
import { debounce, get as _get, isUndefined } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
import { getFullNameFromAsString } from "../../../../../common/utils/helpers";
import { isFeatureAccessible } from "../../../../../features/components/FeaturesSwitch";
import { getUserFeatures } from "../../../../../student/Login/ducks";
import {
  fetchUsersListAction,
  getFetchingSelector,
  getUsersListSelector,
  updateUsersListAction
} from "../../../../sharedDucks/userDetails";
import {
  deleteSharedUserAction,
  getUserListSelector,
  receiveSharedWithListAction,
  sendTestShareAction
} from "../../../../TestPage/ducks";
import { getOrgDataSelector, getUserRole } from "../../../selectors/user";
import { RadioInputWrapper } from "../RadioInput";

const { Paragraph } = Typography;

const permissions = {
  EDIT: "Can Edit, Add/Remove Items",
  VIEW: "Can View & Duplicate"
};

const permissionKeys = ["EDIT", "VIEW"];

const shareTypes = {
  PUBLIC: "Everyone",
  DISTRICT: "District",
  SCHOOL: "School",
  INDIVIDUAL: "Individuals"
};

const sharedKeysObj = {
  PUBLIC: "PUBLIC",
  DISTRICT: "DISTRICT",
  SCHOOL: "SCHOOL",
  INDIVIDUAL: "INDIVIDUAL"
};

const shareTypeKeys = ["PUBLIC", "DISTRICT", "SCHOOL", "INDIVIDUAL"];
const shareTypeKeyForDa = ["PUBLIC", "DISTRICT", "INDIVIDUAL"];
class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedType: sharedKeysObj.INDIVIDUAL,
      searchString: "",
      currentUser: {},
      permission: (isUndefined(props.hasPlaylistEditAccess) ?
        props.features.editPermissionOnTestSharing :
        (props.features.editPermissionOnTestSharing && props.hasPlaylistEditAccess)) ? "EDIT" : "VIEW",
      _permissionKeys: (isUndefined(props.hasPlaylistEditAccess) ?
        props.features.editPermissionOnTestSharing :
        (props.features.editPermissionOnTestSharing && props.hasPlaylistEditAccess)) ? permissionKeys : [permissionKeys[1]]
    }
    this.handleSearch = this.handleSearch.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, gradeSubject } = nextProps;
    const { grades, subjects } = gradeSubject || {};
    if (
      features.editPermissionOnTestSharing === false &&
      grades &&
      subjects &&
      isFeatureAccessible({
        features,
        inputFeatures: "editPermissionOnTestSharing",
        gradeSubject
      })
    ) {
      return {
        permission: "EDIT",
        _permissionKeys: permissionKeys
      };
    }
    if (!features.editPermissionOnTestSharing) {
      return {
        permission: "VIEW",
        _permissionKeys: [permissionKeys[1]]
      };
    }
  }

  componentDidMount() {
    const { getSharedUsers, match, isPlaylist, userRole } = this.props;
    const testId = match.params.id;
    const isDA = userRole === roleuser.DISTRICT_ADMIN;
    if (isDA) {
      this.setState({ sharedType: sharedKeysObj.DISTRICT, permission: "VIEW" });
    }
    if (testId && testId !== "undefined")
      getSharedUsers({ contentId: testId, contentType: isPlaylist ? "PLAYLIST" : "TEST" });
  }

  radioHandler = e => {
    this.setState({ sharedType: e.target.value });
    const { hasPlaylistEditAccess } = this.props;
    if (e.target.value !== sharedKeysObj.INDIVIDUAL || !hasPlaylistEditAccess) {
      this.setState({
        permission: "VIEW"
      });
    } else {
      this.setState({
        permission: "EDIT"
      });
    }
  };

  removeHandler = data => {
    const { deleteShared, testId, isPlaylist } = this.props;
    const { sharedId, _userId: sharedWith } = data;
    const contentType = isPlaylist ? "PLAYLIST" : "TEST";

    deleteShared({ contentId: testId, sharedId, sharedWith, contentType });
  };

  permissionHandler = value => {
    const { currentUser } = this.state;
    this.setState({ permission: value, currentUser: { ...currentUser, permission: value } });
  };

  searchUser = debounce(value => {
    const { sharedType } = this.state;
    const { getUsers } = this.props;
    const searchBody = {
      limit: 10,
      page: 1,
      type: sharedType,
      search: {
        role: ["teacher", "school-admin", "district-admin"],
        searchString: value
      }
    };
    getUsers(searchBody);
  }, 500);

  handleSearch(value) {
    const { updateShareList } = this.props;
    if (value.length) this.setState({ searchString: value, currentUser: {} });

    if (value.length > 1) {
      this.searchUser(value);
    } else {
      updateShareList({ data: [] });
    }
  }

  handleChange = value => {
    const { permission } = this.state;
    const [userName, email, _userId] = value.split("||");
    const newState = {
      userName,
      email,
      _userId,
      permission
    };
    this.setState({
      currentUser: newState
    });
  };

  handleShare = () => {
    const { currentUser, sharedType, permission, searchString } = this.state;
    const { shareTest, testId, sharedUsersList, isPlaylist } = this.props;
    const isExisting = sharedUsersList.some(item => item._userId === currentUser._userId);
    if (!(searchString.length > 1) && !Object.keys(currentUser).length && sharedType === sharedKeysObj.INDIVIDUAL)
      return;
    let person = {};
    let emails = [];
    if (sharedType === sharedKeysObj.INDIVIDUAL) {
      if (Object.keys(currentUser).length === 0) {
        if (!searchString.length) return notification({ messageKey: "pleaseSelectAnyUser" });
        emails = searchString.split(",");
      } else if (isExisting) {
        notification({ messageKey: "userHasPermission" });
        return;
      } else {
        const { _userId, userName, email } = currentUser;
        person = { sharedWith: [{ _id: _userId, name: userName, email }] };
      }
    } else {
      const isTypeExisting = sharedUsersList.some(item => item.userName === shareTypes[sharedType]);
      if (isTypeExisting) {
        notification({ msg: `You have shared with ${shareTypes[sharedType]} try other option` });
        return;
      }
    }
    const data = {
      ...person,
      emails,
      sharedType,
      permission,
      contentType: isPlaylist ? "PLAYLIST" : "TEST"
    };
    shareTest({ data, contentId: testId });
    this.setState({
      currentUser: {},
      searchString: ""
    });
  };

  getUserName(data) {
    const {
      userOrgData: { districts }
    } = this.props;
    // share modal is not for student so we can get
    const { districtName } = districts?.[0] || {};
    if (data.sharedType === "PUBLIC") {
      return "EVERYONE";
    }
    if (data.sharedType === "DISTRICT") {
      return districtName;
    }
    return `${data.userName && data.userName !== "null" ? data.userName : ""}`;
  }

  getEmail(data) {
    if (data.sharedType === "PUBLIC") {
      return "";
    }
    if (data.sharedType === "DISTRICT") {
      return "";
    }
    return `${data.email && data.email !== "null" ? ` (${data.email})` : ""}`;
  }

  render() {
    const { sharedType, permission, _permissionKeys, currentUser } = this.state;
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
      features,
      userRole,
      hasPlaylistEditAccess = true
    } = this.props;
    const filteredUserList = userList.filter(
      user => sharedUsersList.every(people => user._id !== people._userId) && user._id !== currentUserId
    );
    let sharableURL = "";
    if (sharedType === "PUBLIC" && !isPlaylist) {
      sharableURL = `${window.location.origin}/public/view-test/${testId}`;
    } else {
      sharableURL = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${testId}`;
    }

    const userSelectedLabel = `${currentUser.userName ? `${currentUser.userName},` : ""}${
      currentUser.email ? currentUser.email : ""
      }`;
    const { districts, schools } = userOrgData;
    // share modal is not for student so we can get
    const { districtName } = districts?.[0] || {}
    const isDA = userRole === roleuser.DISTRICT_ADMIN;
    let sharedTypeMessage = "The entire Edulastic Community";
    if (sharedType === "DISTRICT") sharedTypeMessage = `Anyone in ${districtName}`;
    else if (sharedType === "SCHOOL") sharedTypeMessage = `Anyone in ${schools.map(s => s.name).join(", ")}`;
    return (
      <SharingModal width="700px" footer={null} visible={isVisible} onCancel={onClose} centered>
        <ModalContainer>
          <h2 style={{ fontWeight: "bold", fontSize: 20 }}>Share with others</h2>
          <ShareBlock>
            <ShareLabel>{shareLabel || "TEST URL"}</ShareLabel>
            <FlexContainer>
              <TitleCopy copyable={{ text: sharableURL }}>
                <ShareUrlDiv title={sharableURL}>{sharableURL}</ShareUrlDiv>
              </TitleCopy>
            </FlexContainer>
            {sharedUsersList.length !== 0 && (
              <>
                <ShareListTitle>Who has access</ShareListTitle>
                <ShareList>
                  {sharedUsersList.map((data, index) => (
                    <Row
                      key={index}
                      style={{
                        paddingBottom: 5,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Col span={12}>
                        {this.getUserName(data)}
                        <span>{this.getEmail(data)}</span>
                      </Col>
                      <Col span={11}>
                        <span>{data.permission === "EDIT" && "Can Edit, Add/Remove Items"}</span>
                        <span>{data.permission === "VIEW" && "Can View & Duplicate"}</span>
                      </Col>
                      <Col span={1}>
                        <a data-cy="share-button-close" onClick={() => this.removeHandler(data)}>
                          <CloseIcon />
                        </a>
                      </Col>
                    </Row>
                  ))}
                </ShareList>
              </>
            )}
          </ShareBlock>
          <PeopleBlock>
            <PeopleLabel>GIVE ACCESS TO</PeopleLabel>
            <RadioBtnWrapper>
              <RadioGrp value={sharedType} onChange={e => this.radioHandler(e)}>
                {(isDA ? shareTypeKeyForDa : shareTypeKeys).map(item => (
                  <RadioBtn
                    value={item}
                    key={item}
                    disabled={
                      (!isPublished && item !== shareTypeKeys[3]) ||
                      (item === shareTypeKeys[0] && hasPremiumQuestion) ||
                      ((features.isCurator || features.isPublisherAuthor || !hasPlaylistEditAccess) && item === "PUBLIC")
                    }
                  >
                    {shareTypes[item]}
                  </RadioBtn>
                ))}
              </RadioGrp>
            </RadioBtnWrapper>
            <FlexContainer style={{ marginTop: 5 }} justifyContent="flex-start">
              {sharedType === sharedKeysObj.INDIVIDUAL ? (
                <IndividualSelectInputStyled
                  showSearch
                  placeholder="Enter names or email addresses"
                  data-cy="name-button-pop"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleSearch}
                  onChange={this.handleChange}
                  disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  value={userSelectedLabel}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {filteredUserList.map(item => (
                    <Select.Option
                      value={`${getFullNameFromAsString(item._source)}${"||"}${item._source.email}${"||"}${item._id}`}
                      key={item._id}
                    >
                      {item._source.firstName} {item._source.lastName ? `${item._source.lastName} ` : ""}
                      {`(${item._source.email})`}
                    </Select.Option>
                  ))}
                </IndividualSelectInputStyled>
              ) : (
                <ShareMessageWrapper>{sharedTypeMessage}</ShareMessageWrapper>
                )}
              <IndividualSelectInputStyled
                style={sharedType === sharedKeysObj.INDIVIDUAL ? { marginLeft: "0px" } : { display: "none" }}
                onChange={this.permissionHandler}
                data-cy="permission-button-pop"
                disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                value={permission}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {_permissionKeys.map(item => (
                  <Select.Option value={item} key={permissions[item]}>
                    {permissions[item]}
                  </Select.Option>
                ))}
              </IndividualSelectInputStyled>
            </FlexContainer>
          </PeopleBlock>
          <DoneButtonContainer>
            <EduButton height="32px" onClick={onClose} style={{ display: "inline-flex" }}>
              Cancel
            </EduButton>
            <EduButton
              height="32px"
              data-cy="share-button-pop"
              onClick={this.handleShare}
              style={{ display: "inline-flex" }}
            >
              <IconShare />
              SHARE
            </EduButton>
          </DoneButtonContainer>
        </ModalContainer>
      </SharingModal>
    );
  }
}

ShareModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  hasPremiumQuestion: PropTypes.bool,
  isPublished: PropTypes.bool
};

ShareModal.defaultProps = {
  isPlaylist: false,
  hasPremiumQuestion: false,
  isPublished: false

};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      userList: getUsersListSelector(state),
      fetching: getFetchingSelector(state),
      sharedUsersList: getUserListSelector(state),
      currentUserId: _get(state, "user.user._id", ""),
      features: getUserFeatures(state),
      userOrgData: getOrgDataSelector(state),
      userRole: getUserRole(state)
    }),
    {
      getUsers: fetchUsersListAction,
      updateShareList: updateUsersListAction,
      shareTest: sendTestShareAction,
      getSharedUsers: receiveSharedWithListAction,
      deleteShared: deleteSharedUserAction
    }
  )
);

export default enhance(ShareModal);

const SharingModal = styled(Modal)`
  .ant-modal-content {
    margin: 15px 0px;
  }
  .ant-modal-body {
    padding: 30px;
  }
`;

const ModalContainer = styled.div`
  .anticon-down {
    svg {
      fill: ${themeColor};
    }
  }
`;

const ShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${fadedGrey};
`;

const ShareLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const ShareMessageWrapper = styled.div`
  text-transform: uppercase;
  height: 35px;
  line-height: 35px;
`;

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
`;

const ShareListTitle = styled.div`
  margin-top: 10px;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: ${props => props.theme.semiBold};
`;

const PeopleBlock = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;

  .ant-radio {
    margin-right: 5px;
  }
`;

const DoneButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

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
`;

const RadioBtnWrapper = styled(RadioInputWrapper)`
  font-weight: 600;
  margin: 10px 0px;
`;
const PeopleLabel = styled.span`
  font-size: 13;
  font-weight: 600;
`;
const CloseIcon = styled(IconClose)`
  width: 11px;
  height: 16px;
  margin-top: 4px;
  fill: ${greenDark};
`;

export const ShareUrlDiv = styled.div`
  display: flex;
  color: ${themeColor};
  font-weight: 600;
  align-items: center;
`;

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
      content: "COPY";
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
`;
