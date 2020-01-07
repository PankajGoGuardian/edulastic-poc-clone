import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Radio, Spin, Button, Row, Col, Select, message, Typography } from "antd";
import { debounce, get as _get, isEmpty } from "lodash";
import { withRouter } from "react-router-dom";

import { FlexContainer } from "@edulastic/common";
import { themeColor, whiteSmoke, greenDark, fadedGrey, white, backgroundGrey2 } from "@edulastic/colors";
import { IconClose, IconShare } from "@edulastic/icons";
import { roleuser } from "@edulastic/constants";
import { getUserFeatures } from "../../../../../student/Login/ducks";
import { RadioInputWrapper } from "../RadioInput";
import { isFeatureAccessible } from "../../../../../features/components/FeaturesSwitch";

import {
  getTestIdSelector,
  getUserListSelector,
  sendTestShareAction,
  receiveSharedWithListAction,
  deleteSharedUserAction
} from "../../../../TestPage/ducks";

import {
  getUsersListSelector,
  getFetchingSelector,
  fetchUsersListAction,
  updateUsersListAction
} from "../../../../sharedDucks/userDetails";
import { MAX_TAB_WIDTH } from "../../../constants/others";

import { getOrgDataSelector, getUserRole } from "../../../selectors/user";
import { getFullNameFromAsString } from "../../../../../common/utils/helpers";

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
const shareTypeKeyForDa = ["DISTRICT"];
class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedType: sharedKeysObj.INDIVIDUAL,
      searchString: "",
      currentUser: {},
      permission: props.features["editPermissionOnTestSharing"] ? "EDIT" : "VIEW",
      _permissionKeys: props.features["editPermissionOnTestSharing"] ? permissionKeys : [permissionKeys[1]]
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    const { features, gradeSubject } = nextProps;
    const { grades, subjects } = gradeSubject || {};
    if (
      features["editPermissionOnTestSharing"] === false &&
      grades &&
      subjects &&
      isFeatureAccessible({
        features: features,
        inputFeatures: "editPermissionOnTestSharing",
        gradeSubject
      })
    ) {
      return {
        permission: "EDIT",
        _permissionKeys: permissionKeys
      };
    } else if (!features["editPermissionOnTestSharing"]) {
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
    if (e.target.value !== sharedKeysObj.INDIVIDUAL) {
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
        role: "teacher",
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
    let person = {},
      emails = [];
    if (sharedType === sharedKeysObj.INDIVIDUAL) {
      if (Object.keys(currentUser).length === 0) {
        if (!searchString.length) return message.error("Please select any user which are not in the shared list");
        emails = searchString.split(",");
      } else if (isExisting) {
        return message.error("This user has permission");
      } else {
        const { _userId, userName, email } = currentUser;
        person = { sharedWith: [{ _id: _userId, name: userName, email }] };
      }
    } else {
      const isTypeExisting = sharedUsersList.some(item => item.userName === shareTypes[sharedType]);
      if (isTypeExisting) {
        return message.error(`You have shared with ${shareTypes[sharedType]} try other option`);
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
      userOrgData: { districtName }
    } = this.props;
    if (data.sharedType === "PUBLIC") {
      return "EVERYONE";
    } else if (data.sharedType === "DISTRICT") {
      return districtName;
    } else {
      return `${data.userName && data.userName !== "null" ? data.userName : ""}`;
    }
  }

  getEmail(data) {
    if (data.sharedType === "PUBLIC") {
      return "";
    } else if (data.sharedType === "DISTRICT") {
      return "";
    } else {
      return `${data.email && data.email !== "null" ? ` (${data.email})` : ""}`;
    }
  }

  render() {
    const { sharedType, permission, _permissionKeys, currentUser } = this.state;
    const {
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
      userRole
    } = this.props;
    const filteredUserList = userList.filter(
      user => sharedUsersList.every(people => user._id !== people._userId) && user._id !== currentUserId
    );
    const sharableURL = `${window.location.origin}/author/${isPlaylist ? "playlists" : "tests"}/${testId}`;

    const userSelectedLabel = `${currentUser.userName ? `${currentUser.userName},` : ""}${
      currentUser.email ? currentUser.email : ""
    }`;
    const { districtName, schools } = userOrgData;
    const isDA = userRole === roleuser.DISTRICT_ADMIN;
    let sharedTypeMessage = "The entire Edulastic Community";
    if (sharedType === "DISTRICT") sharedTypeMessage = `Anyone in ${districtName}`;
    else if (sharedType === "SCHOOL") sharedTypeMessage = `Anyone in ${schools.map(s => s.name).join(", ")}`;
    return (
      <Modal open={isVisible} onClose={onClose} center styles={{ modal: { borderRadius: 5 } }}>
        <ModalContainer>
          <h2 style={{ fontWeight: "bold", fontSize: 20 }}>Share with others</h2>
          <ShareBlock>
            <ShareLabel>TEST URL</ShareLabel>
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
              <Radio.Group value={sharedType} onChange={e => this.radioHandler(e)}>
                {(isDA ? shareTypeKeyForDa : shareTypeKeys).map(item => (
                  <Radio
                    value={item}
                    key={item}
                    disabled={
                      (!isPublished && item !== shareTypeKeys[3]) ||
                      (item === shareTypeKeys[0] && hasPremiumQuestion) ||
                      ((features.isCurator || features.isPublisherAuthor) && item === "PUBLIC")
                    }
                  >
                    {shareTypes[item]}
                  </Radio>
                ))}
              </Radio.Group>
              <ShareButton type="primary" data-cy="share-button-pop" onClick={this.handleShare}>
                <IconShare color={white} /> SHARE
              </ShareButton>
            </RadioBtnWrapper>
            <FlexContainer style={{ marginTop: 5 }} justifyContent="flex-start">
              {sharedType === "INDIVIDUAL" ? (
                <Address
                  showSearch
                  placeholder={"Enter names or email addresses"}
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
                </Address>
              ) : (
                <ShareMessageWrapper>{sharedTypeMessage}</ShareMessageWrapper>
              )}
              <Select
                style={
                  sharedType === "INDIVIDUAL"
                    ? { margin: "0px 10px", height: "35px", width: "270px" }
                    : { display: "none" }
                }
                onChange={this.permissionHandler}
                data-cy="permission-button-pop"
                disabled={sharedType !== sharedKeysObj.INDIVIDUAL}
                value={permission}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {_permissionKeys.map(item => {
                  return (
                    <Select.Option value={item} key={permissions[item]}>
                      {permissions[item]}
                    </Select.Option>
                  );
                })}
              </Select>
            </FlexContainer>
          </PeopleBlock>
          <DoneButtonContainer>
            <DoneButton type="primary" onClick={onClose}>
              Done
            </DoneButton>
          </DoneButtonContainer>
        </ModalContainer>
      </Modal>
    );
  }
}

ShareModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPlaylist: PropTypes.bool,
  hasPremiumQuestion: PropTypes.bool,
  isPublished: PropTypes.bool,
  gradeSubject: PropTypes.object
};

ShareModal.defaultProps = {
  isPlaylist: false,
  gradeSubject: {}
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

const ModalContainer = styled.div`
  width: 700px;
  padding: 20px 30px;
  .anticon-down {
    svg {
      fill: ${themeColor};
    }
  }
  @media (max-width: ${MAX_TAB_WIDTH - 1}px) {
    width: 90vw;
    padding: 5px;
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
const ShareTitle = styled.div`
  background-color: ${whiteSmoke};
  border-radius: 4px;
  display: flex;
  padding: 10px;
  border: 1px solid ${fadedGrey};
  width: 100%;
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

const Address = styled(Select)`
  min-height: 35px;
  width: 285px;
  .ant-select-selection {
    height: 35px;
  }
  ::placeholder {
    font-size: 13px;
    font-style: italic;
  }
`;

const ShareButton = styled(Button)`
  height: 35px;
  width: 135px;
  background: ${themeColor};
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  &:hover,
  &:focus {
    background: ${themeColor};
    border-color: ${themeColor};
  }
  span {
    font-size: 12px;
    font-weight: 600;
    margin-left: 18px;
  }
`;

const DoneButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const DoneButton = styled(ShareButton)`
  margin: auto;
  margin-top: 20px;
  margin-left: auto;
  > span {
    margin: auto;
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
    display: flex;
    width: 90%;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid ${fadedGrey};
    color: #5d616f;
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
